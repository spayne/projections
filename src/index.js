var THREE=require('three');

import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { BufferGeometry } from 'three';


var sceneGL = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 
window.innerWidth / window.innerHeight, 
0.1, 1000 );

var sceneCSS = new THREE.Scene();
var rendererCSS = new CSS3DRenderer();
rendererCSS.setSize( window.innerWidth, window.innerHeight );
rendererCSS.domElement.style.position = 'absolute';
rendererCSS.domElement.style.top = 0;

var rendererGL = new THREE.WebGLRenderer({ antialias: true, alpha:true });
rendererGL.setSize( window.innerWidth, window.innerHeight );
rendererGL.domElement.style.position = 'absolute';
rendererGL.domElement.style.zIndex = -1;
rendererGL.domElement.style.top = 0;

// ref: https://stackoverflow.com/questions/24681170/three-js-properly-blending-css3d-and-webgl
//rendererCSS.domElement.appendChild( rendererGL.domElement );
var container = document.getElementById( 'container' );
container.appendChild( rendererGL.domElement );
container.appendChild( rendererCSS.domElement );


var geometry = new THREE.RingBufferGeometry( 0.9, 1, 62 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
sceneGL.add( cube );


var grid_size = 4;
var grid_divisions = 4;
var grid_color_center_line = new THREE.Color( 0xff0000 );
var grid_color = new THREE.Color( 0x666666 );
var gridHelper = new THREE.GridHelper( 
    grid_size, grid_divisions,
    grid_color_center_line,
    grid_color);

sceneGL.add( gridHelper );
gridHelper.rotateX(Math.PI / 2);


// Add axis labels as CSS3DObjects into sceneCSS
for (var i = 0; i < 8; i++) {

    var yoffset = -0.2;
    var xoffset = -0.2;
    var xpos = [-2, -1, 1, 2, xoffset, xoffset, xoffset, xoffset]
    var ypos = [yoffset, yoffset, yoffset, yoffset,-2, -1, 1, 2];
    var zpos = [0, 0, 0, 0, 0, 0, 0, 0];
    var text = ["-2", "-1" ,"1","2", "-2i", "-i", "i", "2i"];

    var element = document.createElement('div');
    element.setAttribute("class", "AxisLabel");
    var content = document.createTextNode(text[i]);
    element.appendChild(content);
    
    var object = new CSS3DObject(element);
    object.position.x = xpos[i];
    object.position.y = ypos[i];
    object.position.z = zpos[i];
    object.scale.x = 0.1;
    object.scale.y = 0.1;
    sceneCSS.add(object);
}

var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

var size = 1;
var vertices = [
    -1, 0, 0,	0, 1, 0,
    -1, 0, 0,	1, 0, 0,
    -1, 0, 0,	0, -1, 0
];

var colors = [
    1, 0, 0,	1, 0.6, 0,
    0, 1, 0,	0.6, 1, 0,
    0, 0, 1,	0, 0.6, 1
];

var geometry=new BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
var line = new THREE.Line( geometry, material );
sceneGL.add(line);




var rotx = 0.2;

var button = document.getElementById( '2d' );
button.addEventListener( 'click', function () {
 transform( targets.sphere, 2000 );
}, false );



camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );
    //cube.rotateX(rotx);
    
    rendererGL.render( sceneGL, camera );
    rendererCSS.render( sceneCSS, camera );
}
animate();

