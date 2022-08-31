<?php
$filedata = file_get_contents('http://localhost/itCareer/project1/db/countryBorders.geo.json');
$details = json_decode($filedata, true);
$emptyArray = array();

foreach ($details["features"] as $value) {
    $countries = ['country' => $value["properties"]["name"], 'isoa2' => $value["properties"]["iso_a2"]];		
    array_push($emptyArray, $countries);
}
sort($emptyArray);
$JSON = json_encode($emptyArray);
echo($JSON);

?>


