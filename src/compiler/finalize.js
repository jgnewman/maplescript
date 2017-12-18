import CNS_ from 'cns-lib';

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

export default function finalize(tree) {
  tree.shared.output = prepend(tree.shared.output, 'var PINE_ = require("pine/library");\n');
  return tree;
}
