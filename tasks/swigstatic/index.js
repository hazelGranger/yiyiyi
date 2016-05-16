'use strict';
module.exports = function(grunt) {
  var path = require('path')
    , swig = require('swig')
    , _ = require('lodash')
    , md2html = require('markdown').markdown
  grunt.registerMultiTask('swigstatic', 'generate from templates', function() {
    var options = this.options({
      cache: false,
      autoEscape: true,
      varControls: ['{{', '}}'],
      tagControls: ['{%', '%}'],
      cmtControls: ['{#', '#}'],
      context:{},
      contents:''
    });
    var locals = _.chain({})
                  .merge(contextResult(options.context))
                  .merge(contextResult(this.data.context))
                  .value();
    swig.setDefaults({
      cache: options.cache,
      locals: locals,
      autoescape: options.autoEscape,
      varControls: options.varControls,
      tagControls: options.tagControls,
      cmtControls: options.cmtControls
    });
    handleFiles(this.files);
    if(options.contents){
      generateContent(options.contents,this.data.files[0].dest)
    }
    function generateContent(root,destDir){
      var layouts = grunt.file.expand({filter:'isFile'},path.join(root,'./*.html'))

      layouts.forEach(function(i){
        var moduleName = path.basename(i,'.html')
          , markdownFiles = grunt.file.expand({filter:'isFile'},path.join(root,moduleName,'./*.{md,markdown}'))
        markdownFiles.forEach(function(filepath){
          var content;
          try{
            content = grunt.file.read(filepath)
          }catch(err){
            content = ''
            grunt.log.warn('Source file "' + filepath + '" not created.');
          }
          var result = md2html.toHTMLTree(content,'Maruku')
          var refs = {}
          if(result&&result[1]){
            refs = result[1]
          }
          var relativePath = filepath.replace(root,'./').replace(/\.(md|markdown)/,'.html')
          var relativeDir = path.dirname(relativePath)
          grunt.file.expand([path.join(root,relativeDir,'./*'),'!'+path.join(root,relativeDir,'./*.{md,markdown}')]).forEach(function(otherPath){
            grunt.file.copy(otherPath,path.join(destDir,otherPath.replace(root,'./')))
          });
          renderFile(path.join(destDir,relativePath), i, _.assign({},refs,{
            markdown:function(){
              return md2html.renderJsonML(result)
            }
          }));
        })
      })
    }

    function contextResult(ctx){
      var context = {}
      if(_.isPlainObject(ctx)){
        return ctx
      }else if(_.isString(ctx)){
        try{
          context = grunt.file.readJSON(ctx)
        }catch(err){
          grunt.fail.fatal(err)
        }
      }else{
        grunt.log.warn(this.nameArgs + '\'s context is not found.');
      }
      return context
    }
    function handleFiles(files) {
      files.forEach(function(f) {
        f.src.filter(srcExists).forEach(function(filepath) {
          var context
            , contextPathJSON = filepath.substring(0,filepath.lastIndexOf('.'))+'.json'
            , contextPathJs = filepath.substring(0,filepath.lastIndexOf('.'))+'.js';
          try{
            context = grunt.file.readJSON(contextPathJSON)
          }catch(err){
            context = {}
            try{
              context = require(contextPathJs)
            }catch(err){
              context = {}
            }
            // grunt.log.warn('Source file "' + contextPathJSON + '" not found.');
          }
          renderFile(f.dest, filepath, context);
        });
      });
    };

    function srcExists(filepath) {
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      } else {
        return true;
      }
    };
    function renderFile(outfile, filepath, context) {
      try{
        grunt.file.write(outfile, swig.renderFile(filepath, context));
        grunt.log.ok('File "' + outfile + '" created.');
      }catch(e){
        grunt.fail.fatal('File "' + outfile + '" failed.');
      }    
    }
  });
};
