import { compile, nodes, die } from '../utils';

/*
 * Loop over all nodes in the program body and call
 * compile for each one. Make sure we have a shared string
 * to contain the output.
 */
compile(nodes.ProgramNode, function () {
  const newBody = this.body;
  this.shared.output = '';
  newBody.forEach(node => {
    try {
      node.compile();
      this.shared.output += ';\n';
    } catch (err) {
      die(node, `Could not compile ${node.type ? node.type : 'node ' + JSON.stringify(node)}`);
    }
  });
  return '';
});
