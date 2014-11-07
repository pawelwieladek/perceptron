var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var server = require('gulp-express');
var browserify = require('browserify');
var del = require('del');
var source = require("vinyl-source-stream");

gulp.task('test', function () {
    return gulp.src('**/*.test.js')
        .pipe(jasmine());
});

gulp.task('clean', function (cb) {
    del(['./src/app/dist'], cb);
});

gulp.task('html', function () {
    return gulp.src('./src/app/src/*.html')
        .pipe(gulp.dest('./src/app/dist'));
});

gulp.task('scripts', function () {
    return browserify('./src/app/src/app.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./src/app/dist'))
});

gulp.task('build', ['html', 'scripts']);

gulp.task('serve', ['build'], function () {
    //start the server at the beginning of the task
    server.run({
        file: './src/server/server.js'
    });

    //restart the server when file changes
    gulp.watch(['**/*.html'], [server.notify]);
    gulp.watch(['./src/server/server.js'], [server.run]);
    gulp.watch(['./src/app/src/**/*.js'], ['scripts', server.run]);
});