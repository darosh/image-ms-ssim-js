var merge = require('merge2');

module.exports = function (gulp, plugins) {
	return function () {
		return merge(
			gulp.src('dist/*').pipe(gulp.dest('deploy/dist')),
			gulp.src('test/images/*').pipe(gulp.dest('deploy/test/images')),
			gulp.src('test/browser_test.html').pipe(gulp.dest('deploy/test')),
			gulp.src('node_modules/image-mse/dist/image-mse.js').pipe(gulp.dest('deploy/node_modules/image-mse/dist'))
		);
	};
};
