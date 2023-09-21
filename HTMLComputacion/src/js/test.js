
var scene = null,
camara = null,
renderizador = null;

function constructor(){
    escena = new THREE.Scene();
    camara = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000);

    renderizador = new THREE.WebGLRenderer({canvas: document.getElementById("app")});
    renderizador.setSize( window.innerWidth, window.innerHeight);
    document.body.appendChild(renderizador.domElement);
    
    var cubo = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color:0x00ff00}));
    escena.add(cubo);
    camara.position.z = 5;
    animate();
}

function animate() {
    renderizador.render(escena, camara);
}
