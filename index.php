<?php $vrs = '=31' ?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?=$title?></title>
	<meta name="description" content="<?=$description?>" />
	<link rel="stylesheet" href="<?=$path?>css/style.css?<?=$vrs?>">
</head>

<body>
	<script>
		var vr = "<?=$vrs ?>";
		console.log('v'+ vr);		
	</script>
	
			
	
    <script src="<?=$path?>js/three.min.js?<?=$vrs?>"></script>
    <script src="<?=$path?>js/jquery.js"></script>        
	
	<script src="<?=$path?>js/dp/EffectComposer.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/CopyShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/RenderPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/ShaderPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/OutlinePass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/FXAAShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/SAOPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/SAOShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/DepthLimitedBlurShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/UnpackDepthRGBAShader.js?<?=$vrs?>"></script>

	<script src="<?=$path?>js/export/GLTFExporter.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/export/OBJExporter.js?<?=$vrs?>"></script>
	
	
	<div>
		<div class="flex_1">
			<div class="flex_1 align_items">
				<div class="rp_label_plane">
					длина
				</div>
			</div>
			<div class="flex_1 align_items" style="width: auto;">
				<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-x" value="0">
			</div>
		</div>
		
		<div class="flex_1">
			<div class="flex_1 align_items">
				<div class="rp_label_plane">
					ширина
				</div>
			</div>
			<div class="flex_1 align_items" style="width: auto;">
				<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-z" value="0">
			</div>
		</div>

		<div class="flex_1">
			<div class="flex_1 align_items">
				<div class="rp_label_plane">
					высота
				</div>
			</div>
			<div class="flex_1 align_items" style="width: auto;">
				<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-y" value="0">
			</div>
		</div>


		<div style="margin: 40px 0 0 40px; width: 300px; border-top: 1px solid #222; border-bottom: 1px solid #222;">
		
			<div style="margin: 20px 0 0 40px; width: 300px; font-family: arial,sans-serif; font-size: 20px; color: #666;">
				Площадь
			</div>
			
			<div class="flex_1" style="margin-top: 30px;">
				<div class="flex_1 align_items">
					<div class="rp_label_plane">
						текстура 1
					</div>
				</div>
				<div class="flex_1 align_items" style="width: auto;" nameId="area_1">
					0
				</div>
			</div>

			<div class="flex_1" style="margin: 30px 0 30px 0;">
				<div class="flex_1 align_items">
					<div class="rp_label_plane">
						текстура 2
					</div>
				</div>
				<div class="flex_1 align_items" style="width: auto;" nameId="area_2">
					0
				</div>
			</div>			
		
		
		</div>
		


		<div class="button1-wrap-1" nameId='exportGLB'>
			<div class="button1 button_gradient_1" style="width: 150px; margin: 40px 0 0 40px;"> 
				экспорт в GLB
			</div>	
		</div>
		
		<div class="button1-wrap-1" nameId='exportOBJ'>
			<div class="button1 button_gradient_1" style="width: 150px; margin: 40px 0 0 40px;"> 
				экспорт в OBJ
			</div>	
		</div>		
					
	</div>

	
	<div id="canvasFrame" style="position: absolute; width: 1000px; height: 800px; top: 0; left: 400px; overflow: hidden; border: 1px solid #222;">
		<div class="frame block_select_text">
				
			<div class="flex_1 height100">
				
				<div style="flex-grow:1; position: relative;">
				
					<div class="flex_1 top_panel_2">	
						
						<div class="toolbar" data-action ='top_panel_1'>		
							<div class="button1-wrap-1" nameId='zoom_camera_butt_m'>
								<div class="button1 button_gradient_1" style="width: 19px;"> 
									-
								</div>	
							</div>
							<div class="button1-wrap-1" nameId='zoom_camera_butt_p'>
								<div class="button1 button_gradient_1" style="width: 19px;"> 
									+
								</div>	
							</div>	
						</div> 	
						
					</div>
					
				</div>
				<div style="position: absolute; left: 50px; bottom: 80px;">
					<div class="button1-wrap-1" nameId='texture_1'>
						<div class="button1 button_gradient_1" style="width: 100px;"> 
							текстура 1
						</div>	
					</div>
					
					<div class="button1-wrap-1" nameId='texture_2' style="margin-top: 20px;">
						<div class="button1 button_gradient_1" style="width: 100px;"> 
							текстура 2
						</div>	
					</div>					
				</div>	
				
			</div>

		</div>
		
	</div>
	
	
	<script src="<?=$path?>mouseClick.js?<?=$vrs?>"></script>
	<script src="<?=$path?>moveCamera.js?<?=$vrs?>"></script>
	<script src="<?=$path?>obj.js?<?=$vrs?>"></script>
	<script src="<?=$path?>export.js?<?=$vrs?>"></script>
    <script src="<?=$path?>script.js?<?=$vrs?>"></script>    		 
		
		


</body>


</html>