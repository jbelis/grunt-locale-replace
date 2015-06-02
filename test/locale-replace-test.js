
'use strict';

// dependencies

var assert = require('assert');
var grunt = require('grunt');

// test

describe('grunt-locale-replace', function () {

	var expect;
	var result;
	var locales = ["en_US", "fr_FR"];
	var filename = "test.html";
//	var window = {};

	it('should generate localized files', function (done) {

		locales.forEach(function(locale) {
			expect = grunt.file.read('test/fixtures/locales/' + locale + '/' + filename);
			result = grunt.file.read('tmp/' + locale + '/' + filename);
			assert.equal(result, expect);
		});
		done();

	});


});
