// Minimal JS lexer: classifies every char of a source as code / comment / string / template text / regex.
// Template `${ … }` holes count as code. Good enough to rename bindings without touching output text.
import fs from 'node:fs';

export function lex(src) {
  const kind = new Uint8Array(src.length); // 0 code, 1 comment, 2 string, 3 template text, 4 regex
  let i = 0;
  const stack = []; // template nesting: number of open braces inside current hole
  let lastSig = ''; // last significant code token (for regex detection)
  const isIdent = (c) => /[A-Za-z0-9_$]/.test(c);
  const regexAllowed = () => {
    if (!lastSig) return true;
    if (/^[A-Za-z0-9_$)\]]$/.test(lastSig[lastSig.length - 1])) {
      return /^(return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else)$/.test(lastSig);
    }
    return true; // after ( , = : [ ! & | ? { } ; + - * % < > ~ ^
  };
  const mark = (from, to, k) => { for (let j = from; j < to; j++) kind[j] = k; };
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    // inside a template hole, track braces
    if (c === '/' && n === '/') { const e = src.indexOf('\n', i); const end = e < 0 ? src.length : e; mark(i, end, 1); i = end; continue; }
    if (c === '/' && n === '*') { const e = src.indexOf('*/', i + 2); const end = e < 0 ? src.length : e + 2; mark(i, end, 1); i = end; continue; }
    if (c === '\'' || c === '"') {
      let j = i + 1; while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; j++; }
      mark(i, j + 1, 2); i = j + 1; lastSig = 'x'; continue;
    }
    if (c === '`') {
      // template: scan text until ` or ${
      let j = i + 1; kind[i] = 3;
      for (;;) {
        if (j >= src.length) break;
        if (src[j] === '\\') { kind[j] = 3; kind[j + 1] = 3; j += 2; continue; }
        if (src[j] === '`') { kind[j] = 3; j++; break; }
        if (src[j] === '$' && src[j + 1] === '{') { kind[j] = 3; kind[j + 1] = 3; j += 2; stack.push(0); break; }
        kind[j] = 3; j++;
      }
      i = j; lastSig = 'x';
      if (stack.length) { /* now in code inside hole */ }
      continue;
    }
    if (stack.length) {
      if (c === '{') stack[stack.length - 1]++;
      else if (c === '}') {
        if (stack[stack.length - 1] === 0) {
          // end of hole: resume template text
          stack.pop(); kind[i] = 3; let j = i + 1;
          for (;;) {
            if (j >= src.length) break;
            if (src[j] === '\\') { kind[j] = 3; kind[j + 1] = 3; j += 2; continue; }
            if (src[j] === '`') { kind[j] = 3; j++; break; }
            if (src[j] === '$' && src[j + 1] === '{') { kind[j] = 3; kind[j + 1] = 3; j += 2; stack.push(0); break; }
            kind[j] = 3; j++;
          }
          i = j; lastSig = 'x'; continue;
        } else stack[stack.length - 1]--;
      }
    }
    if (c === '/' && regexAllowed()) {
      let j = i + 1, inClass = false;
      while (j < src.length) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === '\n') break;
        if (inClass) { if (src[j] === ']') inClass = false; j++; continue; }
        if (src[j] === '[') { inClass = true; j++; continue; }
        if (src[j] === '/') break;
        j++;
      }
      j++; while (j < src.length && /[a-z]/.test(src[j])) j++;
      mark(i, j, 4); i = j; lastSig = 'x'; continue;
    }
    if (isIdent(c)) { let j = i; while (j < src.length && isIdent(src[j])) j++; lastSig = src.slice(i, j); i = j; continue; }
    if (!/\s/.test(c)) lastSig = c;
    i++;
  }
  return kind;
}

// identifiers in code regions, with the char before (skipping spaces) and after, so the caller can
// tell property access (`.x`), object key (`{ x:`), and shorthand (`{ x,`) apart
export function identsInCode(src, kind) {
  const out = [];
  const re = /[A-Za-z_$][A-Za-z0-9_$]*/g;
  let m;
  while ((m = re.exec(src))) {
    const s = m.index, e = s + m[0].length;
    if (kind[s] !== 0) continue;
    if (s > 0 && /[0-9]/.test(src[s - 1])) continue;
    let b = s - 1; while (b >= 0 && (kind[b] !== 0 || /[ \t\r\n]/.test(src[b]))) b--;
    let a = e; while (a < src.length && (kind[a] === 1 || /[ \t]/.test(src[a]))) a++;
    out.push({ name: m[0], s, e, before: src[b] || '', after: src[a] || '', beforeIdx: b });
  }
  return out;
}

if (process.argv[1] && process.argv[1].endsWith('lex.mjs') && process.argv[2]) {
  const src = fs.readFileSync(process.argv[2], 'utf8');
  const kind = lex(src);
  const counts = {};
  for (const t of identsInCode(src, kind)) {
    if (t.before === '.') continue;
    counts[t.name] = (counts[t.name] || 0) + 1;
  }
  console.log(Object.entries(counts).sort().map(([k, v]) => k + ':' + v).join(' '));
}
