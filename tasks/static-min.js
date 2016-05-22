module.exports = function(grunt) {

  grunt.registerTask('static-min'
  , 'Generate dist static files and modify html'
  , function(target){
    grunt.task.run([
      'useminPrepare',
      'imagemin',
      'svgmin',
      'concat',
      'cssmin',
      'uglify',
      'copy:dist',
      'rev',
      'usemin',
      // 'htmlmin'
    ])
  });
};
