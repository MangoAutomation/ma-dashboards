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
			path.dirname = path.dirname.replace(/^ace-builds(\\|\/)src-min-noconflict/g, 'ace');
			path.dirname = path.dirname.replace(/(\\|\/)(min|dist|build|builds|lib|release)$/g, '');
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


gulp.task('ngdocs', [], function () {
  var gulpDocs = require('gulp-ngdocs');

  var options = {
    title: "Mango - Custom Dashboard 3.0 API Docs",
	startPage: "/",
	html5Mode: false,
	scripts: [
      'web/vendor/angular/angular.min.js',
      'web/vendor/angular-animate/angular-animate.min.js',
    ]
  }

  return gulp.src('web/js/mango-3.0/**/*.js')
    .pipe(gulpDocs.process(options))
    .pipe(gulp.dest('web/docs/mango-3.0'));
});
