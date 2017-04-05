var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var gulpConcat = require('gulp-concat');
var gulpScss = require('gulp-sass');
var gulpSpritesmith = require('gulp.spritesmith');
var gulpCssMin = require('gulp-cssmin');
var gulpImagemin = require('gulp-imagemin');
var gulpUglify = require('gulp-uglify');
var gulpBabel = require('gulp-babel');
var gulpJsdoc = require("gulp-jsdoc3");
var del = require('del');
var merge = require('merge-stream');
var PATH = 'dist';

gulp.task('clean-all', function (cb) {
    return del([PATH], cb);
});

gulp.task('clean-jsdoc', function (cb) {
    return del(['jsdoc'], cb);
});

gulp.task('clean-scss-page', function (cb) {
    return del([PATH + '/css/page'], cb);
});

gulp.task('clean-css-icons', ['dev-concat-css-base', 'dev-concat-css-base2'], function(){
    return del([PATH + '/css/icons.css']);
});

gulp.task('dev-js-all', function() {
    return gulp.src(['src/js/**/*.js', '!src/js/base/**/*.js', '!src/js/plugin/**/*.js'])
        .pipe(gulpBabel({ presets: ['es2015'] }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('dev-js-base', function() {
    return gulp.src(['src/js/base/jquery-3.1.0.min.js', 'src/js/base/base.js', 'src/js/base/sea.js'])
        .pipe(gulpConcat('base.js'))
        .pipe(gulp.dest(PATH+ '/js'));
});

gulp.task('dev-js-base-module', function() {
    return gulp.src(['src/js/base/base/**/*.js'])
        .pipe(gulpConcat('base-module.js'))
        .pipe(gulp.dest(PATH+ '/js'));
});

gulp.task('dev-js-base-all', ['dev-js-base', 'dev-js-base-module'], function() {
    return gulp.src(['dist/js/base.js', 'dist/js/base-module.js'])
        .pipe(gulpConcat('base.js'))
        .pipe(gulp.dest(PATH+ '/js'));
});

gulp.task('dev-js-plugin', function() {
    return gulp.src(['src/js/plugin/**/*.**'])
        .pipe(gulp.dest(PATH+ '/js/plugin'));
});

gulp.task('dev-scss-reset', function() {
    return gulp.src(['src/sass/base/reset.scss'])
        .pipe(gulpScss({outputStyle:'expanded'}))
        .pipe(gulp.dest(PATH + '/css'));
});

gulp.task('dev-scss-base', function() {
    return gulp.src(['src/sass/base.scss'])
        .pipe(gulpScss({outputStyle:'expanded'}))
        .pipe(gulp.dest(PATH + '/css'));
});

gulp.task('dev-scss-base2', function() {
    return gulp.src(['src/sass/base2.scss'])
        .pipe(gulpScss({outputStyle:'expanded'}))
        .pipe(gulp.dest(PATH + '/css'));
});

gulp.task('dev-scss-admin', function() {
    return gulp.src(['src/sass/admin.scss'])
        .pipe(gulpScss({outputStyle:'expanded'}))
        .pipe(gulp.dest(PATH + '/css'));
});

gulp.task('dev-scss-page', ['clean-scss-page'], function() {
    return gulp.src(['src/sass/page/**/*.scss'])
        .pipe(gulpScss({outputStyle:'expanded'}))
        .pipe(gulp.dest(PATH + '/css/page'));
});

gulp.task('dev-fonts', function() {
    return gulp.src(['src/fonts/**/*.**'], { base: './src/fonts/' })
        .pipe(gulp.dest(PATH + '/fonts'));
});

gulp.task('dev-img', function() {
    return gulp.src(['src/images/**/*.{jpg,png,jpeg,gif}', '!src/images/icon/**/*.png'], { base: './src/images/' })
        .pipe(gulp.dest(PATH + '/images'));
});

gulp.task('dev-img-icon', function(){
    var spriteData = gulp.src(['src/images/icon/**/*.png'])
        .pipe(gulpSpritesmith({
            imgName: 'icons.png',
            cssName: 'icons.css',
            padding: 5,
            cssTemplate: 'src/handlebars/handlebarsStr.css.handlebars'
        }));

    var imgStream = spriteData.img.pipe(gulp.dest(PATH + '/images/icon/'));
    var cssStream = spriteData.css.pipe(gulp.dest(PATH + '/css/'));
    return merge(imgStream, cssStream);
});

gulp.task('dev-concat-css-base', ['dev-img-icon', 'dev-scss-base'], function(){
    return gulp.src([(PATH + '/css/base.css'), (PATH + '/css/icons.css')])
        .pipe(gulpConcat('base.css'))
        .pipe(gulp.dest(PATH + '/css'));
});

gulp.task('dev-concat-css-base2', ['dev-img-icon', 'dev-scss-base'], function(){
    return gulp.src([(PATH + '/css/base2.css'), (PATH + '/css/icons.css')])
        .pipe(gulpConcat('base2.css'))
        .pipe(gulp.dest(PATH + '/css'));
});

gulp.task('min-css', ['dev-scss-page', 'clean-css-icons', 'dev-scss-reset', 'dev-scss-admin', 'dev-scss-base2'], function(){
    return gulp.src('dist/css/**/*.css')
        .pipe(gulpCssMin())
        .pipe(gulp.dest(PATH + '/css'));
});

gulp.task('min-img', ['dev-img', 'clean-css-icons'], function(){
    return gulp.src(['dist/images/**/*.{jpg,png,jpeg,gif}'])
        .pipe(gulpImagemin())
        .pipe(gulp.dest(PATH + '/images'));
});

gulp.task('min-js', ['dev-js-base-all', 'dev-js-all', 'dev-js-plugin'], function(){
    return gulp.src(['dist/js/**/*.js'])
        .pipe(gulpUglify({
            mangle: {
                except: ['require', 'exports', 'module']
            }
        }))
        .pipe(gulp.dest(PATH + '/js'));
});

gulp.task('jsdoc-js', ['clean-jsdoc'], function(){
    var jsdocConfig = require('./jsdoc.json');
    return gulp.src(['src/**/*.js'], {read: false})
        .pipe(gulpJsdoc(jsdocConfig));
});

gulp.task('watch', function(){
    gulp.watch(['src/sass/base/**/*.scss', 'src/sass/base.scss', 'src/images/icon/**/*.png'], ['clean-css-icons', 'dev-scss-base2']);
    gulp.watch(['src/sass/page/**/*.scss'], ['dev-scss-page']);
    gulp.watch(['src/sass/module/**/*.scss'], ['dev-scss-base2','dev-scss-admin']);
    gulp.watch(['src/sass/admin.scss'], ['dev-scss-admin']);
    gulp.watch(['src/sass/tools/**/*.scss', 'src/sass/component/**/*.scss'], ['dev-scss-page', 'clean-css-icons']);
    gulp.watch(['src/js/base/**/*.js'], ['dev-js-base-all']);
    gulp.watch(['src/js/plugin/**/*.**'], ['dev-js-plugin']);
    gulp.watch(['src/js/**/*.js', '!src/js/base/**/*.js', '!src/js/plugin/**/*.js'], ['dev-js-all']);
    gulp.watch(['src/images/**/*.{jpg,png,jpeg,gif}', '!src/images/icon/**/*.png'], ['dev-img']);
});

gulp.task('dev', function(){
    gulp.start('dev-js-all', 'dev-js-base-all', 'dev-scss-base2', 'dev-fonts', 'dev-js-plugin', 'dev-scss-reset', 'dev-scss-page', 'dev-scss-admin', 'dev-img', 'clean-css-icons', 'watch');
});

gulp.task('build', ['clean-all'], function(){
    gulp.start('min-css', 'min-img', 'dev-fonts', 'min-js');
});

gulp.task('jsdoc', function(){
    gulp.start('jsdoc-js');
});