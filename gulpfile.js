var gulp            = require('gulp');
var sass            = require('gulp-sass');
var prefix          = require('gulp-autoprefixer');
var browserSync     = require('browser-sync');

//Sass task
gulp.task('sass', function() {
    return gulp.src('assets/css/main.sass')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) //add prefix
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('reload', function() {
    return gulp.src('').pipe(browserSync.reload({stream:true}));
});

//Watch task
gulp.task('watch', function() {
    gulp.watch('assets/css/*.sass', ['sass']);
    gulp.watch('assets/css/*/*.sass', ['sass']);
    gulp.watch('assets/js/*.js', ['reload']);
    gulp.watch('*.html', ['reload']);
});

gulp.task('browser-sync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: './',
            index: 'index.html'
        },
        notify: false
    });
});


//Default Task
gulp.task('default', ['browser-sync','watch']);
