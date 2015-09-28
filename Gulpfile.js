var gulp = require('gulp'),
	//sass = require('gulp-ruby-sass'),
	sass = require('gulp-sass'),
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'event-stream'],
		replaceString: /\bgulp[\-.]/
	}),
	folderSources   = {
		assetDir: './assets/',
		publicDir: './public/',
		bowerDir: './bower_components/',
		es6CompiledDir: './public/es6Compiled/'
	},
	//ES6 Stuff
	//traceur = require('gulp-traceur'),//using babel not traceur (http://weblogs.asp.net/dwahlin/getting-started-with-es6-%E2%80%93-transpiling-es6-to-es5)
	babel = require('gulp-babel'),
	plumber = require('gulp-plumber');
	//END ES6 Stuff

gulp.task('fonts', function() {
    gulp.src(folderSources.bowerDir + 'fontawesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('image', function(){
   gulp.src(folderSources.assetDir + 'images/*')
       .pipe($.imagemin())
       .pipe(gulp.dest(folderSources.publicDir + 'images'));
});

gulp.task('watch', function(){
    $.livereload.listen();

    gulp.watch(folderSources.assetDir + 'sass/*.scss', ['styles']);
    gulp.watch(folderSources.assetDir + 'js/*.js', ['scripts', 'babel']);
});

gulp.task('sass', function () {
	gulp.src(folderSources.assetDir + 'sass/*.scss')
		.pipe(sass().on('error', function(err) {
			console.error('Error!', err.message);
		}))
		.pipe(gulp.dest(folderSources.publicDir + 'stylesheets'))
		.pipe($.livereload());
});

//There is a javascript with main script, so compile it along with bower scripts
gulp.task('mainScripts', function(){
	var filesToCompile = [
		folderSources.assetDir + 'js/main.js'
	];

	compileScripts('map.min.js', filesToCompile);
});

//No login specific js, just
gulp.task('loginScripts', function(){
	compileScripts('login.min.js');
});

gulp.task('registerScripts', function(){
	compileScripts('register.min.js');
});

//Compile just scripts
gulp.task('scripts', [
	'mainScripts',
	'loginScripts',
	'registerScripts'
]);

//Compile all pieces
gulp.task('default', [
	'scripts',
	'sass',
	'image',
	'fonts',
	'watch'
]);

/***************
 *  Functions
 **************/
//Script compiling
function compileScripts(minFileName, filesArray) {
	var concat = $.concat,
		vendorFiles,
		projectFiles;

	vendorFiles = gulp.src($.mainBowerFiles())
		.pipe($.filter('*.js'))
		.pipe($.concat('vendor.js'));

	if(typeof filesArray !== 'undefined') {
		projectFiles = gulp.src(filesArray)
			//.pipe($.jshint())
			//.pipe($.jshint.reporter('default'))
			.pipe($.concat('app.js'))
			//babel
			.pipe(plumber())
			.pipe(babel());
	}

	//projectFiles won't be avail if there is no filesArray sent in, so just use vendorFiles, which is bower stuff :)
	$.eventStream.concat(vendorFiles, projectFiles || vendorFiles)
		.pipe($.order([
			'vendor.js',
			'app.js'
		]))
		.pipe(concat(minFileName))
		.pipe($.uglify())
		.pipe(gulp.dest(folderSources.publicDir + 'scripts'))
		.pipe($.livereload());
}