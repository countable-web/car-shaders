var camera, scene, renderer;
var mesh, material, sky;
init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth /
        window.innerHeight, 1, 100000);
    camera.position.z = 500;

    scene = new THREE.Scene();



    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.addEventListener('change', render);

    var normalMap = THREE.ImageUtils.loadTexture('car_normal.png', null, function(something) {
        render();
    });

    var uniforms = {
        paintColor1: {
            type: "c",
            value: new THREE.Color(0xFF0000)
        },
        paintColor2: {
            type: "c",
            value: new THREE.Color(0xFF00FF)
        },
        paintColor3: {
            type: "c",
            value: new THREE.Color(0xFF00FF)
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
            value: 1.0,
            min: 0.0,
            max: 5.0
        },
        brightnessFactor: {
            type: "f",
            value: 0.5,
            min: 0.0,
            max: 1.0
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
 
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    document.body.appendChild(stats.domElement);

    var geometry = new THREE.SphereGeometry(100, 32, 32);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    render();
}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
}

function render() {
    renderer.render(scene, camera);
    stats.update();
}