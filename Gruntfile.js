module.exports = function(grunt){
	process.env.NODE_ENV = 'production';
	grunt.initConfig({
		browserify:{
			dist:{
				files:{
					'./index.js':['./main.js']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-browserify');
	grunt.registerTask('default',['browserify']);
}
