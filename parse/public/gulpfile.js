var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();


//Default
gulp.task('default', ['connect'], function () {
    gulp.watch(['index.html', 'app.js', 'components/**/**.*', 'services/**/**.*', 'directives/**/**.*', 'css/**/**.*', 'images/**/**.*'], function (event) {
        return gulp.src(event.path)
            .pipe($.connect.reload());
    });
});

//Connect
gulp.task('connect', function () {
    $.connect.server({
        root: [__dirname],
        port: 8002,
        livereload: {port: 2983}
    });
});
