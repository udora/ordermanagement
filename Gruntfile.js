module.exports = function(grunt) {
	
	require('load-grunt-tasks')(grunt);
	
	grunt
			.initConfig({
					
				compress : {
					main : {
						options : {
							archive: 'OrderManagement.zip',
							pretty: true
						},
						expand: true,
						cwd: './',
						//src: ['**/*', '!node_modules/**'],
						src: ['**/*'],
						dest: './'
					}
				}
			}); 

	grunt.registerTask('default', [ 'compress' ]);

};