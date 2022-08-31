<!DOCTYPE html>
<html>
  <head>  
    <title>Gazetteer</title>
    <meta name="viewport" content="initial-scale=1.0" />
    <meta charset="utf-8" />
    <link rel="apple-touch-icon" sizes="180x180" href="favicon_io/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon_io/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon_io/favicon-16x16.png">
    <link rel="manifest" href="favicon_io/site.webmanifest">

    <!--Leaflet-->
    <link rel="stylesheet" href="libs/leaflet/leaflet.css" />
    <link rel="stylesheet" href="libs/leaflet/MarkerCluster.css" />
    <link rel="stylesheet" href="libs/leaflet/MarkerCluster.Default.css">
    <script src="libs/leaflet/leaflet.js"></script>
    <script src="libs/leaflet/leaflet.markercluster.js"></script>
    <link
    rel="stylesheet"
    href="libs/leaflet/easy-button.css"
    />
    <script src="libs/leaflet/easy-button.js"></script>
    <!--  -->


    

    <!-- Bootstrap -->
    <link rel="stylesheet" href="libs/bootstrap-5.1.3/css/bootstrap.min.css">

    <script src="libs/fontAwesone/fontAwesoneII.js"></script>
    <!--  -->
    
    <!-- Styles -->
    <link rel="stylesheet" href="libs/css/styles.css">
    <!--  -->
  </head>


<body class="bg-dark" id="body">

<div id="preloader"></div>

  
<!-- Modal info -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdropInfo" id="modalInfo"></button>
<div class="modal fade" id="staticBackdropInfo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content bg-light">
      <div class="modal-header">
        <div class="i-container">
        <i class="fa-solid fa-circle-info"></i>
        </div>
        <h3>Information</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p id="countryName">Country name:</p>
        <p id="capitalCity">Capital city:</p>
        <p id="population">Population:</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary modal-botton" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Currency -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdropCurrency" id="modalCurrency"></button>
<div class="modal fade" id="staticBackdropCurrency" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content bg-light">
      <div class="modal-header">
        <div class="i-container">
          <i class="fa-solid fa-circle-dollar-to-slot"></i>
        </div>
        <h3>Currency</h3>
        <button type="button" class="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p id='currencyDate'></p>
        <p id='countryNameC'>Country:</p>
        <p id="currency">Currency:</p>
        <p id="exchange">Current exchange rate:</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary modal-botton" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!--Modal Weather -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdropWeather" id="modalWeather"></button>
<div class="modal fade" id="staticBackdropWeather" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content weatherFather bg-success text-white">
      <div class="modal-header">
        <div class="i-container">
          <i class="fa-solid fa-cloud-sun"></i>
        </div>
        
          <h3>Weather</h3>
        
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body weatherContainer" id="weather">
        

        <div class="weatherBox">
        <div class='titleWeatherContainer'>
          <h4>Today</h4><p id="dateWeather"></p>
        </div>
        <div class="weatherBox2">
         <h5 id="weatherName">Home</h5>
        </div>

         <div class="weatherBox3">
          <div class="weatherBox3A" id="weatherBox3A">
            <img src="https://openweathermap.org/img/wn/10d@2x.png">
          </div>
          <div class="weatherBox3B">
            <div class="weatherBox3Bmax" id="weatherBox3Bmax"></div>
          </div>
          <div class="weatherBox3C">
            <br/>
            <p id="weatherBox3C"></p>
          </div>
         </div>        
          <div class="weatherBox4" id="dailyWeather">
          <!-- <div class="weatherBox4A">
              <div class="weatherBox4A1">
                 <div>Mon</div>
                 <img src="https://openweathermap.org/img/wn/10d@2x.png" width="30px" height="30px">
              </div>
              <div class="weatherBox4A2">
                <div class="weatherBox4A2B"> 20°</div>
                <div class='weatherBox4A2C'>20°</div>
              </div>
          </div>
          -->
         </div>
         </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary modal-botton" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Wikipedia -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdropWikipedia" id="modalWikipedia"></button>
<div class="modal fade wiki" id="staticBackdropWikipedia" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <div class="i-container">
          <i class="fa-brands fa-wikipedia-w"></i>
        </div>
           <h3>Wikipedia</h3>
        <button type="button" class="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="article">
       <p id='countryNameW'></p>
       <article id="wikipedia">

           
       </article>
       
       
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary modal-botton" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Covid -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdropCovid" id="modalCovid"></button>
<div class="modal fade" id="staticBackdropCovid" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <div class="i-container">
        <i class="fa-solid fa-virus"></i>
        </div>
           <h3>Covid</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="article">

       <p id='countryNameCovid'></p>
       <p id='dateCovid'></p>
       <ul class="list-group list-group-flush bg-dark">
         <li class="list-group-item bg-light"><div class='covid'><img src="assets/covid2.png" width='28px' height='28px'></div><div class='covid1'>New Cases</div><div id='newCases'>total</div></li>
         <li class="list-group-item bg-white"><div><img src="assets/luto.png" width='35px' height='28px'></div><div class='covid2'>New Deaths</div><div id="newDeaths">total</div></li>
         <li class="list-group-item bg-light"><div >&nbsp;<img src="assets/corazonSano.png" width='25px' height='25px'></div><div class='covid3'>Newely Recovered</div><div id='newRecovered'>total</div></li>
         <li class="list-group-item bg-white"><div class='covid'><img src="assets/covid2.png" width='28px' height='28px'></div><div class='covid4'>Total Cases</div><div id='totalCases'>total</div></li>
         <li class="list-group-item bg-light"><div><img src="assets/luto.png" width='35px' height='28px'></div><div class='covid5'>Total Deaths</div><div id='totalDeaths'>total</div></li>
         <li class="list-group-item bg-white"><div class='corazon'><img src="assets/corazonSano.png" width='25px' height='25px'></div><div class='covid6'>Total Recovered</div><div id='totalRecovered'>total</div></li>
       </ul>
       
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary modal-botton" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal News -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdropNews" id="modalNews"></button>
<div class="modal fade" id="staticBackdropNews" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <div class="i-container">
          <i class='fa fa-newspaper'></i>
        </div>
           <h3>News</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="article2">
       <p id='countryNameNews'></p>

       <article id='news'>
        

        
       </article>

     
       
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary modal-botton" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>





 
<!-------- MAP -------->
  <div id="map">
    <form class="selectcontainer">
      <select class="form-select " id="selectCountry">
        <!-- <option id="option" selected value="undefined">Select a country</option>  -->
      </select>      
    </form>
  </div>

  <!--Markas  -->
  <link rel="stylesheet" href="dist/css/leaflet.extra-markers.min.css">
  <script src="dist/js/leaflet.extra-markers.min.js"></script>
    

  <!-- scripts --> 
  <script src="libs/bootstrap-5.1.3/js/bootstrap.min.js"></script>
  <script src="libs/js/jquery-2.2.3.min.js"></script>

  <!-- Code -->
  <script src="libs/js/index.js"></script>  


   
  </body>
</html>


























