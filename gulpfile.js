var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var server = require('gulp-express');

gulp.task('test', function () {
    return gulp.src('**/*.test.js')
        .pipe(jasmine());
});

gulp.task('serve', function () {
    //start the server at the beginning of the task
    server.run({
        file: './src/server/server.js'
    });

    //restart the server when file changes
    gulp.watch(['**/*.html'], server.notify);
    gulp.watch(['./src/server/server.js'], [server.run]);
});