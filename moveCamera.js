
var type_browser = detectBrowser();



// первоначальные настройки при страте 
function startPosCamera3D(cdm)
{
	camera3D.position.x = 0;
	camera3D.position.y = cdm.radious * Math.sin( cdm.phi * Math.PI / 360 );
	camera3D.position.z = cdm.radious * Math.cos( cdm.theta * Math.PI / 360 ) * Math.cos( cdm.phi * Math.PI / 360 );			
			
	camera3D.lookAt(new THREE.Vector3( 0, 0, 0 ));
	
	camera3D.userData.camera.save.pos = camera3D.position.clone();
	camera3D.userData.camera.save.radius = infProject.camera.d3.targetO.position.distanceTo(camera3D.position);	
}





// 1. кликаем левой кнопокой мыши (собираем инфу для вращения камеры в 3D режиме)
// 2. кликаем правой кнопокой мыши (собираем инфу для перемещения камеры в 3D режиме и устанавливаем мат.плоскость)
function clickSetCamera3D( event, click )
{
	if ( camera != camera3D ) { return; }

	onMouseDownPosition.x = event.clientX;
	onMouseDownPosition.y = event.clientY;

	if ( click == 'left' )				// 1
	{
		//var dir = camera.getWorldDirection();
		var dir = new THREE.Vector3().subVectors( infProject.camera.d3.targetO.position, camera.position ).normalize();
		
		// получаем угол наклона камеры к target (к точке куда она смотрит)
		var dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; } 			
		
		// получаем угол направления (на плоскости) камеры к target 
		dir.y = 0; 
		dir.normalize();    			
		
		isMouseDown2 = true;
		infProject.camera.d3.theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;
		infProject.camera.d3.phi = dergree;
	}
	else if ( click == 'right' )		// 2
	{
		isMouseDown3 = true;
		planeMath.position.copy( infProject.camera.d3.targetO.position );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();

		var intersects = rayIntersect( event, planeMath, 'one' );	
		camera3D.userData.camera.click.pos = intersects[0].point;  
	}
}







function cameraMove3D( event )
{ 
	if ( camera3D.userData.camera.type == 'fly' )
	{
		if ( isMouseDown2 ) 
		{  
			var radious = infProject.camera.d3.targetO.position.distanceTo( camera.position );
			
			var theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + infProject.camera.d3.theta;
			var phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + infProject.camera.d3.phi;
			var phi = Math.min( 180, Math.max( -60, phi ) );

			camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera.position.add( infProject.camera.d3.targetO.position );  
			camera.lookAt( infProject.camera.d3.targetO.position );			
			
			infProject.camera.d3.targetO.rotation.set( 0, camera.rotation.y, 0 );
		}
		if ( isMouseDown3 )    
		{
			var intersects = rayIntersect( event, planeMath, 'one' );
			var offset = new THREE.Vector3().subVectors( camera3D.userData.camera.click.pos, intersects[0].point );
			camera.position.add( offset );
			infProject.camera.d3.targetO.position.add( offset );
		}
		
	}		
	
}







// cameraZoom
function onDocumentMouseWheel( e )
{
	
	var delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;

	if ( type_browser == 'Chrome' || type_browser == 'Opera' ) { delta = -delta; }

	if(camera == camera3D) 
	{ 
		cameraZoom3D( delta, 1 ); 
	}
	
	renderCamera();
}






function cameraZoomTopLoop() 
{
	var flag = false;
	
	if ( camera == camera3D )
	{
		if ( zoomLoop == 'zoomOut' ) { cameraZoom3D( 0.3, 0.3 ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { cameraZoom3D( -0.3, 0.3 ); flag = true; }
	}
	
	if(flag) { renderCamera(); }
}







function cameraZoom3D( delta, z )
{
	if ( camera != camera3D ) return;

	if(camera3D.userData.camera.type == 'fly')
	{
		var vect = ( delta < 0 ) ? z : -z;

		var pos1 = infProject.camera.d3.targetO.position;
		var pos2 = camera.position.clone();
		
		var dir = new THREE.Vector3().subVectors( pos1, camera.position ).normalize();
		dir = new THREE.Vector3().addScaledVector( dir, vect );
		dir.addScalar( 0.001 );
		var pos3 = new THREE.Vector3().addVectors( camera.position, dir );	


		var qt = quaternionDirection( new THREE.Vector3().subVectors( pos1, camera.position ).normalize() );
		var v1 = localTransformPoint( new THREE.Vector3().subVectors( pos1, pos3 ), qt );


		var offset = new THREE.Vector3().subVectors( pos3, pos2 );
		var pos2 = new THREE.Vector3().addVectors( pos1, offset );

		var centerCam_2 = pos1.clone();
		
		if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam_2.copy( pos2 ); } }
		
		if ( v1.z >= 0.5) 
		{ 
			infProject.camera.d3.targetO.position.copy(centerCam_2);
			camera.position.copy( pos3 ); 	
		}			
	}
}






function detectBrowser()
{
	var ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
	if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
	if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
	if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
	if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
	if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
	if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

	// Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
	if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

	// а может это вообще поисковый робот
	return 'Search Bot';
}


console.log( detectBrowser() );
