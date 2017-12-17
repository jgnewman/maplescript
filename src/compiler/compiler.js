import fs from 'fs';
import { parser } from './utils';
import finalize from './finalize';
import './nodes/Program';
import './nodes/String';
import './nodes/Atom';
import './nodes/Identifier';
import './nodes/Number';
import './nodes/Arr';
import './nodes/Obj';
import './nodes/Html';
import './nodes/List';
import './nodes/Regexp';

/*
 * Export a function for initializing compilation.
 */
export function compile(path, callback, options) {
  // Read in a file.
  return fs.readFile(path, function (err, result) {
    // Throw an error if we have one.
    if (err) {
      if (callback) {
        return callback(err);
      } else {
        throw err;
      }
    // If not, convert the result to a string and call compileCode with it.
    } else {
      return compileCode(result.toString(), callback, options);
    }
  });
}

export function compileCode(str, callback, options) {
  let tree;
  options = options || {};

  // Parse the tree.
  try {
    tree = parser.parse(str);
  } catch (err1) {
    if (callback) {
      return callback(err1);
    } else {
      throw err1;
    }
  }

  // Compile the tree
  try {
    tree.compile();
  } catch (err2) {
    if (callback) {
      return callback(err2);
    } else {
      throw err2;
    }
  }

  // Finalize the code
  if (options.finalize) {
    try {
      finalize(tree);
    } catch (err3) {
      if (callback) {
        return callback(err3);
      } else {
        throw err3;
      }
    }
  }

  // Log output if necessary
  options.log && console.log(tree.shared.output);

  // Return a call to the callback if it exists or the code if not
  return callback ? callback(undefined, tree.shared.output) : tree.shared.output;
}
