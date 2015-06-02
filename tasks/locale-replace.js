'use strict';

module.exports = function (grunt) {

	var cheerio = require('cheerio');
	var path = require('path');
	var sanitizer = require('sanitizer');

	function replace(content, translations, callback) {
		// Don't decode entities, as this has the side effect
		// of turning all non-ascii characters into entities:
		var $ = cheerio.load(content, {decodeEntities: false});

		grunt.log.writeln('translations: ' + JSON.stringify(translations));


		$('[localize],[data-localize]').each(function (index, element) {
			var $element = $(element);
			var key = String($element.html());
			sanitizer.sanitize(key);
			grunt.log.writeln('innerHTML: ' + $element.html());
			grunt.log.writeln('key: ' + key);
			var translation = translations[key];
			if (translation) {
				grunt.log.writeln('translation: ' + translation);
				$element.html(translation);
			}
			$element.removeAttr('localize').removeAttr('data-localize');
			grunt.log.writeln($element.html());
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
				grunt.log.writeln('executing module ' + txSrc);

//				require(txSrc);
				eval('translations[locale] = ' + grunt.file.read(txSrc));
//				translations[locale] = window.i18n;

				// do the replacements
				task.files.forEach(function (filePair) {
					var dest = filePair.dest.replace("{locale}", locale);
					filePair.src.forEach(function (src) {
						if (/\/$/.test(dest)) {
							dest = (filePair.expand) ? path.join(dest, src) : path.join(dest, path.basename(src));
						}
						replace(grunt.file.read(src), translations[locale], function(modifiedContent) {
							grunt.file.write(dest, modifiedContent);
						});
					});
				});

			});

		}
	);


};