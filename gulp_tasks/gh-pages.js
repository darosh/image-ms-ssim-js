var merge = require('merge2');

module.exports = function (gulp, plugins) {
	return function () {
		return gulp.src('deploy/**/*').pipe(plugins.ghPages({message: 'update', cacheDir: 'temp/deploy'}));
	};
};
