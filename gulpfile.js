const { src, dest, watch, parallel} = require("gulp");

// CSS

const sass = require("gulp-sass")(require('sass'));

const plumber = require('gulp-plumber');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

const sourcemaps = require('gulp-sourcemaps')

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// javascript

const terser = require('gulp-terser-js');


function css(cb) {

    src('src/scss/**/*.scss')         // Identificar el archivo de SASS
        .pipe( plumber())
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss( [ autoprefixer(), cssnano() ]) )   
        .pipe( sourcemaps.write('.') )           // Compilarlo
        .pipe(dest("build/css"))    // Almacenarla o guardarla en el disco duro

    cb(); // callback que avisa a gulp cuando llegamos al final
}
function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    };

    src('src/img/**/*.{png,jpg}') 
        .pipe( cache( imagemin(opciones)))
        .pipe( dest('build/img'))

    done();
}

function versionWebp(done) {

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )

    done();
}
function versionAvif(done) {

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )

    done();
}

function javascript( cb ) {
    src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe(dest('build/js'));
    
    cb();
}

function dev(cb) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    cb();
}




exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev );