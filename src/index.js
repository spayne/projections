var THREE=require('three');

import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 
window.innerWidth / window.innerHeight, 
0.1, 1000 );

var rendererCSS = new CSS3DRenderer();
rendererCSS.setSize( window.innerWidth, window.innerHeight );
rendererCSS.domElement.style.position = 'absolute';
rendererCSS.domElement.style.top = 0;
document.getElementById( 'container' ).appendChild( rendererCSS.domElement );

var rendererGL = new THREE.WebGLRenderer({ antialias: true, alpha:true });
rendererGL.setSize( window.innerWidth, window.innerHeight );
rendererGL.domElement.style.position = 'absolute';
rendererGL.domElement.style.zIndex = 1;
rendererGL.domElement.style.top = 0;
document.getElementById( 'container' ).appendChild( rendererGL.domElement );


var geometry = new THREE.RingBufferGeometry( 0.9, 1, 62 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );


var grid_size = 4;
var grid_divisions = 4;
var grid_color_center_line = new THREE.Color( 0xff0000 );
var grid_color = new THREE.Color( 0x666666 );
var gridHelper = new THREE.GridHelper( 
    grid_size, grid_divisions,
    grid_color_center_line,
    grid_color);

scene.add( gridHelper );
gridHelper.rotateX(Math.PI / 2);




var rotx = 0.2;

var button = document.getElementById( '2d' );
button.addEventListener( 'click', function () {
 transform( targets.sphere, 2000 );
}, false );


camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );
    cube.rotateX(rotx);
    rendererCSS.render( scene, camera );
    rendererGL.render( scene, camera );
    
}
animate();

