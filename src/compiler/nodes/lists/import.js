import { die } from '../../utils';

function compileImport(items) {
  if (items.length === 1) { // just location
    return `require(${items[0].compile(true)})`;
  }

  if (items.length === 2) { // location and name(s)
    const modLocation = items[0].compile(true);

    switch (items[1].type) {

      case 'Identifier':
        return `const ${items[1].compile(true)} = require(${modLocation})`;

      case 'Arr':
        return items[1].items.map(key => {

          if (key.type === 'Symbol') {
            const text = key.text.replace(/^\:/, '');
            if (/[^A-Za-z_\$]/.test(text)) die(this, `Can not implicitly translate key ${key.text} to a variable name as it contains characters not allowed in JavaScript variables.`);
            return `const ${text} = require(${modLocation})[${key.compile(true)}]`

          } else {
            const compiledKey = key.compile(true);
            if (key.type !== 'Identifier') die(this `Can only import symbols and variable identifiers.`);
            return `const ${compiledKey} = require(${modLocation})["${compiledKey}"]`;
          }

        }).join(';\n');

      case 'Obj':
        const pairs = [];
        let pair = [];
        items[1].items.forEach((keyVal, index) => {
          pair.push(keyVal);
          if (index % 2 !== 0) {
            pairs.push(pair);
            pair = [];
          }
        });

        return pairs.map(pair => {
          const key = pair[0].compile(true);
          const val = pair[1].compile(true);

          return `const ${val} = require(${modLocation})[${pair[0].type === 'Identifier' ? '"' + key + '"' : key}]`;
        }).join(';\n');

      default:
        return die(this, `Import identifiers must be in the form of a variable identifier, an array, or an object.`);
    }
  }

  die(this, 'Import statements can only take 1 or 2 arguments.');
}

export default compileImport;
