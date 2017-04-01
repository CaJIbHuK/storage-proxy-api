const gulp = require('gulp');
const ts = require('gulp-typescript');
const uuid = require('uuid');

let buildTask = require('./tasks/build');
let cleanTask = require('./tasks/clean');
let startTask = require('./tasks/start');

const buildSrc = 'src/**/*.ts';
const distSrc = 'dist/';
const indexFile = __dirname+'/index';

process.on('uncaughtException', function(err) {
  console.error(err.message, err.stack, err.errors);
  process.exit(255);
});

gulp.task('clean', cleanTask.bind(null, distSrc));
gulp.task('build', ['clean'], buildTask.bind(null, {src : buildSrc, dist : distSrc}));
gulp.task('server', startTask.bind(null, indexFile));
gulp.task('buildAndStart', ['build'], startTask.bind(null, indexFile));

