var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

module.exports = function (gulp, plugins) {
    return function () {
        var b = browserify({
            entries: 'index.js',
            debug: false,
            standalone: 'ImageMSSSIM'
        });

        return b.bundle()
            .pipe(source('dist/image-ms-ssim.js'))
            .pipe(plugins.rename('image-ms-ssim.js'))
            .pipe(gulp.dest('dist'))
            .pipe(plugins.rename('image-ms-ssim.min.js'))
            .pipe(buffer())
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.uglify())
            .on('error', plugins.util.log)
            .pipe(plugins.sourcemaps.write('./'))
            .pipe(gulp.dest('dist'));
    };
};
