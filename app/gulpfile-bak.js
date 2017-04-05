var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var gulpScss = require('gulp-sass');
var gulpCssMin = require('gulp-cssmin');
var gulpImagemin = require('gulp-imagemin');
var gulpUglify = require('gulp-uglify');
var gulpInlineSource = require('gulp-inline-source');
var gulpBabel = require('gulp-babel');
var gulpRev = require('gulp-rev');
var gulpRevCollector = require('gulp-rev-collector');
var del = require('del');
var Fs = require('fs');
var Path = require('path');
var staticPath = 'http://static.fy.shopex.cn/';

gulp.task('clean-assets', function (cb) {
    return del(['assets'], cb);
});

gulp.task('clean-dist', function (cb) {
    return del(['dist'], cb);
});

gulp.task('assets-js-all', function(){
    return gulp.src(['src/js/**/*.js', '!src/js/base/**/*.js'])
        .pipe(gulpBabel({ presets: ['es2015'] }))
        .pipe(gulp.dest('assets/js'));
});

gulp.task('assets-js-base', function() {
    return gulp.src(['src/js/base/zepto.js', 'src/js/base/base.js', 'src/js/base/sea.js'])
        .pipe(gulpConcat('base.js'))
        .pipe(gulp.dest('assets/js'));
});

gulp.task('assets-scss', function() {
    return gulp.src(['src/sass/**/*.scss'])
        .pipe(gulpScss({outputStyle:'expanded'}))
        //.pipe(gulp.dest('assets/css'))
        //.pipe(gulpCssMin())
        .pipe(gulp.dest('assets/css'));
});

gulp.task('assets-fonts', function(){
    return gulp.src(['src/sass/font/fonts/**/*.{woff,eot,svg,ttf}'])
        .pipe(gulp.dest('assets/fonts'));
});

gulp.task('assets-img', function() {
    return gulp.src(['src/images/**/*.{jpg,png,jpeg,gif,svg}'], { base: './src/' })
        .pipe(gulpImagemin())
        .pipe(gulp.dest('assets'));
});

gulp.task('assets-views', function () {
    return gulp.src(['src/view/**/*.html'], { base: './src/' })
        .pipe(gulp.dest('assets'));
});

gulp.task('assets-views-lua', function () {
    return gulp.src(['src/view-lua/**/*.html'], { base: './src/' })
        .pipe(gulp.dest('assets'));
});

/****************  gulp dev代码  *****************/
gulp.task('assets-dev-img', function() {
    return gulp.src(['src/images/**/*.{jpg,png,jpeg,gif,svg}'], { base: './src/' })
        .pipe(gulp.dest('assets'));
});

//把html页面中部分css,js,img直接打到页面里面
gulp.task('dev-inline-source-html', ['assets-views-lua', 'assets-views','assets-scss', 'assets-fonts', 'assets-dev-img', 'assets-js-all', 'assets-js-base'], function(){
    return gulp.src(['assets/view/**/*.html', 'assets/view-lua/**/*.html'], { base: './assets/' })
        .pipe(gulpInlineSource({ rootpath:Path.resolve('assets'), compress: false }))
        .pipe(gulp.dest('assets'));
});

//给css,js,img,font生成md5
gulp.task('dev-rev', ['assets-scss', 'assets-dev-img', 'assets-js-all', 'assets-js-base', 'assets-fonts'], function(){
    return gulp.src(['assets/**/*.**', '!assets/view/**/*.**', '!assets/view-lua/**/*.**'], { base: './assets/' })
        .pipe(gulpRev())                 //- 文件名加MD5后缀
        .pipe(gulp.dest('dist'))         //- 输出文件本地
        .pipe(gulpRev.manifest())        //- 生成一个rev-manifest.json
        .pipe(gulp.dest('assets'));
});

//把css/js中的资源引用路径改为带md5的绝对路径
gulp.task('dev-rev-collector-js-css', ['dev-rev', 'dev-inline-source-html'], function() {
    return gulp.src(['assets/rev-manifest.json', 'dist/css/**/*.css', 'dist/js/**/*.js'], { base: './dist/' })
        .pipe(gulpRevCollector({ doMainName: staticPath }))
        .pipe(gulp.dest('dist'));
});

//把html中的资源引用路径改为带md5的绝对路径
gulp.task('dev-rev-collector-html', ['dev-rev', 'dev-inline-source-html'], function() {
    return gulp.src(['assets/rev-manifest.json', 'assets/view/**/*.html', 'assets/view-lua/**/*.html'], { base: './assets/' })
        .pipe(gulpRevCollector({ doMainName: staticPath }))
        .pipe(gulp.dest('assets'));
});

//把html拷贝到对应的目录
gulp.task('dev-copy-path', ['dev-rev-collector-html'], function(){
    return gulp.src(['assets/view/**/*.**'])
        .pipe(gulp.dest('../../../core/shop/'));
});

//把html拷贝到对应的目录
gulp.task('dev-copy-path-lua', ['dev-rev-collector-html'], function(){
    return gulp.src(['assets/view-lua/**/*.**'])
        .pipe(gulp.dest('../../../lua/'));
});


/****************  gulp build代码  *****************/
gulp.task('min-js', ['assets-js-all', 'assets-js-base'], function(){
    return gulp.src(['assets/js/**/*.js'])
        .pipe(gulpUglify({
            mangle: { except: ['require', 'exports', 'module'] }
        }))
        .pipe(gulp.dest('assets/js'));
});

//把html页面中部分css,js,img直接打到页面里面
gulp.task('inline-source-html', ['assets-views-lua', 'assets-views','assets-scss', 'assets-fonts', 'assets-img', 'min-js'], function(){
    return gulp.src(['assets/view/**/*.html', 'assets/view-lua/**/*.html'], { base: './assets/' })
        .pipe(gulpInlineSource({ rootpath:Path.resolve('assets'), compress: false }))
        .pipe(gulp.dest('assets'));
});

//给css,js,img,font生成md5
gulp.task('rev', ['assets-scss', 'assets-img', 'min-js', 'assets-fonts'], function(){
    return gulp.src(['assets/**/*.**', '!assets/view/**/*.**', '!assets/view-lua/**/*.**'], { base: './assets/' })
        .pipe(gulpRev())                 //- 文件名加MD5后缀
        .pipe(gulp.dest('dist'))         //- 输出文件本地
        .pipe(gulpRev.manifest())        //- 生成一个rev-manifest.json
        .pipe(gulp.dest('assets'));
});

//把css/js中的资源引用路径改为带md5的绝对路径
gulp.task('rev-collector-js-css', ['rev', 'inline-source-html'], function() {
    return gulp.src(['assets/rev-manifest.json', 'dist/css/**/*.css', 'dist/js/**/*.js'], { base: './dist/' })
        .pipe(gulpRevCollector({ doMainName: staticPath }))
        .pipe(gulp.dest('dist'));
});

//把html中的资源引用路径改为带md5的绝对路径
gulp.task('rev-collector-html', ['rev', 'inline-source-html'], function() {
    return gulp.src(['assets/rev-manifest.json', 'assets/view/**/*.html', 'assets/view-lua/**/*.html'], { base: './assets/' })
        .pipe(gulpRevCollector({ doMainName: staticPath }))
        .pipe(gulp.dest('assets'));
});

//把html拷贝到对应的目录
gulp.task('copy-path', ['rev-collector-html'], function(){
    return gulp.src(['assets/view/**/*.**'])
        .pipe(gulp.dest('../../../core/shop/'));
});

//把html拷贝到对应的目录
gulp.task('copy-path-lua', ['rev-collector-html'], function(){
    return gulp.src(['assets/view-lua/**/*.**'])
        .pipe(gulp.dest('../../../lua/'));
});

//压缩css
gulp.task('min-css', ['rev-collector-js-css'], function(){
    return gulp.src(['dist/css/**/*.css'])
        .pipe(gulpCssMin())
        .pipe(gulp.dest('dist/css'));
});



gulp.task('watch', function(){
    gulp.watch(['src/**/*.**', '!src/views/**/*.**', '!src/views-lua/**/*.**'], ['dev-rev-collector-js-css', 'dev-copy-path-lua', 'dev-copy-path']);
    gulp.watch(['src/views/**/*.**'], ['dev-copy-path']);
    gulp.watch(['src/views-lua/**/*.**'], ['dev-copy-path-lua']);
});

gulp.task('dev', function(){
    gulp.start('dev-rev-collector-js-css', 'dev-copy-path-lua', 'dev-copy-path', 'watch');
});

//上线命令 gulp build
gulp.task('build', ['clean-assets', 'clean-dist'], function(){
    gulp.start('rev-collector-js-css', 'copy-path-lua', 'copy-path', 'min-css');
});