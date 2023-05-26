const { src, dest, watch, series, parallel } = require('gulp');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const browsersync = require('browser-sync');
const group_media = require('gulp-group-css-media-queries');
const replace = require('gulp-replace');
const fileInclude = require('gulp-file-include');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const imagemin = require("gulp-imagemin");
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html-nosvg');
// let fs = import('fs');

//автообновление браузера //
function browserSync() {
	browsersync.init({
		server: {
			baseDir: 'dist/'
		},
		port: 3000,
		notify: false
	});
}

// Следит за html, обрабатывает и выкидывает файлы в dist //
function html() {
	return src(['app/**/*.html', '!app/**/_*.html'])
		.pipe(fileInclude())
		.pipe(webphtml()) // заменяет тег img на picture-source-img для подключения формата webp
		.pipe(dest('dist/'))
		.pipe(browsersync.stream())
}

// Следит за style.scss, конвертирует из него обычный и минифицированный файлы, закидывает их в dist/css //
function styles() {
	return src('app/scss/style.scss')
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(group_media())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 version'],
			cascade: false,
			grid: true
		}))
		.pipe(replace('url(../../img/', 'url(../img/'))
		.pipe(concat('style.css'))
		.pipe(dest('dist/css/'))
		.pipe(browsersync.stream())
}

// Следит за mypack.css,перекидывает в dist/css //
function myStylePack() {
	return src('app/scss/*.css')
		.pipe(scss({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 version'],
			cascade: false,
			grid: true
		}))
		.pipe(dest('dist/css/'))
		.pipe(browsersync.stream())
}

// Следит за script.js, конвертирует из него обычный и минифицированный файлы, закидывает их в dist/js //
function scripts() {
	return src('app/js/**/*.js')
		// .pipe(dest('dist/js/'))
		// .pipe(babel({
		// 	presets: ['@babel/env']
		// }))
		// .pipe(uglify())
		.pipe(concat('script.js'))
		.pipe(dest('dist/js/'))
		.pipe(browsersync.stream())
}

// Собирает все css плагинов, минифицирует и закидывает в dist/css с именем libs.min.css //
function stylesLibs() {
	return src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/swiper/swiper-bundle.css',
	])
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			cascade: false,
			grid: true
		}))
		.pipe(cssmin())
		.pipe(concat('libs.min.css'))
		.pipe(dest('dist/css/'))
		.pipe(browsersync.stream())
}

// Собирает все js плагинов, минифицирует и закидывает в dist/js с именем libs.min.js //
async function scriptsLibs() {
	return src([
		'node_modules/swiper/swiper-bundle.js',
	])
		.pipe(uglify())
		.pipe(concat('libs.min.js'))
		.pipe(dest('dist/js/'))
		.pipe(browsersync.stream())
}

// Следит за пикчами в app/img, сжимает и конвертирует их в .webp, отправляет в dist/img. Оригинальные файлы сжимает и отправляет в dist/img. Все удаленные файлы в папке app/img удалятся из папки dist/img при следующем запуске gulp //
function images() {
	return src('app/img/**/*.{jpg,png,gif}')
		.pipe(webp({
			quality: 70
		}))
		.pipe(dest('dist/img/'))
		.pipe(src('app/img/**/*.{jpg,png,svg,gif,ico,webp}'))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest('dist/img/'))
		.pipe(browsersync.stream())
}

// Функция слежки за файлами. //
function watching() {
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/**/*.html'], html);
	watch(['app/js/**/*.js'], scripts);
	watch(['app/img/**/*.{jpg,png,svg,gif,ico,webp}'], images);
}

// Функция удаления папки dist. Срабатывает при каждом запуске gulp, перед всеми функциями.//
function clear() {
	return del('dist/');
}

//Конвертация и подключение шрифтов.//
async function fonts() {
	// конвертирует шрифты ttf в woff и woff2, Ее необходимо один раз запустить перед запуском проекта, затем запустить функцию gulp fontsStyle, и только после этого запустить gulp //
	// src('app/fonts/*.ttf')
	// 	.pipe(ttf2woff())
	// 	.pipe(dest('dist/fonts/'));
	// return src('app/fonts/*.ttf')
	// 	.pipe(ttf2woff2())
	// 	.pipe(dest('dist/fonts/'));

	// перекидывает имеющиеся шрифты в dist
	src('app/fonts/*.woff')
		.pipe(dest('dist/fonts/'));
	src('app/fonts/*.woff2')
		.pipe(dest('dist/fonts/'));
};

// function fontsStyle() {
// 	// Подключает шрифты с помощью миксинов в файл fonts.scss. После запуска в файле fonts.scss меняем семейство и корректируем вес шрифта //
// 	let file_content = fs.readFileSync('app/scss/fonts.scss');
// 	if (file_content == '') {
// 		fs.writeFile('app/scss/fonts.scss', '', cb);
// 		return fs.readdir('dist/fonts/', function (err, items) {
// 			if (items) {
// 				let c_fontname;
// 				for (var i = 0; i < items.length; i++) {
// 					let fontname = items[i].split('.');
// 					fontname = fontname[0];
// 					if (c_fontname != fontname) {
// 						fs.appendFile('app/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
// 					}
// 					c_fontname = fontname;
// 				}
// 			}
// 		})
// 	}
// }

function cb() {
}


// exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.html = html;
exports.styles = styles;
exports.myStylePack = myStylePack;
exports.stylesLibs = stylesLibs;
exports.scripts = scripts;
exports.scriptsLibs = scriptsLibs;
exports.watching = watching;
exports.browserSync = browserSync;
exports.clear = clear;


exports.default = series(clear, stylesLibs, styles, myStylePack, html, scripts, scriptsLibs, images, fonts, parallel(watching, browserSync));
