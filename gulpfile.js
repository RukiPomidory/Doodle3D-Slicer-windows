'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

var files = [
	"src/utils.js", 
	"src/box.js", 
	"src/printer.js", 
	"src/slicer.js"
];

var DEST = 'build/';

gulp.task('default', function () {
	return gulp.src(files)
		.pipe(concat('d3d.js'))
		.pipe(gulp.dest(DEST))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(DEST));
});