// Renames BINDINGS only, in code regions only: skips comments, strings, template text, regex,
// property access (`.x`) and object keys (`{ x:`). Shorthand `{ x }` becomes `{ x: newX }` so the
// property name — data format, HTML, historico.jsonl — never changes.
import fs from 'node:fs';
import { lex, identsInCode } from './lex.mjs';

const [file, mapFile] = process.argv.slice(2);
const MAP = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
const src = fs.readFileSync(file, 'utf8');
const kind = lex(src);
const toks = identsInCode(src, kind);
const edits = [];
const stats = {};
for (const t of toks) {
  const to = MAP[t.name]; if (!to) continue;
  if (t.before === '.' && src[t.beforeIdx - 1] !== '.') continue;                                 // property access
  const isKey = t.after === ':' && (t.before === '{' || t.before === ',') && kind[t.beforeIdx] === 0;
  if (isKey) continue;                                            // object key / destructuring key
  // shorthand property or destructuring shorthand: `{ x,` `{ x }` `, x }` `, x,`
  const afterIdx = src.indexOf(t.after, t.e);
  const short = (t.before === '{' || t.before === ',') && (t.after === ',' || t.after === '}') && kind[t.beforeIdx] === 0 && kind[afterIdx] === 0;
  // but `,` before can also be a plain argument list `(a, x)` — only treat as shorthand when the
  // enclosing bracket is `{`
  let shorthand = false;
  if (short) {
    let depth = 0;
    for (let j = t.s - 1; j >= 0; j--) {
      if (kind[j] !== 0) continue;
      const ch = src[j];
      if (ch === ')' || ch === ']' || ch === '}') depth++;
      else if (ch === '(' || ch === '[' || ch === '{') { if (depth === 0) { shorthand = ch === '{'; break; } depth--; }
    }
  }
  edits.push({ s: t.s, e: t.e, text: shorthand ? t.name + ': ' + to : to });
  stats[t.name] = (stats[t.name] || 0) + 1;
}
let out = '', last = 0;
for (const ed of edits) { out += src.slice(last, ed.s) + ed.text; last = ed.e; }
out += src.slice(last);
fs.writeFileSync(file, out);
const unused = Object.keys(MAP).filter(k => !stats[k]);
console.log(edits.length + ' renames; unused map entries: ' + (unused.join(', ') || 'none'));
