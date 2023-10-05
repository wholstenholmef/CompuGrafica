/*  Author(s): Samuel Rendon Rodriguez
    Date of creation: 24/8/2023 9:41
    Date of last modification: 24/8/2023 ?:??
*/

var scene = null,
    camera = null, 
    renderer = null,
    SPEED = 0.01,
    cube = null,
    controls = null,
    light = null,
    builds = 0;
    
const size = 10;
const divisions = 10;

function createThreejs(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00FF);
    camera = new THREE.PerspectiveCamera( 75, //Field of view
                                          window.innerWidth / window.innerHeight, //Aspect ratio 16:9
                                          0.1, //Near
                                          1000 ); //Far
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById("app")});
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0,0,10);
    controls.update();

    //Grid helpers
    const gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );

    //Axes helpers
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    //Callers
    //CreateGeometry();
    createLights("AmbientLight");
    loadOBJMTL("../models/OBJ_MTL/", "knight.mtl", "knight.obj");
    createPlayerCollision();
    //loadGLTF();
    createCollectible();
    animate();
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function loadOBJMTL(path, nameMTL, nameOBJ){
    //Load MTL (Textura)
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(path);
    mtlLoader.setPath(path);
    mtlLoader.load(nameMTL, function(material){
        material.preload();
        //Load OBJ (Mesh)
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath(path)
        objLoader.setMaterials(material);
        objLoader.load(nameOBJ, function(OBJ) {
            scene.add(OBJ);
    })
});
}

function loadGLTF(){
    // Instantiate a loader
    const loader = new THREE.GLTFLoader();
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( "../models/GLTF/" );
    // dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    loader.load(
        // resource URL
        '../models/GLTF/Duck.gltf',
        // called when the resource is loaded
        function ( gltf ) {

            scene.add( gltf.scene );

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}

function createCollectible(){
    var min = -15;
    var max = 15;
    for(var i=1; i<5; i++){
        const geometry = new THREE.SphereGeometry( 1, 16, 10 ); 
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
        const sphere = new THREE.Mesh( geometry, material ); 
        scene.add( sphere );
        sphere.position.set(Math.floor(Math.random() * (max - min +1) + min)
                                       ,1
                                       ,Math.random() * (max - min +1) + min)
    }
}

function gameState(Case){
    switch(Case){
        case "game":
            break;
        case "win":
            break;
        case "lose":
            document.getElementById("loseScreen").style.display = "block";
    }
}

function createPlayerCollision(){
    const geometry = new THREE.BoxGeometry( 1, 3, 1 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} ); 
    const cube = new THREE.Mesh( geometry, material ); 
    cube.position.y = 1.5
    scene.add( cube );
}


/*function CreateGeometry(floors) {
    let floorNumbers = document.getElementById("Floors").value;
    let floorColor = document.getElementById("colorpicker").value;
    for(var i=0; i<floorNumbers; i++ ){
        const geometry = new THREE.CubeGeometry(2, 1.5, 2);
        const material = new THREE.MeshBasicMaterial( {color : floorColor,
                                                       opacity: 0.5,
                                                       transparent: true});
        //material.color.setHex( floorColor );
        cube = new THREE.Mesh( geometry, material );
      

        //Outline Shader
        var geo = new THREE.EdgesGeometry( cube.geometry );
        var mat = new THREE.LineBasicMaterial( { color: 0x000000 } );
        var wireframe = new THREE.LineSegments( geo, mat );

        cube.add(wireframe);
        scene.add(cube);
        cube.position.y = (1.5) * (i+0.5);
        cube.position.x = builds * 2.5
    }
    builds += 1;
    camera.position.z = 5;
}*/

function createLights(typeLights){
    //PointLight, SpotLight, AmbientLight
    switch(typeLights){
        case "PointLight":
            light = new THREE.PointLight( 0xff0000, 1, 100 );
            light.position.set( 50, 50, 50 );
            scene.add( light );
            break;
        case "AmbientLight":
            light = new THREE.AmbientLight( 0x404040 ); // soft white light
            scene.add( light );
            break;
        case "SpotLight":
            light = new THREE.SpotLight( 0xffffff );
            light.position.set( 0, 1000, -200 );
            light.castShadow = true;
            scene.add( light );
            break;
    }

}

function animate() {
	requestAnimationFrame( animate );
    // rotateCube();
	renderer.render( scene, camera );
}

function rotateCube() {
    cube.rotation.x -= SPEED * 2;
    cube.rotation.y -= SPEED;
    cube.rotation.z -= SPEED * 3;
}