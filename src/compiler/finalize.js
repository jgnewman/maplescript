import path from 'path';

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

export default function finalize(tree, isMapleProjectDirectory) {
  const libLocation = isMapleProjectDirectory ? path.resolve(__dirname, '../', '../', 'library') : 'maplescript/library';
  tree.shared.output = prepend(tree.shared.output, `var MAPLE_ = m = require("${libLocation}");\n`);
  return tree;
}
