import { die } from '../../utils';

function compileImport(items) {
  if (items.length === 1) { // just location
    return `require(${items[0].compile(true)})`;
  }

  if (items.length === 2) { // location and name
    return `const ${items[1].compile(true)} = require(${items[0].compile(true)})`;
  }

  die(this, 'Import statements can only take 1 or 2 arguments.');
}

export default compileImport;
