function compileOperator(op, items, prepend) {

  if (op === '=') {
    op = '===';
  } else if (op === '!=') {
    op = '!==';
  }

  return "("
    + (prepend ? (prepend + ' ' + op + ' ') : '')
    + items.map(item => item.compile(true)).join(' ' + op + ' ')
    + ")";
}

export default compileOperator;
