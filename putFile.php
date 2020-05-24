<? 




$list = 'export.js
mouseClick.js
moveCamera.js
obj.js
script.js
';

$arrF = array();
$arr = explode(".js", $list);
$file2 = '';

for ($i = 0; $i < count($arr); $i++)
{
	$arr[$i] = trim($arr[$i]).'.js';
}


// Записываем в файл $text
for ($i = 0; $i < count($arr)-1; $i++)
{
	echo $arr[$i].'<br>';
	$file = file_get_contents($arr[$i]);
	
	$file = preg_replace("|console.log\((.*)\);|i","",$file);
	$file2 .= $file;
	
	preg_match_all('|function\s*(\w+)\s*\((.*)\)|Usi', $file, $arr2); 
	
	for ($i2 = 0; $i2 < count($arr2[1]); $i2++)
	{
		$arrF[] = $arr2[1][$i2];
	}
	
}


echo '<br><br>';
echo 'Файл до сжатия ' . strlen($file2) . ' байт <br><br>--------<br><br>';


$file2 = preg_replace('#(\/\/(.*?)(\n|$|\r|(\r\n)))|(\/\*(.*?)\*\/)#i','',$file2);	// удаляем комменты



echo 'Сжатый файл ' . strlen($file2) . ' байт <br><br>--------<br><br>';




$newFile = fopen('t/test.js', 'w');
fwrite($newFile, $file2);
fclose($newFile);








