<?php
$filedata = file_get_contents('http://localhost/itCareer/project1/db/countryBorders.geo.json');
$details = json_decode($filedata, true);

foreach ($details["features"] as $v) {

if ($v["properties"]["iso_a2"] == $_REQUEST['isoA2']) {
    echo json_encode($v);
}  
}
?>