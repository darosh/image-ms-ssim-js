module.exports = function (gulp, plugins) {
    return function () {
        return gulp
            .src('index.ts')
            .pipe(plugins.typedoc({
                module: 'commonjs',
                out: 'deploy/doc',
                mode: 'file',
				name: 'MS-SSIM',
                readme: 'none'
            }));
    };
};
