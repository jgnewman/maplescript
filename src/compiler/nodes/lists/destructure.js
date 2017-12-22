import { die } from '../../utils';

function compileDestructure(items) {
  if (items.length !== 2) { // just location
    return die(this, 'Destructure statements must take 2 arguments.');
  }

  const toDestructure = items[0].compile(true);
  const spec = items[1];

  switch (spec.type) {

    case 'Arr': // (destr props [:foo bar])
      return spec.items.map(key => {

        if (key.type === 'Symbol') {
          const text = key.text.replace(/^\:/, '');
          if (/[^A-Za-z_\$]/.test(text)) die(this, `Can not implicitly translate key ${key.text} to a variable name as it contains characters not allowed in JavaScript variables.`);
          return `const ${text} = ${toDestructure}[${key.compile(true)}]`;

        } else {
          const compiledKey = key.compile(true);
          if (key.type !== 'Identifier') die(this `Can only destructure symbols and variable identifiers.`);
          return `const ${compiledKey} = ${toDestructure}["${compiledKey}"]`;
        }

      }).join(';\n');

    case 'Obj': // (destr props {:foo bar :key val})
      const pairs = [];
      let pair = [];
      spec.items.forEach((keyVal, index) => {
        pair.push(keyVal);
        if (index % 2 !== 0) {
          pairs.push(pair);
          pair = [];
        }
      });

      return pairs.map(pair => {
        const key = pair[0].compile(true);
        const val = pair[1].compile(true);

        return `const ${val} = ${toDestructure}[${pair[0].type === 'Identifier' ? '"' + key + '"' : key}]`;
      }).join(';\n');

    default:
      return die(this, `You must destructure using array or object form.`);
  }

}

export default compileDestructure;
