'use strict';

module.exports = function (grunt) {

	var cheerio = require('cheerio');
	var path = require('path');
	var sanitizer = require('sanitizer');

	function replace(content, translations, textualAttributes, callback) {
		// Don't decode entities, as this has the side effect
		// of turning all non-ascii characters into entities:
		var $ = cheerio.load(content, {decodeEntities: false});

		//grunt.log.writeln('translations: ' + JSON.stringify(translations));

		$('[localize],[data-localize]').each(function (index, element) {
			var $element = $(element);
			var key = $element.attr('data-localize') || $element.attr('localize');
			if (!key || key === "") key = sanitizer.sanitize(String($element.html()));
//			grunt.log.writeln('key:' + key + ' innerHTML:' + $element.html());
			var translation = translations[key];
			if (translation) {
//				grunt.log.writeln('translation: ' + translation);
				$element.html(translation);
			}

			// translate attributes
			if (textualAttributes) {
				var attributes = [];
				for (var tag in textualAttributes) {
					if (tag === "*") {
						attributes.push.apply(attributes, textualAttributes[tag]);
					}
					if (element.name == tag) {
						attributes.push.apply(attributes, textualAttributes[tag]);
					}
				}
//				grunt.log.writeln('attributes:' + attributes.length);
				attributes.forEach(function (attr) {
					var value = $element.attr(attr);
					if (value && value.length) {
						var translation = translations[value];
						if (translation) {
							// todo sanitize translation
							$element.attr(attr, translation);
//							grunt.log.writeln(attr + '=' + value + " translation=" + $element.attr(attr));
						}
					}
				});
			}

			$element.removeAttr('localize').removeAttr('data-localize');
//			grunt.log.writeln('translated: ' + $element.parent().html());
		});

		callback($.html());
	}


	grunt.registerMultiTask(
		'locale-replace',
		'replaces localized dom elements with their translation',
		function () {

			// load translations
			var translations = {};
			var task = this;
			task.data.locales.forEach(function(locale) {
				var txSrc = task.data.translationsPath.replace("{locale}", locale);
				//grunt.log.writeln('executing module ' + txSrc);

//				require(txSrc);
				var script = grunt.file.read(txSrc);

				//grunt.log.writeln(script);
				eval('translations[locale] = ' + script);
//				translations[locale] = window.i18n;

				// do the replacements
				task.files.forEach(function (filePair) {
					var dest = filePair.dest.replace("{locale}", locale);
					filePair.src.forEach(function (src) {
						//grunt.log.writeln("filepair: " + src + " -> " + dest);
						var out = dest;
						if (/\/$/.test(dest)) {
							out = (filePair.expand) ? path.join(dest, src) : path.join(dest, path.basename(src));
						}
						//grunt.log.writeln("Before: " + src + " ==> " + out);
						//grunt.log.writeln("textualAttributes: " + task.data.textualAttributes);
						replace(grunt.file.read(src), translations[locale], task.data.textualAttributes, function(modifiedContent) {
							//grunt.log.writeln(src + " ==> " + out);
							grunt.file.write(out, modifiedContent);
						});
					});
				});

			});

		}
	);


};