var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var server = require('gulp-express');
var browserify = require('browserify');
var del = require('del');
var source = require("vinyl-source-stream");
var less = require("gulp-less");

var paths = {
    app: {
        client: {
            src: "./app/client/src",
            dist: "./app/client/dist"
        },
        server: "./app/server"
    },
    lib: {
        src: "./lib/src"
    }
};

gulp.task("test", function () {
    return gulp.src(paths.lib.src + "/**/*.test.js")
        .pipe(jasmine());
});

gulp.task("clean", function (cb) {
    del([paths.app.client.dist], cb);
});

gulp.task("html", function () {
    return gulp.src(paths.app.client.src + "/*.html")
        .pipe(gulp.dest(paths.app.client.dist));
});

gulp.task('styles', function () {
    gulp.src(paths.app.client.src + "/**/*.less")
        .pipe(less())
        .pipe(gulp.dest(paths.app.client.dist));
});

gulp.task("scripts", function () {
    return browserify(paths.app.client.src + "/app.js")
        .bundle()
        .pipe(source("app.js"))
        .pipe(gulp.dest(paths.app.client.dist))
});

gulp.task("build", ["html", "styles", "scripts"]);

gulp.task("serve", ["build"], function () {
    //start the server at the beginning of the task
    server.run({
        file: paths.app.server + "/server.js"
    });

    //restart the server when file changes
    gulp.watch([paths.app.client.src + "**/*.html"], ["html", server.run]);
    gulp.watch([paths.app.client.src + "/**/*.js"], ["scripts", server.run]);
    gulp.watch([paths.app.client.src + "/**/*.less"], ["styles", server.run]);
    gulp.watch([paths.app.server + "/server.js"], [server.run]);
});