var gulp = require('gulp'),
		sass         = require('gulp-sass'), //Подключаем Sass пакет,
		imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
		pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
		browserSync  = require('browser-sync'), // Подключаем Browser Sync
		del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
		cache        = require('gulp-cache'); // Подключаем библиотеку кеширования

gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src('app/sass/**/*.scss') // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app/' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});

gulp.task('css-libs', function() {
	return gulp.src('app/css/style.css') // Выбираем файл для минификации
		.pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/js/jquery.min.js', // Берем jQuery
		'app/js/script.js', // Мой скрипт
		])
		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.scss', gulp.parallel('sass')); // Наблюдение за sass файлами в папке sass
	gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	// return del.sync('dist'); // Удаляем папку dist перед сборкой
  return del(['dist']);
});

gulp.task('dest', function() {
 
	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'app/css/master.css',
		'app/css/style.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

	return buildHtml

});

gulp.task('build', gulp.series('clean', 'img', 'sass', 'dest'));


gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', gulp.parallel('watch', 'browser-sync', 'css-libs', 'scripts'));