import { die } from '../../utils';

function compileAwait(items) {
  if (items.length > 1) {
    return die(this, 'Await can only take 1 argument.')
  }
  return `await ${items[0].compile(true)}`
}

export default compileAwait;
