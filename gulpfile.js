const gulp = require('gulp');
const del = require('del');
const dotenv = require('dotenv');
const replace = require('gulp-replace');

// development
gulp.task('env-dev', () => {
    const envPattern = /\.env ?= ?{([^;]+)/g;
    const envFile = dotenv.config({ path: '.env.dev' });

    // clear env
    gulp
        .src('index.html')
        .pipe(replace(envPattern, '.env = {}'))
        .pipe(gulp.dest('.'));

    // check for the errors
    if (envFile.error) {
        throw envFile.error;
    }

    const replacement = `.env = ${JSON.stringify(envFile.parsed)}`;

    return gulp
        .src('index.html')
        .pipe(replace(envPattern, replacement))
        .pipe(gulp.dest('.'));
});

// production
gulp.task('env-prod', () => {
    const envPattern = /\.env ?= ?{([^;]+)/g;
    const envFile = dotenv.config({ path: '.env.prod' });

    // production
    gulp
        .src('functions/build/**/index.html')
        .pipe(replace(envPattern, '.env={}'))
        .pipe(gulp.dest('functions/build'));

    // check for the errors
    if (envFile.error) {
        throw envFile.error;
    }

    const replacement = `.env = ${JSON.stringify(envFile.parsed)}`;

    return gulp
        .src('functions/build/**/index.html')
        .pipe(replace(envPattern, replacement))
        .pipe(gulp.dest('functions/build'));
});

/**
 * Builds the Firebase-ready version of the PWA, moving the necessary
 * files to the functions folder to be used by PRPL Server
 */
gulp.task('firebase', () => {
    // These are the files needed by PRPL Server, that are going to be moved to the functions folder
    const filesToMove = [
        'build/polymer.json',
        'build/**/index.html',
        'build/**/push-manifest.json'
    ];
    // Delete the build folder inside the functions folder
    return (
        del('functions/build')
            .then(
                () =>
                // Copy the files needed by PRPL Server
                    new Promise(resolve =>
                        gulp
                            .src(filesToMove, { base: '.' })
                            .pipe(gulp.dest('functions'))
                            .on('end', resolve)
                    )
            )
        // Delete them from the original build
            .then(() => del(filesToMove))
    );
});
