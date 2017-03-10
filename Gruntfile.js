module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    gitadd: {
      task: {
        options: {
          verbose: true,
          all: true,
          cwd: './'
        }
      }
    },

    gitcommit: {
      task: {
        options: {
          message: 'Repo updated on ' + grunt.template.today(),
          allowEmpty: true,
          cwd: './'
        }
      }
    },

    gitpush: {
      your_target: {
        options: {
          remote: 'live',
          branch: 'master'
        }
      }
    },

    concat: {
      options: {
        separator: '//\n'
      },
      client_and_lib: {
        files: {
          'public/dist/build.js': ['public/client/app.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linkView.js', 'public/client/linksView.js', 'public/client/createLinkView.js', 'public/client/router.js'],
          'public/dist/lib.js': ['public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/backbone.js', 'public/lib/handlebars.js']
        }
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/build.min.js': ['public/dist/build.js'],
          'public/dist/lib.min.js': ['public/dist/lib.js']
        }
      }
    },

    eslint: {
      target: [
        'public/dist/*.min.*'
      ]
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    clean: [
      'public/dist/build.js', 'public/dist/lib.js'
    ],

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'build'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////
  
  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat', 'uglify', 'cssmin', 'clean', 'eslint', 'test'
  ]);

  grunt.registerTask('upload', [
    'gitadd', 'gitcommit', 'gitpush'
  ]);

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['build', 'upload']);
    } else {
      grunt.task.run(['build', 'server-dev']);
    }
  });

};
