/*
 * grunt-clear-css
 * https://github.com/pf12345/grunt-clear-css
 *
 * Copyright (c) 2014 payne
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var cheerio = require('cheerio');
    var css = require('css');
    var _cssStyleArr = [],_nodeNameArr = [], _nodeClassArr = [], _nodeIdArr = [], _useLessCssArr = [];

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('clear_css', 'find useless css style name in htmls', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      outFile: false
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Concat specified files.
      f.src.map(function(filepath) {
        // Read file source.
        if(f.dest === 'css') {
            var _cssRuleList = css.parse(grunt.file.read(filepath)).stylesheet.rules;

            _cssRuleList.map(function(rule) {
                if(rule.type === 'rule') {
                    var _rule = rule.selectors[0].split(' ');
                    _rule.map(function(r) {
                        _cssStyleArr.push(r);
                    });
                }
            });
        }
        else if(f.dest === 'html') {
            var $ = cheerio.load(grunt.file.read(filepath));
            var documentNodes = $('*');
            for(var num in documentNodes) {
                if(!documentNodes[num].type || documentNodes[num].type !== 'tag' || !documentNodes[num].attribs) {
                    continue;
                }
                _nodeNameArr.push(documentNodes[num].name);
                _nodeClassArr.push(documentNodes[num].attribs.class);
                _nodeIdArr.push(documentNodes[num].attribs.id);
            }


        }

      });

    });
      _cssStyleArr.map(function(style) {
          if(_nodeClassArr.indexOf(style) === -1 && _nodeIdArr.indexOf(style) === -1 && _nodeNameArr.indexOf(style) === -1) {
              _useLessCssArr.push(style);
          }
      });
      grunt.log.writeln("-------------- your useless css style class or id or node name --------------");

      grunt.log.writeln(_useLessCssArr);

      grunt.log.writeln("-------------- clear css end all --------------");
  });

};
