
  var App,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  var Color = net.brehaut.Color;

  window.App = (function() {
    App.prototype.canvasGL = null;

    App.prototype.container = null;

    App.prototype.scene = null;

    App.prototype.camera = null;

    App.prototype.renderer = null;

    App.prototype.geometry = null;

    App.prototype.material = null;

    App.prototype.mesh = null;

    App.prototype.gui = null;

    App.prototype.terrain = null;

    App.prototype.composer = null;

    App.prototype.render_pass = null;

    App.prototype.fxaa_pass = null;

    App.prototype.posteffect = false;

    App.prototype.meteo = null;

    App.prototype.skybox = null;

    function App() {
      this.resize = bind(this.resize, this);
      this.renderScene = bind(this.renderScene, this);
      this.update = bind(this.update, this);
      this.init = bind(this.init, this);
    }

    App.prototype.init = function() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
      this.camera.position.x = 0;
      this.camera.position.y = 1;
      this.camera.position.z = 7;
      this.renderer = new THREE.WebGLRenderer({
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        antialias: false,
        //设置透明
        alpha: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      //console.log(window.innerWidth, window.innerHeight);
      //设置场景颜色(透明颜色用 setClearColor(0x000000, 0))
      this.renderer.setClearColor(0xe0e0e0, 1);
      this.container = document.createElement('div');
      this.container.id = 'canvasGL';
      this.container.appendChild(this.renderer.domElement);
      this.camera.lookAt(new THREE.Vector3());
      document.getElementById('experience').appendChild(this.container);
      this.terrain = new Terrain(this.scene);
      //场景的灯光
      this.ambientLight = new THREE.AmbientLight( 0xe0e0e0);
      this.scene.add( this.ambientLight );
      this.scene.add(this.terrain.plane_mesh);
      console.log('init');
      return this.update();
    };

    App.prototype.update = function() {
      requestAnimationFrame(this.update);
      this.terrain.update();
      return this.renderScene();
    };

    App.prototype.renderScene = function() {
      return this.renderer.render(this.scene, this.camera);
    };

    App.prototype.resize = function(stageWidth, stageHeight) {
      this.camera.aspect = stageWidth / stageHeight;
      this.camera.updateProjectionMatrix();
      return this.renderer.setSize(stageWidth, stageHeight);
    };

    // App.prototype.setBgcolor = function(color){
    //   bgcolor = new THREE.Color(color);
    //   this.renderer.setClearColor(bgcolor, 1);
    //   this.ambientLight.color = bgcolor;
    //   //this.renderer.setClearColor(0x000000, 1);
    //   console.log('sbc');
    //   return this.update();
    // };
    var ratiod =0;
    var ratiol =0;
    var lightcolor = "#eeeeeee";
    var darkcolor = "#000000";
    App.prototype.bgDarker = function(){
      ratiod += 0.01;
      lightcolor = Color(lightcolor).darkenByAmount( 0.01 ).toString();
      this.renderer.setClearColor(lightcolor, 1);
      this.ambientLight.color = new THREE.Color(lightcolor);
      //console.log(lightcolor);
      if (Math.abs(ratiod - 1) > 0.01) {
        //console.log(ratiod, lightcolor);
         requestAnimationFrame(this.bgDarker.bind(this));
      }else{
        ratiod = 0;
        lightcolor = "#eeeeee";
      }
    };
    App.prototype.bgLighter = function(){
       ratiol  += 0.01;
       darkcolor = Color(darkcolor).lightenByAmount( 0.01 ).toString();
       this.renderer.setClearColor(darkcolor,1);
       this.ambientLight.color = new THREE.Color(darkcolor);
       //console.log(darkcolor);
       if (Math.abs(ratiol - 0.75) > 0.005) {
          //console.log(ratiol, darkcolor);
          requestAnimationFrame(this.bgLighter.bind(this));
       }else{
          ratiol = 0;
          darkcolor = "#000000";
       }
    };

    App.prototype.bgWhite = function(){
       this.renderer.setClearColor("#ffffff",1);
       this.ambientLight.color = new THREE.Color("#ffffff");
       
    };

    App.prototype.movecamera = function(){
      //相机目标坐标
       var desX = 0,
          desY = -3,
          desZ = 9;
      //判断参数以及变化步长 
      var judgeX = Math.abs(desX - this.camera.position.x );
      var judgeY = Math.abs(desY - this.camera.position.y );
      var judgeZ = Math.abs(desZ - this.camera.position.z );
      var pace = 0.05;

      if (judgeY >0.05){
        requestAnimationFrame(movecamera);
        this.camera.position.y -= pace;
      }
    };

    return App;

  })();

  window.Terrain = (function() {
    Terrain.prototype.uniforms = null;

    Terrain.prototype.plane_mesh = null;

    Terrain.prototype.plane_geometry = null;

    Terrain.prototype.groundMaterial = null;

    Terrain.prototype.clock = new THREE.Clock(true);

    Terrain.prototype.options = {
      elevation: 1,
      noise_range: 2.14,
      sombrero_amplitude: 0.6,
      sombrero_frequency: 10.0,
      speed: 0.1,
      segments: 324,
      wireframe_color: '#ffffff',
      perlin_passes: 1,
      wireframe: true,
      floor_visible: true//groundMaterial.visible 地面颜色
    };

    Terrain.prototype.scene = null;

    function Terrain(scene) {
      this.update = bind(this.update, this);
      this.buildPlanes = bind(this.buildPlanes, this);
      this.initGUI = bind(this.initGUI, this);
      this.init = bind(this.init, this);
      this.scene = scene;
      this.init();
    }

    Terrain.prototype.init = function() {
      this.uniforms = {
        time: {
          type: "f",
          value: 0.0
        },
        speed: {
          type: "f",
          value: this.options.speed
        },
        elevation: {
          type: "f",
          value: this.options.elevation
        },
        noise_range: {
          type: "f",
          value: this.options.noise_range
        },
        offset: {
          type: "f",
          value: this.options.elevation
        },
        perlin_passes: {
          type: "f",
          value: this.options.perlin_passes
        },
        sombrero_amplitude: {
          type: "f",
          value: this.options.sombrero_amplitude
        },
        sombrero_frequency: {
          type: "f",
          value: this.options.sombrero_frequency
        },
        line_color: {
          type: "c",
          value: new THREE.Color(this.options.wireframe_color)
        }
      };
      this.buildPlanes(this.options.segments);
      return this.initGUI();
    };

    Terrain.prototype.initGUI = function() {
      this.gui = new dat.GUI();
      this.gui.values = {};
      this.gui.values.speed = this.gui.add(this.options, 'speed', -5, 5).step(0.01);
      this.gui.values.segments = this.gui.add(this.options, 'segments', 20, 800).step(1);
      this.gui.values.perlin_passes = this.gui.add(this.options, 'perlin_passes', 1, 3).step(1);
      this.gui.values.elevation = this.gui.add(this.options, 'elevation', -10, 10).step(0.01);
      this.gui.values.noise_range = this.gui.add(this.options, 'noise_range', -10, 10).step(0.01);
      this.gui.values.sombrero_amplitude = this.gui.add(this.options, 'sombrero_amplitude', -5, 5).step(0.1);
      this.gui.values.sombrero_frequency = this.gui.add(this.options, 'sombrero_frequency', 0, 100).step(0.1);
      this.gui.values.wireframe_color = this.gui.addColor(this.options, 'wireframe_color');
      this.gui.values.wireframe = this.gui.add(this.options, 'wireframe');
      this.gui.values.floor_visible = this.gui.add(this.options, 'floor_visible');
      this.gui.values.elevation.onChange((function(_this) {
        return function(value) {
          _this.uniforms.elevation.value = value;
        };
      })(this));
      this.gui.values.wireframe.onChange((function(_this) {
        return function(value) {
          _this.plane_material.wireframe = value;
        };
      })(this));
      this.gui.values.floor_visible.onChange((function(_this) {
        return function(value) {
          _this.groundMaterial.visible = value;
        };
      })(this));
      this.gui.values.noise_range.onChange((function(_this) {
        return function(value) {
          _this.uniforms.noise_range.value = value;
        };
      })(this));
      this.gui.values.speed.onChange((function(_this) {
        return function(value) {
          _this.uniforms.speed.value = value;
        };
      })(this));
      this.gui.values.perlin_passes.onChange((function(_this) {
        return function(value) {
          _this.uniforms.perlin_passes.value = value;
        };
      })(this));
      this.gui.values.sombrero_amplitude.onChange((function(_this) {
        return function(value) {
          _this.uniforms.sombrero_amplitude.value = value;
        };
      })(this));
      this.gui.values.sombrero_frequency.onChange((function(_this) {
        return function(value) {
          _this.uniforms.sombrero_frequency.value = value;
        };
      })(this));
      this.gui.values.wireframe_color.onChange((function(_this) {
        return function(value) {
          _this.uniforms.line_color.value = new THREE.Color(value);
        };
      })(this));
      return this.gui.values.segments.onFinishChange((function(_this) {
        return function(value) {
          _this.scene.remove(_this.plane_mesh);
          _this.buildPlanes(value);
          _this.scene.add(_this.plane_mesh);
        };
      })(this));
    };

    Terrain.prototype.buildPlanes = function(segments) {
      this.plane_geometry = new THREE.PlaneBufferGeometry(20, 20, segments, segments);
      this.plane_material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('shader-vertex-terrain-perlinsombrero').textContent,
        fragmentShader: document.getElementById('shader-fragment-terrain').textContent,
        wireframe: this.options.wireframe,
        wireframeLinewidth: 1,
        transparent: true,
        uniforms: this.uniforms
      });
      //地板
      this.groundMaterial = new THREE.MeshPhongMaterial({
        ambient: 0xffffff,
        color: 0xffffff,
        specular: 0xffffff,
        transparent: 1,
        opacity: 1
      });
      //this.groundMaterial.color.setRGB(243,243,243);//
      this.groundMaterial.side = THREE.DoubleSide; //设置地板是双面的
      this.materials = [this.groundMaterial, this.plane_material];
      this.plane_mesh = THREE.SceneUtils.createMultiMaterialObject(this.plane_geometry, this.materials);
      //this.plane_mesh.rotation.x = -0.5;
      //rotation pi/2 = 90 degree
      this.plane_mesh.rotation.x = -Math.PI/2;
      //this.plane_mesh.rotation.z = Math.PI / 2;
      //this.plane_mesh.rotation.y = Math.PI / 2 - 1;
      //return this.plane_mesh.position.y = -0.5;
      return this.plane_mesh.position.y = -0.5;
    };

    Terrain.prototype.update = function() {
      return this.plane_material.uniforms['time'].value = this.clock.getElapsedTime();
    };

    // rotate.x 初始值为 -pi/2
    Terrain.prototype.rotateX = function(){

         requestAnimationFrame(this.rotateX.bind(this));
         this.plane_mesh.rotation.x -= 0.01;
        //console.log(this.plane_mesh.rotation.x);
      
    };

    Terrain.prototype.rotateX360 = function(){
       if (Math.abs(this.plane_mesh.rotation.x + 2.5*Math.PI) > 0.01) {
          this.plane_mesh.rotation.x -= 0.01;
          requestAnimationFrame(this.rotateX360.bind(this));
       }
    };

    Terrain.prototype.rotateX180 = function(){
        //console.log(this.plane_mesh.rotation.x);
       if (Math.abs(this.plane_mesh.rotation.x + 1.5*Math.PI + 0.4) > 0.01) {
          this.plane_mesh.rotation.x -= 0.01;
          requestAnimationFrame(this.rotateX180.bind(this));
       }
    };

    Terrain.prototype.rotateX180reverse = function(){
        //console.log(this.plane_mesh.rotation.x);
       if (Math.abs(-this.plane_mesh.rotation.x + 0.5*Math.PI -0.4 ) > 0.01) {
          this.plane_mesh.rotation.x += 0.01;
          requestAnimationFrame(this.rotateX180reverse.bind(this));
       }
    };

    Terrain.prototype.rotateX180reverseMoveTop = function(){
        //console.log(this.plane_mesh.rotation.x);
        //console.log('rrmt');
        //此处y加了 加到了5;
        
       if (Math.abs(-this.plane_mesh.rotation.x + 0.5*Math.PI - 0.23  ) > 0.01 && this.plane_mesh.position.y <5) {
          this.plane_mesh.rotation.x += 0.01;
          this.plane_mesh.position.y += 0.016;
          //console.log(this.plane_mesh.rotation.x,this.plane_mesh.rotation.y,"01");
          requestAnimationFrame(this.rotateX180reverseMoveTop.bind(this));
       }else{
          $('.load-contents').trigger("terrainAnimation");
          $('.load-contents').trigger("animationComplete");
       }
    };

    Terrain.prototype.reset10 = function(){
      console.log('reset10');
      
      if (this.plane_mesh.rotation.x > -0.5*Math.PI  && this.plane_mesh.position.y >-0.5) {
          this.plane_mesh.rotation.x -= 0.01;
          this.plane_mesh.position.y -= 0.016;
           console.log('reset10 do');
          //console.log(this.plane_mesh.rotation.x,this.plane_mesh.rotation.y,"10");
          requestAnimationFrame(this.reset10.bind(this));
      }else{
        console.log('reset10 not');
        $('.load-contents').trigger("terrainAnimation");
        $('.load-contents').trigger("animationComplete");
      }
    };

    Terrain.prototype.rotateX90 = function() {
      // body...
      if (this.plane_mesh.rotation.x < 0) {
        this.plane_mesh.rotation.x += 0.01;
       // console.log(this.plane_mesh.rotation.x);
        requestAnimationFrame(this.rotateX90.bind(this));
      }else{
        $('.load-contents').trigger("terrainAnimation");
        $('.load-contents').trigger("animationComplete");
      }

    };

    Terrain.prototype.reset20 = function() {
      if (this.plane_mesh.rotation.x > -0.5*Math.PI) {
        this.plane_mesh.rotation.x -= 0.01;
        requestAnimationFrame(this.reset20.bind(this));
      }else{
        $('.load-contents').trigger("terrainAnimation");
        $('.load-contents').trigger("animationComplete");
      }
    };

    Terrain.prototype.t12 = function(){
      console.log(this.plane_mesh.position.y,this.plane_mesh.rotation.x);
      if (this.plane_mesh.rotation.x > 0) {
        this.plane_mesh.rotation.x -= 0.01;
        this.plane_mesh.position.y -= 0.035;
        requestAnimationFrame(this.t12.bind(this));
      }else{
        $('.load-contents').trigger("terrainAnimation");
        $('.load-contents').trigger("animationComplete");
      }
    };

    Terrain.prototype.t21 = function(){
      console.log('21');
       if (Math.abs(-this.plane_mesh.rotation.x + 0.5*Math.PI - 0.23  ) > 0.01) {
        this.plane_mesh.rotation.x += 0.01;
        this.plane_mesh.position.y += 0.035;
        requestAnimationFrame(this.t21.bind(this));
      }else{
        $('.load-contents').trigger("terrainAnimation");
        $('.load-contents').trigger("animationComplete");
      }
    };

    Terrain.prototype.stay = function(){

      setTimeout(function(){
        $('.load-contents').trigger("terrainAnimation");
        $('.load-contents').trigger("animationComplete");
      }, 1000);
        
    };

    Terrain.prototype.disappear = function(argument){
      console.log('disapr');
      var $canvas_wrapper = $('#experience');
      $canvas_wrapper.fadeOut(500);
      setTimeout(function(){
        $('.load-contents').trigger("terrainAnimation");
        $('.load-contents').trigger("animationComplete");
        $canvas_wrapper.remove();
      }, 1000);
    };

    Terrain.prototype.appear = function(argument){
      var $canvas_wrapper = $('#experience');
      $canvas_wrapper.fadeIn(500);
      // setTimeout(function(){
      //   $('.load-contents').trigger("terrainAnimation");
      //   $('.load-contents').trigger("animationComplete");
      // }, 1000);
    };


    Terrain.prototype.rotateXStop = function(){
      //this.plane_mesh.rotation.x = 0;
    };

    Terrain.prototype.changeWireframeColor = function(color){
      //console.log(color);
      var lineColor = new THREE.Color(color);
      this.uniforms.line_color.value = lineColor;
    };

    return Terrain;

  })();

  App = new window.App();

  App.init();
  //窗口大小移动事件
  window.addEventListener('resize', function(){
    App.resize(this.innerWidth,this.innerHeight);
  });




