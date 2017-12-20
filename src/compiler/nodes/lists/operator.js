function compileOperator(op, items, prepend) {
  return "("
    + (prepend ? (prepend + ' ' + op + ' ') : '')
    + items.map(item => item.compile(true)).join(' ' + op + ' ')
    + ")";
}

export default compileOperator;
