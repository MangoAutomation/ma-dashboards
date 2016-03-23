var gulp = require('gulp');
var exists = require('path-exists').sync;

var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});

var paths = {
	dest: 'web/vendor'
};

gulp.task('default', function() {
	var mainFiles = plugins.mainBowerFiles().map(function(path, index, arr) {
	  var newPath = path.replace(/.([^.]+)$/g, '.min.$1');
	  return exists(newPath) ? newPath : path;
	});
	
	return gulp.src(mainFiles, {base: 'bower_components'})
		.pipe(plugins.rename(function(path) {
			path.dirname = path.dirname.replace(/^ace-builds\\src-min-noconflict/g, 'ace');
			path.dirname = path.dirname.replace(/\\(dist|build|lib|release)$/g, '');
			path.basename = path.basename.replace(/\.min$/g, '');
		}))
		//.pipe(plugins.filter('**/*.js'))
		//.pipe(plugins.uglify())
		.pipe(gulp.dest(paths.dest));
});

gulp.task('clean', function() {
	return gulp.src(paths.dest, {read: false})
		.pipe(plugins.clean());
});
