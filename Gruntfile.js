'use strict';

var path = require('path')
module.exports = function(grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  try{
    require('load-grunt-tasks')(grunt);
  }catch(e){
    console.log(e)
  }


  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    //swig templates
    swigstatic:{
      options:{
        context:'config/default.json',
        contents:'contents/'
      },
      dev:{
        context:'config/dev.json',
        files: [{
          expand: true,
          cwd: '<%= config.app %>/templates/',
          dest: '.tmp/',
          src: ['**/*.html','!base/*.html']
        }]
      },
      dist:{
        context:'config/dist.json',
        files: [{
          expand: true,
          cwd: '<%= config.app %>/templates/',
          dest: '<%= config.dist %>/',
          src: ['**/*.html','!base/*.html']
        }]
      },
      test:{
        context:'config/test.json',
        files: [{
          expand: true,
          cwd: '<%= config.app %>/templates/',
          dest: '<%= config.dist %>/',
          src: ['**/*.html','!base/*.html']
        }]
      }
    },
    //less
    less:{
      dev:{
        options: {
          paths: ["<%= config.app %>/styles"]
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles/',
          dest: '.tmp/styles/',
          src: ['**/*.less'],
          ext: '.css'
        }]
      },
      dist:{
        options: {
          paths: ["<%= config.app %>/styles"]
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles/',
          dest: '.tmp/styles/',
          src: ['**/*.less'],
          ext: '.css'
        }]
      }
    },
    favicons: {
      options: {
        trueColor: true,
        precomposed: true,
        appleTouchBackgroundColor: "#fff",
        coast: true,
        windowsTile: true,
        tileBlackWhite: false,
        tileColor: "auto",
        html: '<%= config.dist %>/index.html',
        HTMLPrefix: "/"
      },
      dist: {
        src: 'src/logo.png',
        dest: '<%= config.dist %>'
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      html:{
        files: ['<%= config.app %>/templates/{,*/,**/,***/}*.{html,json}','config/{,*/}*.json'],
        tasks: ['swigstatic:dev']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/,**/,***/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: false
        }
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.less'],
        tasks: ['less:dev']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.tmp/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: false,
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          keepalive:true,
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/,**/,***/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/,**/,***/}*.js'
      ]
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/scripts/{,*/,**/,***/}*.js',
            '!<%= config.dist %>/scripts/asynchronous/*.js',//除去异步文件夹里的js
            '<%= config.dist %>/styles/{,*/,**/,***/}*.css',
            '!<%= config.dist %>/styles/asynchronous/*.css',//除去异步文件夹里的css
            '<%= config.dist %>/images/{,*/,**/,***/}*.*',
            '<%= config.dist %>/fonts/{,*/,**/,***/}*.*'
            // ,
            // '<%= config.dist %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>',
        root:'<%= config.app %>'
      },
      html: '<%= config.dist %>/{,*/,**/,***/}*.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles',
          '<%= config.dist %>/scripts'
        ]
      },
      html: ['<%= config.dist %>/{,*/,**/,***/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/,**/,***/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '**/*.{gif,jpeg,jpg,png,svg}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '**/*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/,**/,***/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            './*.{ico,png,txt,html,xml,svg,js}'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= config.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/font-awesome',
          src: 'fonts/*',
          dest: '<%= config.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          src: 'fonts/*',
          dest: '<%= config.dist %>'
        }]
      }
    },
    cdnify: {
      dist: {
        options: {
          css:false,
          rewriter:function(url){
            // console.log('cdnify',url);
            if(!url){
              return url
            }
            if(/^(http|\/\/)/.test(url)){
              return url
            }
            return url
          }
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '**/*.{css,html}',
          dest: '<%= config.dist %>'
        }]
      }
    }
  });

  grunt.registerTask('serve'
  , 'start the server and preview your app at 127.0.0.1:9000'
  , [
    'clean:server',
    'swigstatic:dev',
    'less:dev',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('dist'
  , 'Generate dist sitefiles with cdn'
  , [
    'clean:dist',
    'clean:server',
    'swigstatic:dist',
    'less:dist',
    // 'favicons:dist',
    'static-min:dist',
    'cdnify:dist'
  ]);

  grunt.registerTask('test'
  , 'test dist sitefiles '
  , [
    'clean:dist',
    'clean:server',
    'swigstatic:test',
    'less:dist',
    // 'favicons:dist',
    'static-min:dist',
    'connect:dist'
  ]);

  grunt.task.loadTasks('tasks');
  grunt.task.loadTasks('tasks/swigstatic');
};
