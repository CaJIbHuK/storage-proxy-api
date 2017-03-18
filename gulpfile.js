const gulp = require('gulp');
const ts = require('gulp-typescript');
const uuid = require('uuid');

let buildTask = require('./tasks/build');
let cleanTask = require('./tasks/clean');

const buildSrc = 'src/**/*.ts';
const distSrc = 'dist';

process.on('uncaughtException', function(err) {
  console.error(err.message, err.stack, err.errors);
  process.exit(255);
});

gulp.task('clean', cleanTask.bind(null, distSrc));
gulp.task('build', ['clean'], buildTask.bind(null, {src : buildSrc, dist : distSrc}));

