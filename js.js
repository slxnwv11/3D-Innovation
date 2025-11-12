(function(){
      var section = document.getElementById('heroSection');
      if(!section || !window.THREE) return;
      var canvas = document.createElement('canvas');
      canvas.id = 'hero3dCanvas';
      canvas.className = 'hero-canvas';
      section.prepend(canvas);
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0,0,6);
      var dir = new THREE.DirectionalLight(0xffffff, 0.9); dir.position.set(5,5,5); scene.add(dir);
      var point = new THREE.PointLight(0xe53935, 1.6, 20); point.position.set(-4,-2,3); scene.add(point);
      var geo = new THREE.TorusKnotGeometry(1, 0.35, 220, 32);
      var mat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.75, roughness: 0.2, emissive: 0xe53935, emissiveIntensity: 0.35 });
      var knot = new THREE.Mesh(geo, mat); scene.add(knot);
      var starGeo = new THREE.BufferGeometry();
      var count = 450; var pos = new Float32Array(count*3);
      for(var i=0;i<count;i++){ pos[i*3]=(Math.random()-0.5)*20; pos[i*3+1]=(Math.random()-0.5)*12; pos[i*3+2]=(Math.random()-0.5)*10-2; }
      starGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
      var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color:0xe53935, size:0.02 })); scene.add(stars);
      function resize(){ var r=section.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect=r.width/r.height; camera.updateProjectionMatrix(); }
      resize(); window.addEventListener('resize', resize);
      if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        (function anim(){ knot.rotation.x+=0.005; knot.rotation.y+=0.008; stars.rotation.y-=0.0008; renderer.render(scene, camera); requestAnimationFrame(anim); })();
      } else { renderer.render(scene, camera); }
    })();
    (function(){
      if(!window.THREE) return;
      var cvs = document.querySelectorAll('canvas.tile-canvas');
      if(!cvs.length) return;
      var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      cvs.forEach(function(cv){
        var type = cv.getAttribute('data-type') || 'interior';
        var renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(2.4, 2.0, 3.2);
        var hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 0.9); scene.add(hemi);
        var red = new THREE.PointLight(0xe53935, 1.4, 10); red.position.set(-2, 1.5, 1.5); scene.add(red);
        var group = new THREE.Group(); scene.add(group);

        function gridTexture(opts){
          var size = opts.size||512, cell=opts.cell||64, bg=opts.bg||'#111', line=opts.line||'#e53935', lw=opts.lw||2;
          var c=document.createElement('canvas'); c.width=c.height=size; var g=c.getContext('2d');
          g.fillStyle=bg; g.fillRect(0,0,size,size); g.strokeStyle=line; g.lineWidth=lw; g.globalAlpha=0.8;
          for(var i=0;i<=size;i+=cell){ g.beginPath(); g.moveTo(i,0); g.lineTo(i,size); g.stroke(); g.beginPath(); g.moveTo(0,i); g.lineTo(size,i); g.stroke(); }
          var tex = new THREE.CanvasTexture(c); tex.wrapS=tex.wrapT=THREE.RepeatWrapping; return tex;
        }

        if(type==='interior' || type==='technical'){
          var tex = gridTexture({ bg:'#0b0b0b', line:'#e53935', cell:64, lw:2 });
          tex.repeat.set(4,4);
          var mat = new THREE.MeshStandardMaterial({ map: tex, metalness: (type==='technical'?0.6:0.25), roughness: (type==='technical'?0.35:0.5) });
          for(var x=-2; x<2; x++){
            for(var z=-2; z<2; z++){
              var box = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 0.95), mat);
              box.position.set(x, -0.03, z);
              group.add(box);
            }
          }
        } else if(type==='stack20'){
          var tex2 = gridTexture({ bg:'#0b0b0b', line:'#e53935', cell:80, lw:2 }); tex2.repeat.set(1,1);
          var mat2 = new THREE.MeshStandardMaterial({ map: tex2, metalness:0.2, roughness:0.4 });
          for(var i=0;i<5;i++){
            var tile = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 1.0), mat2);
            tile.position.set(0, i*0.22 - 0.4, 0);
            group.add(tile);
          }
          camera.position.set(2.6, 1.7, 2.8);
        }

        function resize(){ var r=cv.getBoundingClientRect(); if(r.width>0 && r.height>0){ renderer.setSize(r.width, r.height, false); camera.aspect=r.width/r.height; camera.updateProjectionMatrix(); } }
        resize(); window.addEventListener('resize', resize);
        function animate(){ group.rotation.y += 0.003; red.position.x = Math.sin(Date.now()*0.001)*2.2; renderer.render(scene,camera); if(!prefersReduced) requestAnimationFrame(animate); }
        animate();
      });
    })();

    var dataSpyList = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'))
    dataSpyList.forEach(function (dataSpyEl) {
      bootstrap.ScrollSpy.getInstance(dataSpyEl) || new bootstrap.ScrollSpy(dataSpyEl, {
        target: document.querySelector(dataSpyEl.getAttribute('data-bs-target')),
        offset: parseInt(dataSpyEl.getAttribute('data-bs-offset')||80, 10)
      })
    })
