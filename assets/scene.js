var camera, scene, renderer;
var mesh, material, sky;
init();
animate();

var textureCube;

function getMaterial(color) {
    var normalMap = THREE.ImageUtils.loadTexture('car_normal.png', null, function(something) {
        render();
    });

    var uniforms = {
        paintColor1: {
            type: "c",
            value: new THREE.Color(color)
        },
        paintColor2: {
            type: "c",
            value: new THREE.Color(0x888888)
        },
        paintColor3: {
            type: "c",
            value: new THREE.Color(0x222222)
        },
        normalMap: {
            type: "t",
            value: normalMap
        },
        normalScale: {
            type: "f",
            value: 1.0,
            min: 0.0,
            max: 1.0
        },
        glossLevel: {
            type: "f",
            value: 0.5,
            min: 0.0,
            max: 5.0
        },
        brightnessFactor: {
            type: "f",
            value: 0.5,
            min: 0.0,
            max: 1.0
        },
        envMap: {
            type: "t",
            value: textureCube
        },
        microflakeNMap: {
            type: "t",
            value: THREE.ImageUtils.loadTexture('SparkleNoiseMap.png')
        },
        flakeColor: {
            type: "c",
            value: new THREE.Color(0xFFFFFF)
        },
        flakeScale: {
            type: "f",
            value: -30.0,
            min: -50.0,
            max: 1.0
        },
        normalPerturbation: {
            type: "f",
            value: 1.0,
            min: -1.0,
            max: 1.0
        },
        microflakePerturbationA: {
            type: "f",
            value: 0.1,
            min: -1.0,
            max: 1.0
        },
        microflakePerturbation: {
            type: "f",
            value: 0.48,
            min: 0.0,
            max: 1.0
        }
        //offsetRepeat : { type: "v4", value: new THREE.Vector4( 0, 0, 1, 1 ) }
    };
 
    uniforms.microflakeNMap.value.wrapS = uniforms.microflakeNMap.value.wrapT = THREE.RepeatWrapping
    var vertexShader = document.getElementById('vertexShader').text;
    var fragmentShader = document.getElementById('fragmentShader').text;
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        derivatives: true
    });
    return material;
}

var mesh;

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth /
        window.innerHeight, 1, 100000);
    camera.position.z = 500;

    scene = new THREE.Scene();

    // Add skybox
    var folder = "studio/"
    var urls = [folder + "right.png", folder + "left.png",
        folder + "up.png", folder + "down.png",
        folder + "front.png", folder + "back.png"
    ];
    textureCube = THREE.ImageUtils.loadTextureCube(urls);

    // Skybox
    var skyshader = THREE.ShaderLib["cube"];
    skyshader.uniforms["tCube"].value = textureCube;

    var skymaterial = new THREE.ShaderMaterial({
        fragmentShader: skyshader.fragmentShader,
        vertexShader: skyshader.vertexShader,
        uniforms: skyshader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    sky = new THREE.Mesh(new THREE.BoxGeometry(1500, 1500, 1500), skymaterial);
    sky.visible = true;
    scene.add(sky);

    controls = new THREE.TrackballControls(camera, renderer.domElement);

    var material = getMaterial(0xFF0000);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);
    
    var directionalLight = new THREE.DirectionalLight(0x0000ff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    document.body.appendChild(stats.domElement);

    var geometry = new THREE.SphereGeometry(70, 32, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.material = getMaterial(0xFF0000)
    scene.add(mesh);
    
    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
    stats.update();
}

var setMaterial = function(which, e){
    var mmap = {
        orange: 0xFF0000,
        blue: 0x0000FF,
        black: 0x000000
    }
    mesh.material = getMaterial(mmap[which])
    document.querySelectorAll('.mat').forEach(function(el){
        el.className = el.className.replace('active','')
    })
    e.target.className = 'mat active '+which;
};