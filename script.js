
var containerF = document.getElementById( 'canvasFrame' );


var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, preserveDrawingBuffer: true, } );


renderer.outputEncoding = THREE.sRGBEncoding;
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( containerF.clientWidth, containerF.clientHeight );
containerF.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );


var aspect = containerF.clientWidth/containerF.clientHeight;

//----------- camera3D
var camera3D = new THREE.PerspectiveCamera( 65, containerF.clientWidth / containerF.clientHeight, 0.01, 1000 );  
camera3D.rotation.order = 'YZX';		//'ZYX'
camera3D.position.set(5, 7, 5);
camera3D.lookAt(scene.position);
camera3D.rotation.z = 0;
camera3D.userData.camera = { type: 'fly', height: camera3D.position.y, startProject: true };
camera3D.userData.camera.click = { pos: new THREE.Vector3() };
camera3D.userData.camera.save = {}; 
camera3D.userData.camera.save.pos = camera3D.position.clone();
camera3D.userData.camera.save.radius = 0;
//----------- camera3D





var color = [0x7d7d7d, 0x00ff00, 0xff0000, 0x0000ff, 0xe4f249, 0xe449f2]; 	
var m1 = new THREE.MeshPhongMaterial({ color: color[0] });
var m2 = new THREE.MeshPhongMaterial({ color: color[1] });
var m3 = new THREE.MeshPhongMaterial({ color: color[2] });
var m4 = new THREE.MeshPhongMaterial({ color: color[3] });
var m5 = new THREE.MeshPhongMaterial({ color: color[4] });
var m6 = new THREE.MeshPhongMaterial({ color: color[5] });

var materials = [ m1, m2, m3, m4, m5, m6 ];
var cube = new THREE.Mesh( createGeometryWall(1.0, 1.0, 1.0, 0), materials );
scene.add( cube ); 

console.log(cube);


//----------- render
function animate() 
{
	requestAnimationFrame( animate );	

	cameraZoomTopLoop();	
}


function renderCamera()
{
	camera.updateMatrixWorld();	
	composer.render();
}
//----------- render


//----------- onWindowResize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() 
{ 
	var aspect = containerF.clientWidth / containerF.clientHeight;
 
	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();
	
	renderer.setSize(containerF.clientWidth, containerF.clientHeight);
	
	renderCamera();
}
//----------- onWindowResize






var resolutionD_w = window.screen.availWidth;
var resolutionD_h = window.screen.availHeight;
var camera = camera3D;

var infProject = {}; 
infProject.camera = { d3: { theta: 0, phi: 75 } };
infProject.camera.d3.targetO = createCenterCamObj();
infProject.activeInput = '';
infProject.keys = [];
infProject.rayhit = null;
infProject.obj = cube;
infProject.texture = {};
infProject.texture.activeMat = null;
infProject.texture.activeElem = null;
infProject.texture.arr = [];
infProject.texture.arr[0] = new THREE.MeshPhongMaterial({ color: 0xff0000 });
infProject.texture.arr[1] = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

setTexture({material: infProject.texture.arr[0], img: 'img/1.jpg'});
setTexture({material: infProject.texture.arr[1], img: 'img/2.jpg'});

backgroundPlane();
startObjSizeInput({obj: infProject.obj});
startPosCamera3D({radious: 10, theta: 90, phi: 35});		

var zoomLoop = '';
	

console.log(infProject); 
 


var planeMath = createPlaneMath();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
  
  

//----------- Light
{

	var light = new THREE.AmbientLight( 0xffffff, 0.93 );
	scene.add( light );	
}





// outline render
{
	var composer = new THREE.EffectComposer( renderer );
	var renderPass = new THREE.RenderPass( scene, camera3D );
	var outlinePass = new THREE.OutlinePass( new THREE.Vector2( containerF.clientWidth, containerF.clientHeight ), scene, camera3D );	
	
	composer.setSize( containerF.clientWidth, containerF.clientHeight );
	composer.addPass( renderPass );
	composer.addPass( outlinePass );


	if(1==2)
	{
		var saoPass = new THREE.SAOPass(scene, camera, true, true);	
		//saoPass.resolution.set(8192, 8192);
		saoPass['params']['output'] = THREE.SAOPass.OUTPUT.Default;
		saoPass['params']['saoBias'] = 1;
		saoPass['params']['saoIntensity'] = .05;
		saoPass['params']['saoScale'] = 100;
		saoPass['params']['saoKernelRadius'] = 5;
		saoPass['params']['saoMinResolution'] = 0;
		saoPass['params']['saoBlur'] = true;
		saoPass['params']['saoBlurRadius'] = 8;
		saoPass['params']['saoBlurStdDev'] = 4;
		saoPass['params']['saoBlurDepthCutoff'] = .01;
		
		composer.addPass( saoPass );		
	}
	
	//if(infProject.settings.shader.fxaaPass !== undefined)
	if(1 == 1)	
	{
		var fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );	
		fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( containerF.clientWidth * window.devicePixelRatio );
		fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( containerF.clientHeight * window.devicePixelRatio );	
		fxaaPass.enabled = false;
		
		composer.addPass( fxaaPass ); 	
	}	
	
	var ccc = new THREE.Color().setHex( '0x00ff00' );
	outlinePass.visibleEdgeColor.set( ccc );
	outlinePass.hiddenEdgeColor.set( ccc );
	outlinePass.edgeStrength = Number( 5 );		// сила/прочность
	outlinePass.edgeThickness = Number( 0.01 );	// толщина

	outlinePass.selectedObjects = [];


	function outlineAddObj( cdm )
	{	
		if(!cdm) cdm = {};
		
		var arr = cdm.arr;	
		
		outlinePass.selectedObjects = arr;  
	}

	function outlineRemoveObj()
	{
		outlinePass.selectedObjects = [];
	}	
}


function setTexture(cdm)
{
	var img = cdm.img;
	var material = cdm.material;
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		texture.repeat.x = 1;
		texture.repeat.y = 1;			

		
		texture.needsUpdate = true;
		
		material.map = texture; 
		//material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
	});		
}



function backgroundPlane()
{
	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	var material = new THREE.MeshPhongMaterial( {color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 10.0, polygonOffsetUnits: 4.0 } );
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.position.y = -0.02;
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	scene.add( planeMath );	
	
	
	var cdm = {};
	var img = 'img/f1.png';
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		texture.repeat.x = 1000;
		texture.repeat.y = 1000;			

		
		texture.needsUpdate = true;
		
		material.map = texture; 
		//material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});		
	
	return planeMath;
}




function createPlaneMath()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	//var geometry = new THREE.PlaneGeometry( 10, 10 );
	var material = new THREE.MeshPhongMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}


// создаем круг (объект), для обозначения куда смотрит камера в 3D режиме
function createCenterCamObj()
{

	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	var obj = new THREE.Mesh( createGeometryCube(0.07, 0.07, 0.07), material );
	obj.renderOrder = 2;
	obj.visible = false;
	
	scene.add( obj );
	
	
	return obj;
}





function createGeometryCube(x, y, z, cdm)
{
	var geometry = new THREE.Geometry();
	x /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,0,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,0,z),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	

	if(cdm)
	{
		if(cdm.material)
		{
			geometry.faces[0].materialIndex = 1;
			geometry.faces[1].materialIndex = 1;	
			geometry.faces[2].materialIndex = 2;
			geometry.faces[3].materialIndex = 2;	
			geometry.faces[6].materialIndex = 3;
			geometry.faces[7].materialIndex = 3;				
		}
	}
	
	return geometry;
}





function getMousePosition( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	var y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
	
	return new THREE.Vector2(x, y);
}


function getScreenMousePosition( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) );
	var y = ( ( event.clientY - containerF.offsetTop ) );	
	
	return new THREE.Vector2(x, y);
}	
	

function rayIntersect( event, obj, t ) 
{
	mouse = getMousePosition( event );
	
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }
	
	return intersects;
}



//----------- Math			
function localTransformPoint(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


function worldTransformPoint(dir1, dir_local)
{	
	var qt = quaternionDirection(dir1);			
	return dir_local.applyQuaternion( qt );
}


function quaternionDirection(dir1)
{
	var mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}
//----------- Math






animate();
renderCamera();



containerF.addEventListener('contextmenu', function(event) { event.preventDefault() });
containerF.addEventListener( 'mousedown', onDocumentMouseDown, false );
containerF.addEventListener( 'mousemove', onDocumentMouseMove, false );
containerF.addEventListener( 'mouseup', onDocumentMouseUp, false );


containerF.addEventListener( 'touchstart', onDocumentMouseDown, false );
containerF.addEventListener( 'touchmove', onDocumentMouseMove, false );
containerF.addEventListener( 'touchend', onDocumentMouseUp, false );

containerF.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
containerF.addEventListener('mousewheel', onDocumentMouseWheel, false);	


document.addEventListener("keydown", function (e) 
{ 
	
	if(infProject.activeInput) 
	{ 
		if(e.keyCode == 13)
		{ 
			console.log(infProject.activeInput);
			
			if(infProject.activeInput == 'size-x') { inputScaleObjPop({obj: infProject.obj}); }
			if(infProject.activeInput == 'size-y') { inputScaleObjPop({obj: infProject.obj}); }
			if(infProject.activeInput == 'size-z') { inputScaleObjPop({obj: infProject.obj}); }
		}		
		 
		return; 
	}	
	
	if(infProject.keys[18] && e.keyCode == 90) 	// alt + z
	{ 
		
	}	
} );

document.addEventListener("keydown", function (e) 
{ 
	infProject.keys[e.keyCode] = true;
	if(e.keyCode == 61) { zoomLoop = 'zoomIn'; }
	if(e.keyCode == 173) { zoomLoop = 'zoomOut'; }
	if(e.keyCode == 187) { zoomLoop = 'zoomIn'; }
	if(e.keyCode == 189) { zoomLoop = 'zoomOut'; }	
});

document.addEventListener("keyup", function (e) 
{ 
	infProject.keys[e.keyCode] = false;
	zoomLoop = ''; 
});








var docReady = false;

$(document).ready(function () 
{ 
	docReady = true; 	
		 

	$('[data-action="top_panel_1"]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
	$('[ui_1=""]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });	

	$('[nameId="zoom_camera_butt_m"]').mousedown(function () { zoomLoop = 'zoomOut'; });
	$('[nameId="zoom_camera_butt_p"]').mousedown(function () { zoomLoop = 'zoomIn'; });
	$(window).mouseup(function () { zoomLoop = ''; });


	$('input').on('focus', function () { actionInputUI({el: $(this), act: 'down'}); });
	$('input').on('change', function () { actionInputUI({el: $(this), act: 'up'}); });
	$('input').on('keyup', function () {  });
	$('input').blur(function () { infProject.activeInput = ''; });	

	function actionInputUI(cdm)
	{
		var el = cdm.el;
		
		infProject.activeInput = el.attr('nameId');
		
		if(cdm.act == 'down' || cdm.act == 'up')
		{
			console.log(cdm.act, infProject.activeInput);
		}			
	}
	
	
	$('[nameId="texture_1"]').mousedown(function (e) { activeTexture({id: 0, elem: e}); });
	$('[nameId="texture_2"]').mousedown(function (e) { activeTexture({id: 1, elem: e}); });
	
	$('[nameId="exportGLB"]').mousedown(function () { exportToGLB(); });
	$('[nameId="exportOBJ"]').mousedown(function () { exportToOBJ(); });
});











