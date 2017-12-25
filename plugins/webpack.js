/*
  Adapted from coffee-loader by Tobias Koppers @sokra
  MIT License http://www.opensource.org/licenses/mit-license.php
*/
var maple = require("../index");
var loaderUtils = require("loader-utils");

// Export the loader function.
module.exports = function (opts) {

  function loader(source) {
    this.cacheable && this.cacheable();

    var mapleRequest = loaderUtils.getRemainingRequest(this);
    var jsRequest = loaderUtils.getCurrentRequest(this);
    var query = loaderUtils.parseQuery(this.query);
    var result;

    // Make an attempt to compile the source code.
    try {

      result = maple.compileCode(source, null, {
        finalize: true,
        isMapleProjectDirectory: opts && opts.isMapleProjectDirectory
      });

    // Handle the error if there is one.
    } catch (e) {
      throw e;
    }

    // Keep this around for when we want to include source maps.
    // var map = JSON.parse(result.v3SourceMap);
    // map.sourcesContent = [source];
    // this.callback(null, result.js, map);

    this.callback(null, result, null);
  }

  return loader;

}
