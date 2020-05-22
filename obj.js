



function createGeometryWall(x, y, z, pr_offsetZ)
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
	//geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	upUvs_4( geometry );
	
	geometry.faces[0].materialIndex = 1;
	geometry.faces[1].materialIndex = 1;	
	geometry.faces[2].materialIndex = 2;
	geometry.faces[3].materialIndex = 2;	
	geometry.faces[4].materialIndex = 3;
	geometry.faces[5].materialIndex = 3;
	geometry.faces[6].materialIndex = 4;
	geometry.faces[7].materialIndex = 4;
	geometry.faces[8].materialIndex = 5;
	geometry.faces[9].materialIndex = 5;

	
	return geometry;
}




function upUvs_4( geometry )
{
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {			
			return Math.abs(faces[i].normal[a]) - Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true; 
}





// устанавливаем значения в input для вкладки план (окно/дверь/толщина стены/высота этажа)
function startObjSizeInput(cdm)
{
	var obj = cdm.obj;
	
	$('[nameId="size-x"]').val(obj.scale.x);
	$('[nameId="size-y"]').val(obj.scale.y);
	$('[nameId="size-z"]').val(obj.scale.z);
}



// меняем ширину/длину/высоту объекта через input
function inputScaleObjPop(cdm)
{
	var obj = cdm.obj;
	
	if(!obj) return; 
	
 	
	obj.geometry.computeBoundingBox();
	var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
	var y = (Math.abs(obj.geometry.boundingBox.max.y) + Math.abs(obj.geometry.boundingBox.min.y));
	var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));
	// поправка на масштаб объекта
	x *= obj.scale.x;
	y *= obj.scale.y;
	z *= obj.scale.z;		


	var x2 = $('[nameId="size-x"]').val();
	var y2 = $('[nameId="size-y"]').val();
	var z2 = $('[nameId="size-z"]').val(); 

	x2 = x2.replace(",", ".");
	y2 = y2.replace(",", ".");
	z2 = z2.replace(",", ".");	
	
	x2 = (!isNumeric(x2)) ? x : Number(x2);
	y2 = (!isNumeric(y2)) ? y : Number(y2);
	z2 = (!isNumeric(z2)) ? z : Number(z2);		

	
	//var limit = obj.userData.obj3D.sizeMinMaxLimit;
	
	if(!limit)
	{		
		var limit = { x_min : 0.01, x_max : 100, y_min : 0.01, y_max : 100, z_min : 0.01, z_max : 100 };				
	}
	
	if(x2 < limit.x_min) { x2 = limit.x_min; }
	else if(x2 > limit.x_max) { x2 = limit.x_max; }
	
	if(y2 < limit.y_min) { y2 = limit.y_min; }
	else if(y2 > limit.y_max) { y2 = limit.y_max; }

	if(z2 < limit.z_min) { z2 = limit.z_min; }
	else if(z2 > limit.z_max) { z2 = limit.z_max; }			
	
	 
	obj.scale.set(x2, y2, z2);	
	obj.updateMatrixWorld();
	
	startObjSizeInput({obj: obj});
	
	getAreaObj(obj);
	
	renderCamera();
}




function isNumeric(n) 
{   
   return !isNaN(parseFloat(n)) && isFinite(n);   
}





function clickObj()
{
	if(!infProject.rayhit) return;
	if(!infProject.texture.activeMat) return;
	
	var id = infProject.rayhit.face.materialIndex;
	
	var obj = infProject.obj;
	
	obj.material[id] = infProject.texture.activeMat.clone();
	
	getAreaObj(obj);
}



function activeTexture(cdm)
{
	var id = cdm.id;
	
	if(infProject.texture.activeElem) infProject.texture.activeElem.style.borderColor = '';
	
	if(infProject.texture.activeMat == infProject.texture.arr[id])
	{
		infProject.texture.activeMat = null;		
	}
	else
	{
		infProject.texture.activeMat = infProject.texture.arr[id];
		infProject.texture.activeElem = cdm.elem.target;
		infProject.texture.activeElem.style.borderColor = '#ff0000';
		infProject.texture.activeMat.userData = {id: id};
	}
	
}




function getAreaObj(obj)
{
	var area_1 = 0;
	var area_2 = 0;
	
	for ( var i = 0; i < obj.geometry.faces.length; i++ ) 
	{	
		var id = obj.geometry.faces[i].materialIndex;
		
		if(obj.material[id].userData.id == undefined) continue
		
		var face = obj.geometry.faces[i]; 
		var va = obj.geometry.vertices[face.a].clone();
		var vb = obj.geometry.vertices[face.b].clone();
		var vc = obj.geometry.vertices[face.c].clone();

		va.x *= obj.scale.x;
		va.y *= obj.scale.y;
		va.z *= obj.scale.z;

		vb.x *= obj.scale.x;
		vb.y *= obj.scale.y;
		vb.z *= obj.scale.z;

		vc.x *= obj.scale.x;
		vc.y *= obj.scale.y;
		vc.z *= obj.scale.z;		

		var t = new THREE.Triangle(va,vb,vc);
		
		if(obj.material[id].userData.id == 1) { area_2 += t.getArea(); }
		else { area_1 += t.getArea(); }
	}
	
	//console.log({area_1: area_1, area_2: area_2});
	
	$('[nameId="area_1"]').text(Math.round(area_1 * 100)/100);
	$('[nameId="area_2"]').text(Math.round(area_2 * 100)/100);
} 







