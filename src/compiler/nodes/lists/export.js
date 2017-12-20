import { die } from '../../utils';

function aritize(word) {
  const arityMatch = /\/\d+$/;
  let arity = null;
  if (arityMatch.test(word)) {
    arity = word.match(arityMatch)[0].slice(1);
    word = word.replace(arityMatch, '');
  }
  return {
    clean: word,
    aritized: arity ? `PINE_.aritize_(${word}, ${arity})` : word
  };
}

function compileExport(items) {
  const toExport = items[0];

  if (items.length > 1) {
    die(this, 'You can only export a single value. Try an object or an array instead.');
  }

  if (toExport.type === 'Arr') {
    return 'module.exports = {'
      + toExport.items.map(item => {
          const ident = aritize(item.compile(true));
          return `[Symbol.for("${ident.clean}")]: ${ident.aritized}`;
        }).join(', ')
      + '}'
  }

  if (toExport.type === 'Obj') {
    return 'module.exports = {'
      + toExport.items.map((item, index) => {
          if (index % 2 === 0) { // key
            const symbol = item.type === 'Symbol';
            return (symbol ? '[' : '"') + item.compile(true) + (symbol ? ']' : '"') + ':';
          } else { // value
            const ident = aritize(item.compile(true));
            return ident.aritized + (index === toExport.length - 1 ? '' : ',');
          }
        }).join(' ')
      + '}';
  }

  if (toExport.type === 'Identifier') {
    const ident = aritize(toExport.compile(true));
    return `module.exports = {[Symbol.for("${ident.clean}")]: ${ident.aritized}}`;
  }

  die(this, 'You can only export named references.');
}

export default compileExport;
