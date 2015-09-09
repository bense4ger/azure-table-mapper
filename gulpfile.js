"use strict";
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    util = require('gulp-util'),
    toMd = require('gulp-jsdoc-to-markdown');

gulp.task('generate-docs', function () {
    return gulp.src('lib/**/*.js')
        .pipe(concat('api.md'))
        .pipe(toMd())
        .on('error', function (err) {
            util.log('Markdown conversion failed ' + err);
        })
        .pipe(gulp.dest('./'));

});

gulp.task('default', function () { });