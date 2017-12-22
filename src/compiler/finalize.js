import path from 'path';

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

export default function finalize(tree, isPineProjectDirectory) {
  const libLocation = isPineProjectDirectory ? path.resolve(__dirname, '../', '../', 'library') : 'pine/library';
  tree.shared.output = prepend(tree.shared.output, `var PINE_ = require("${libLocation}");\n`);
  return tree;
}
