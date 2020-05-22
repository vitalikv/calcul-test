

var isMouseDown1 = false;
var isMouseRight1 = false;
var isMouseDown2 = false;
var isMouseDown3 = false;
var onMouseDownPosition = new THREE.Vector2();
var long_click = false;
var lastClickTime = 0;
var catchTime = 0.30;
var vk_click = '';





function mouseDownRight()
{

}



function onDocumentMouseDown( event ) 
{
	long_click = false;
	lastClickTime = new Date().getTime();
	
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		vk_click = 'left';
	}	

	switch ( event.button ) 
	{
		case 0: vk_click = 'left'; break;
		case 1: vk_click = 'right'; /*middle*/ break;
		case 2: vk_click = 'right'; break;
	}

	
	clickSetCamera3D( event, vk_click );
	
	infProject.rayhit = null;	
				
	var ray = rayIntersect( event, infProject.obj, 'one' );
	
	if(ray.length > 0) { infProject.rayhit = ray[0]; }	
	
	clickObj();
	
	renderCamera();
}





function onDocumentMouseMove( event ) 
{ 
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		isMouseDown2 = true;
	}
		

	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }

	if ( camera == camera3D ) { cameraMove3D( event ); }

	renderCamera();
}


function onDocumentMouseUp( event )  
{	
	isMouseDown1 = false;
	isMouseRight1 = false;
	isMouseDown2 = false;
	isMouseDown3 = false;
	
	renderCamera();
}





