import { die } from '../../utils';
import compileDoBlock from './immediate-block';

function compileHtmlDefinition(items) {
  const name = items[0].compile(true);
  const params = items[1].items.map(param => param.compile(true)).join(', ');
  const body = compileDoBlock.call(this, items.slice(2));

  if (!/^[A-Z]/.test(name)) {
    die(items[0], 'New html tags must begin with a capital letter.');
  }

  return `const ${name} = function (${params}) {
    const out_ = ${body};
    if (out_ && PINE_.dataType(out_) !== 'htmlelement') {
      throw new Error('If ${name} returns a truthy value, that value must be a single html element.');
    }
    return out_;
  }`
}

export default compileHtmlDefinition;
