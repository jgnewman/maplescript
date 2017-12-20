/*
  Adapted from coffee-loader by Tobias Koppers @sokra
  MIT License http://www.opensource.org/licenses/mit-license.php
*/
var pine = require("../index");
var loaderUtils = require("loader-utils");

// Export the loader function.
module.exports = function(source) {
  this.cacheable && this.cacheable();

  var pineRequest = loaderUtils.getRemainingRequest(this);
  var jsRequest = loaderUtils.getCurrentRequest(this);
  var query = loaderUtils.parseQuery(this.query);
  var result;

  // Make an attempt to compile the source code.
  try {
    // result = coffee.compile(source, {
    //   literate: query.literate,
    //   filename: Request,
    //   debug: this.debug,
    //   bare: true,
    //   sourceMap: true,
    //   sourceRoot: "",
    //   sourceFiles: [pineRequest],
    //   generatedFile: jsRequest
    // });

    result = pine.compileCode(source, null, {finalize: true});

  // Handle the error if there is one.
  } catch (e) {
    // var err = "";
    //
    // if (e.location == null || e.location.first_column == null || e.location.first_line == null) {
    //   err += "Got an unexpected exception from the Cream & Sugar compiler. The original exception was: " + e + "\n";
    //   err += "(The Cream & Sugar compiler should not raise *unexpected* exceptions. You can file this error as an issue of the Cream & Sugar compiler: https://github.com/jgnewman/cream-and-sugar/issues)\n";
    //
    // } else {
    //   var codeLine = source.split("\n")[e.location.first_line];
    //   var offendingCharacter = (e.location.first_column < codeLine.length) ? codeLine[e.location.first_column] : "";
    //   err += e + "\n";
    //   // log erroneous line and highlight offending character
    //   err += "    L" + e.location.first_line + ": " + codeLine.substring(0, e.location.first_column) + offendingCharacter + codeLine.substring(e.location.first_column + 1) + "\n";
    //   err += "         " + (new Array(e.location.first_column + 1).join(" ")) + "^\n";
    // }

    // throw new Error(err);

    throw e;
  }

  // Keep this around for when we want to include source maps.
  // var map = JSON.parse(result.v3SourceMap);
  // map.sourcesContent = [source];
  // this.callback(null, result.js, map);

  this.callback(null, result, null);
}
