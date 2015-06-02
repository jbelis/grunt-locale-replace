'use strict';

module.exports = function (grunt) {

	var cheerio = require('cheerio');

	function replace(content, translations, callback) {
		// Don't decode entities, as this has the side effect
		// of turning all non-ascii characters into entities:
		var $ = cheerio.load(content, {decodeEntities: false});

		$('[localize],[data-localize]').each(function (element) {
			var translation = translations[attr || element.innerHTML];
			if (translation) {
				element.innerHTML = translation;
			}
		});

		callback($.html());
	}


	grunt.registerMultiTask(
		'locale-replace',
		'replaces localized dom elements with their translation',
		function () {
			// load translations
			var translations = {};
			this.locales.forEach(function(locale) {
				require(this.translationsPath + locale + "/i18n.js");
				translations[locale] = window.i18n;

				// do the replacements
				this.files.forEach(function (filePair) {
					var dest = filePair.dest;
					var isExpandedPair = filePair.orig.expand || false;
					filePair.src.forEach(function (src) {
						if (/\/$/.test(dest)) {
							dest = (isExpandedPair) ? dest : path.join(dest, src);
						}
						replace(grunt.file.read(src), window.i18n, function(modifiedContent) {
							grunt.file.write(dest, modifiedContent);
							callback();
						});
					});
				});

			});

		}
	);


};