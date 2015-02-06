'use strict';

var gulp     = require('gulp'),
	connect  = require('gulp-connect'),
	stylus   = require('gulp-stylus'),
	nib      = require('nib'),
	jshint   = require('gulp-jshint'),
	stylish  = require('jshint-stylish'),
	inject   = require('gulp-inject'),
	wiredep  = require('wiredep').stream,
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	historyApiFallback = require('connect-history-api-fallback');

//Busca en las carpetas de estilos y javascript los archivos que hayamos creado para inyectarlos en el index.html

gulp.task('inject', function () {
	var sources = gulp.src(['./js/**/*.js','./css/**/*.css']);
	return gulp.src('index.html', {cwd: './'})
		.pipe(inject(sources, {
			read: false
		}))
		.pipe(gulp.dest('./'));
});

// Inyecta las librerías que instalaremos vía Bower
gulp.task('wiredep', function () {
	gulp.src('./index.html')
		.pipe(wiredep({
			directory: './lib'
		}))
		.pipe(gulp.dest('./'));
});

//Servidor Web de Desarrollo
gulp.task('server', function () {
	connect.server({
		root: './',
		hostname: '0.0.0.0',
		port: 8080,
		livereload: true,
		middleware: function (connect, opt) {
			return [historyApiFallback];
		}
	});
});

//Busca errores en el JS y nos lo muestra en pantalla
gulp.task('jshint', function () {
	return gulp.src('./js/**/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

// Comprime imágenes jpg, png y svg
gulp.task('imagemin', function () {
	return gulp.src('./img/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist'))
})

//Preprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function (){
	gulp.src('./stylus/main.styl')
		.pipe(stylus({ use: nib(), compress: true }))
		.pipe(gulp.dest('./css'))
		.pipe(connect.reload())
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
	gulp.src('./**/*.html')
		.pipe(connect.reload())
}); 

// Vigila los cambios que se produzcan en el código y lanza las tareas relacionadas

gulp.task('watch', function () {
	gulp.watch(['./**/*.html'], ['html']);
	gulp.watch(['./stylus/**/*.styl'], ['css', 'inject']);
	gulp.watch(['./js/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
	gulp.watch(['./bower.json'], ['wiredep']);
	gulp.watch(['./img/**/*.jpg', './img/**/*.png', './img/**/*.svg'], ['imagemin']);
});

gulp.task('default', ['server', 'inject', 'wiredep', 'watch']);