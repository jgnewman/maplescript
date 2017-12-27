function compileOperator(op, items, prepend) {

  switch (op) {
    case '='  : op = '==='; break;
    case '!=' : op = '!=='; break;
    case '?<' : op = '<';   break;
    case '?>' : op = '>';   break;
  }

  return "("
    + (prepend ? (prepend + ' ' + op + ' ') : '')
    + items.map(item => item.compile(true)).join(' ' + op + ' ')
    + ")";
}

export default compileOperator;
