var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
    return gulp.src('./examples/*/test.js')
    .pipe(mocha({reporter: 'spec'}));
});
