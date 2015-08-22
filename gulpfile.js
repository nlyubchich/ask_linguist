var gulp = require('gulp');
var path = require('path');
var es = require('event-stream');
var glob = require('glob');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var pkginfo = require('./package.json');

gulp.task('default', function (done) {
    glob(pkginfo.assets.scripts.entries, function (err, files) {
        var tasks = files.map(function (file) {
            var b = browserify({
                entries: [file]
            });

            return b
                .bundle()
                .pipe(source(path.basename(file)))
                .pipe(rename({
                    extname: ".bundle.js"
                }))
                .pipe(buffer())
                .pipe(gulp.dest(pkginfo.assets.dist.path + "/js"));
        });
        es.merge(tasks).on('end', done);
    });
})
;
