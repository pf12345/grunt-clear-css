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
    var _cssStyleArr = [],_nodeNameArr = [], _nodeClassArr = [], _nodeIdArr = [], _useLessCssArr = [], dealFile, dealCssFile;

	dealFile = function(documentNodes) {
		for(var num in documentNodes) {
			if(!documentNodes[num].type || documentNodes[num].type !== 'tag' || !documentNodes[num].attribs) {
				continue;
			}
			if(documentNodes[num].name) {
				_nodeNameArr.push(documentNodes[num].name);
			}
			if(documentNodes[num].attribs.class) {
				var moreClass = documentNodes[num].attribs.class.split(' ');
				if(moreClass.length > 1) {
					for(var i = 0, _i = moreClass.length; i < _i; i++) {
						_nodeClassArr.push(moreClass[i]);
					}
				}else{
					_nodeClassArr.push(documentNodes[num].attribs.class);
				}
			}
			if(documentNodes[num].attribs.id) {
				_nodeIdArr.push(documentNodes[num].attribs.id);
			}
		}
	};

	dealCssFile = function(_cssRuleList) {
		_cssRuleList.map(function(rule) {
			if(rule.type === 'rule') {
				var _rule = rule.selectors[0].split(' ');
				_rule.map(function(r) {
					_cssStyleArr.push(r);
				});
			}
		});
	};

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
			if(grunt.file.isDir(filepath)) {
				grunt.file.recurse(filepath, function(abspath, rootdir, subdir, filename) {
					if(filename.split('.')[1] === 'css') {
						var _cssRuleList = css.parse(grunt.file.read(abspath)).stylesheet.rules;
						dealCssFile(_cssRuleList);
					}
				});
			}else{
				var _cssRuleList = css.parse(grunt.file.read(filepath)).stylesheet.rules;
				dealCssFile(_cssRuleList);
			}
        }
        else if(f.dest === 'html') {

			if(grunt.file.isDir(filepath)) {
				grunt.file.recurse(filepath, function(abspath, rootdir, subdir, filename) {
					if(filename.split('.')[1] === 'html') {
						var $ = cheerio.load(grunt.file.read(abspath));
						var documentNodes = $('*');
						dealFile(documentNodes);
					}
				});
			}else{
				var $ = cheerio.load(grunt.file.read(filepath));
				var documentNodes = $('*');
				dealFile(documentNodes);
			}

        }
      });
    });
		_cssStyleArr.map(function(style) {
			if(style.match('.')[0]) {
				style = style.split('.')[1];
			}
			if(style && style.match(":")) {
				style = style.split(":")[0];
			}

          if(style && _nodeClassArr.indexOf(style) === -1 && _nodeIdArr.indexOf(style) === -1 && _nodeNameArr.indexOf(style) === -1) {
              _useLessCssArr.push(style);
          }
      });

		var _lastUseLessArr = [];
		_useLessCssArr.map(function(u) {
			if(_lastUseLessArr.indexOf(u) === -1) {
				_lastUseLessArr.push(u);
			}
		});
      grunt.log.writeln("-------------- your useless css style class or id or node name --------------");

      grunt.log.writeln(_lastUseLessArr);

      grunt.log.writeln("-------------- clear css end all --------------");
  });

};
