'use strict';

module.exports = function (grunt) {

	grunt.initConfig({

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			tasks: {
				src: ['tasks/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			}
		},

		clean: {
			test: ['tmp']
		},

		'locale-replace': {
			simple: {
				locales: ["en_US", "fr_FR"],
				textualAttributes: {
					input: ["placeholder"],
					'*': ['title']
				},
				translationsPath: "test/fixtures/locales/{locale}/i18n.js",
				files: [
					{src: ['test/fixtures/test.html'], dest: 'tmp/{locale}/'}
				]
			}
		},

		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: '<%= jshint.test.src %>'
			}
		},

		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			tasks: {
				files: '<%= jshint.tasks.src %>',
				tasks: ['jshint:src', 'mochaTest']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'mochaTest']
			}
		}

	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['clean', 'locale-replace', 'mochaTest']);
	grunt.registerTask('default', ['jshint', 'test']);

};