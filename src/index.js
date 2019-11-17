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

var ring_segments = 62*4;
var ring_geometry = new THREE.RingGeometry( 0.9, 1.1, ring_segments );
var ring_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var ring_mesh = new THREE.Mesh( ring_geometry, ring_material );
sceneGL.add( ring_mesh );

const ring_vertex_shader = `
			attribute float size;
			attribute vec3 customColor;
			varying vec3 vColor;
			void main() {
				vColor = customColor;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_PointSize = size * ( 300.0 / -mvPosition.z );
				gl_Position = projectionMatrix * mvPosition;
            }`;

const ring_fragment_shader = `
			uniform vec3 color;
			uniform sampler2D pointTexture;
			varying vec3 vColor;
			void main() {
				gl_FragColor = vec4( color * vColor, 1.0 );
				gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
				if ( gl_FragColor.a < ALPHATEST ) discard;
			}
`;


//
// build ring_points: points on ring using a custom shader
// with programatic/attributes for customColor and size
// 
var PARTICLE_SIZE = 0.5;
var vertices =  ring_geometry.vertices;
console.log("vertices.length" + vertices.length);
var positions = new Float32Array( vertices.length * 3 );
var colors = new Float32Array( vertices.length * 3 );
var sizes = new Float32Array( vertices.length );
var vertex;
var color = new THREE.Color();
for ( var i = 0, l = vertices.length; i < l; i ++ ) {
    vertex = vertices[ i ];
    vertex.toArray( positions, i * 3 );
    color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 );
    color.toArray( colors, i * 3 );
    sizes[ i ] = PARTICLE_SIZE * 0.5;
}


var ring_points_geometry = new THREE.BufferGeometry();

ring_points_geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
ring_points_geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
ring_points_geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
            
var ring_points_material = new THREE.ShaderMaterial( {
    uniforms: {
        color: { value: new THREE.Color( 0xffffff ) },
        pointTexture: { value: new THREE.TextureLoader().load( "three/examples/textures/sprites/disc.png" ) }
    },
    vertexShader: ring_vertex_shader,
    fragmentShader: ring_fragment_shader,
    alphaTest: 0.9
} );

var ring_points = new THREE.Points( ring_points_geometry, ring_points_material );
sceneGL.add( ring_points );


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

//
// draw lines from -1,0,0 to points on the ring
//
var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// d_theta: if theta goes from 0-2pi in 64 steps, dtheta = 2pi/64
var num_steps=24;
var d_theta=(2*Math.PI)/num_steps;
var vertices = [];
for (var i = 0; i < num_steps; i++) {
    var x=Math.cos(d_theta*i);
    var y=Math.sin(d_theta*i);
    vertices.push(-1,0,0,x,y,0);
}
var geometry=new BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
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

