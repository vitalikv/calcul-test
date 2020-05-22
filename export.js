




function exportToGLB()
{
	var arr = [];
	
	arr[0] = infProject.obj;
	
	var options = 
	{
		trs: true,
		onlyVisible: false,
		truncateDrawRange: true,
		binary: true,
		forceIndices: false,
		forcePowerOfTwoTextures: false,
		maxTextureSize: Number( 20000 ) 
	};

	var exporter = new THREE.GLTFExporter();

	// Parse the input and generate the glTF output
	exporter.parse( arr, function ( gltf ) 
	{
		
		var link = document.createElement( 'a' );
		link.style.display = 'none';
		document.body.appendChild( link );			
		
		if ( gltf instanceof ArrayBuffer ) 
		{ 
			console.log( gltf ); 
			link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'application/octet-stream' } ) );
			link.download = 'file.glb';	
		}
		else
		{
			console.log( gltf );
			var gltf = JSON.stringify( gltf, null, 2 );
			
			link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'text/plain' } ) );
			link.download = 'file.gltf';
		}

		link.click();			
		
	}, options );
	
}




function exportToOBJ() 
{

	var exporter = new THREE.OBJExporter();
	var result = exporter.parse( infProject.obj );
	
	var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
	
	var link = document.createElement('a');
	document.body.appendChild(link);
	link.href = csvData;
	link.target = '_blank';
	link.download = 'filename.obj';
	link.click();

}







