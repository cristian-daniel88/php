$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});



var map;
var markers;
var geojson;

let selectTag = document.getElementById("selectCountry");
let dailyWeather = document.getElementById("dailyWeather");
let wikipedia = document.getElementById("wikipedia");
let news = document.getElementById("news");

//asciiName

//----------- Extra Markers------------//

 var cityMarker = L.ExtraMarkers.icon({
 icon: 'fa-city',
 markerColor: 'blue',
 shape: 'square',
 prefix: 'fa'
  });
                    
 var mountainMarker = L.ExtraMarkers.icon({
 icon: 'fa-mountain',
 markerColor: 'red',
 shape: 'square',
 prefix: 'fa'
  });
  
 var streamMarker = L.ExtraMarkers.icon({
 icon: 'fa-water',
 markerColor: 'cyan',
 shape: 'square',
 prefix: 'fa'
  });
  
 var spotMarker = L.ExtraMarkers.icon({
 icon: 'fa-building',
 markerColor: 'orange',
 shape: 'square',
 prefix: 'fa'
  });
  
 var parkMarker = L.ExtraMarkers.icon({
 icon: 'fa-tree',
 markerColor: 'green',
 shape: 'square',
 prefix: 'fa'
  });
  
 var countryMarker = L.ExtraMarkers.icon({
 icon: 'fa-flag',
 markerColor: 'orange-dark',
 shape: 'square',
 prefix: 'fa'
  });

 var airportMarker = L.ExtraMarkers.icon({
 icon: 'fa-plane',
 markerColor: 'blue',
 shape: 'square',
 prefix: 'fa'
    });
  

//---------------------------------------------------//

// markerCluster
var myIcon2 = L.icon({
  iconUrl: "assets/location48.png",
  iconSize: [40, 40],
});

function getLocation() {
  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

   //-------------------------  SETTING MAP --------------------------------------------------------------------//

    
    var cities = L.layerGroup([]);

    var osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }
    );

    var streets = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
  });

    map = L.map("map", {
      center: [latitude, longitude],
      zoom: 12,
      layers: [osm],
    });

    var baseMaps = {
      "&nbsp; &nbsp; &nbsp; <div>Default</div>":
        osm,
      "&nbsp; &nbsp; &nbsp; <div>Satellite</div>":
        streets,
    };


    var layerControl = L.control.layers(baseMaps).addTo(map);
                
                              

    // ---------------Get Info for Location ---------------------------------------------------------

    let latLongArray = [];
    latLongArray.push(latitude);
    latLongArray.push("%2C");
    latLongArray.push(longitude);
    let joinArray = latLongArray.join("");
    let isoA2Location;
    let currencyLocation;
    let countryLocation;
    let countryLocationWithCapital;

    // opencage
    $.ajax({
      url: "libs/php/openCage.php",
      type: "POST",
      dataType: "json",
      data: {
        q: joinArray,
      },
      success: function (result) {
        countryLocation = result.data[0].components.country
          .toLowerCase()
          .split(" ")
          .join("");
        countryLocationWithCapital = result.data[0].components.country;
        currencyLocation = result.data[0].annotations.currency["iso_code"];
        isoA2Location = result.data[0].components["ISO_3166-1_alpha-2"];
        $("#countryName").html(
          `Country: ${result.data[0].components.country}  &nbsp; <img src="https://countryflagsapi.com/png/${isoA2Location}" widht=20px height=20px>`
        );

        // Call searchJson 
        $.ajax({
          url:'libs/php/search.php',
          type:'POST',
          dataType:"json",
          data: {
            country: isoA2Location
          },
          success: function (result) {
              
            if (markers) {
              map.removeLayer(markers);
            }

            markers = L.markerClusterGroup();
           
            for (var i = 0; i < result.data.length; i++) {
              
              if (result.data[i]['fclName'].split(',')[0] == 'parks') {
                var marker = L.marker([result.data[i].lat, result.data[i].lng], {icon: parkMarker , title: result.data[i].toponymName});       
              }
              if (result.data[i]['fclName'].split(',')[0] == 'city') {
                var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: cityMarker , title: result.data[i].toponymName});
              }
              if (result.data[i]['fclName'].split(',')[0] == 'country') {  
                var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: countryMarker , title: result.data[i].toponymName});      
              }
              if (result.data[i]['fclName'].split(',')[0] == 'mountain') {
                var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: mountainMarker , title: result.data[i].toponymName}); 
              }
              if (result.data[i]['fclName'].split(',')[0] == 'stream') {
                var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: streamMarker , title: result.data[i].toponymName});  
              }
              if (result.data[i]['fclName'].split(',')[0] == 'spot') {
                var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: spotMarker , title: result.data[i].toponymName});
              }  
              if(result.data[i]['asciiName'].split(' ')[result.data[i]['asciiName'].split(' ').length - 1] == 'Airport' || result.data[i]['asciiName'].split(' ')[result.data[i]['asciiName'].split(' ').length - 1] == 'Aerodrome') {
                var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: airportMarker , title: result.data[i].toponymName});   
              }   
              
              marker.bindPopup(result.data[i].toponymName);
              markers.addLayer(marker);
              }

              map.addLayer(markers); 

          }
        })

        // call geonamesCountryInfo
        $.ajax({
          url: "libs/php/geonamesCountryInfo.php",
          type: "POST",
          dataType: "json",
          data: {
            country: isoA2Location,
          },
          success: function (result) {
            let idGeoname = result.data[0].geonameId;
            

            $.ajax({
              url: "libs/php/geonamesChildren.php",
              type: "POST",
              dataType: "json",
              data: {
                geonameId: idGeoname,
              },
              success: function (result) {
                
             

              }
            })
  

            // Add Select
            $.ajax({
              url: "libs/php/countriesToPrintSelect.php",
              type: "GET",
              dataType: "json",
              success: function (result) {
                result.forEach((element) => {
                  selectTag.innerHTML += `
                  <option value="${element.isoa2}" ${element.isoa2 == isoA2Location && 'selected'}>${element.country}</option>
                 `;
                });
              },
            });

            //geoJson
            $.ajax({
              url: "libs/php/borderCountry.php",
              type: "POST",
              dataType: "json",
              data: {
                isoA2: isoA2Location,
              },
              success: function (result) {
                if (geojson) {
                  geojson.clearLayers();
                }
                let findCountry = result;
                geojson = L.geoJSON(findCountry.geometry);
                geojson.addTo(map);}

              })
          

            $("#capitalCity").html(`Capital: ${result.data[0].capital}`);
            $("#population").html(`Population: ${Number(result.data[0].population).toLocaleString("en-US")}`);

            let countryInfo = result;
            let southWest = [countryInfo.data[0].south, countryInfo.data[0].west];
            let northEast = [countryInfo.data[0].north, countryInfo.data[0].east];
            let bounds = L.latLngBounds(southWest, northEast);
            map.fitBounds(bounds);
          },
        });
        // call openExchangeRates
        $.ajax({
          url: "libs/php/openExchangeRates.php",
          type: "GET",
          dataType: "json",
          data: {
            country: isoA2Location,
          },
          success: function (result) {
            let dateCurrency = new Date(result.timestamp * 1000).getDate();
            let monthCurrency =
              new Date(result.timestamp * 1000).getMonth() + 1;
            let yearCurrency = new Date(result.timestamp * 1000).getFullYear();
            $("#currencyDate").html(
              `${dateCurrency}/${monthCurrency}/${yearCurrency}`
            );
            $("#countryNameC").html(`Country: ${countryLocationWithCapital}`);
            $("#currency").html(`Currency: ${currencyLocation}`);
            $("#exchange").html(
              `Current exchange rate: 1 USD = ${Number(
                result.data[currencyLocation]
              ).toFixed(2)} ${currencyLocation}`
            );
          },
        });

        // call openWeatherMap
        $.ajax({
          url: "libs/php/openWeatherMap.php",
          type: "POST",
          dataType: "json",
          data: {
            lat: latitude,
            lon: longitude,
          },
          success: function (result) {
            let dateCurrent = new Date().getDate();
            let dateWeather = new Date(result.current.dt * 1000).getDate();
            let monthWeather =
              new Date(result.current.dt * 1000).getMonth() + 1;
            let yearWeather = new Date(result.current.dt * 1000).getFullYear();
            $("#dateWeather").html(
              `${dateWeather}/${monthWeather}/${yearWeather}`
            );

            let day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            $("#weatherBox3A").html(
              `<img src="https://openweathermap.org/img/wn/${result.current.weather[0].icon}.png" width="100%" >`
            );
            $("#weatherBox3Bmax").html(
              `${parseInt(result.current.temp - 273)}°`
            );
            $("#weatherBox3C").html(
              `${
                result.current.weather[0].description.charAt(0).toUpperCase() +
                result.current.weather[0].description.slice(1)
              }`
            );

            result.daily.forEach((element) => {
              dailyWeather.innerHTML += `
            <div class="weatherBox4A b${element.weather[0].icon}">
            <div class="weatherBox4A1">
               <div>${
                 new Date(element.dt * 1000).getDate() == dateCurrent
                   ? "Today"
                   : day[new Date(element.dt * 1000).getDay()]
               }</div>
               <img src="https://openweathermap.org/img/wn/${
                 element.weather[0].icon
               }.png" width="30px" height="30px">
            </div>
            <div class="weatherBox4A2">
              <div class="weatherBox4A2B">${parseInt(
                element.temp.max - 273
              )}°</div>
              <div >${parseInt(element.temp.min - 273)}°</div>
            </div>
            </div>    
            `;
            });
          },
        });

        // call wikipedia
        $.ajax({
          url: "libs/php/geonamesWikipedia.php",
          type: "POST",
          dataType: "json",
          data: {
            q: countryLocation,
          },
          success: function (result) {
            $("#countryNameW").html(`Country: ${countryLocationWithCapital}`);
            result.data.forEach((element) => {
              wikipedia.innerHTML += `
              <div>
              <h6>${element.title}</h6>
              ${
                element.thumbnailImg != null
                  ? `<img src="${element.thumbnailImg}" width="160px"> `
                  : ""
              }
              <p>${element.summary != null ? element.summary : ""}</p>
              </div>
              &nbsp; &nbsp; <a href="https://${
                element.wikipediaUrl
              }" target="_blank" class='a'>Link</a>
              <hr>
              `;
            });
          },
        });

        // call covid
        $.ajax({
          url: "libs/php/covid.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
            $("#countryNameCovid").html(
              `Country: ${countryLocationWithCapital}`
            );
            let countryCovid = result.data.find(
              (v) => v.CountryCode == isoA2Location
            );
            let dateCovid = new Date(countryCovid.Date.split("T")).getDate();
            let monthCovid = new Date(countryCovid.Date.split("T")).getMonth();
            let yearCovid = new Date(
              countryCovid.Date.split("T")
            ).getFullYear();
            $("#dateCovid").html(`${dateCovid}/${monthCovid}/${yearCovid}`);

            $("#newCases").html(
              Number(countryCovid.NewConfirmed).toLocaleString("en-US")
            );
            $("#newDeaths").html(
              Number(countryCovid.NewDeaths).toLocaleString("en-US")
            );
            $("#newRecovered").html(
              Number(countryCovid.NewRecovered).toLocaleString("en-US")
            );
            $("#totalCases").html(
              Number(countryCovid.TotalConfirmed).toLocaleString("en-US")
            );
            $("#totalDeaths").html(
              Number(countryCovid.TotalDeaths).toLocaleString("en-US")
            );
            $("#totalRecovered").html(
              Number(countryCovid.TotalRecovered).toLocaleString("en-US")
            );
          },
        });

        // call news
        $.ajax({
          url: "libs/php/news.php",
          type: "POST",
          dataType: "json",
          data: {
            country: isoA2Location,
          },
          success: function (result) {
            $("#countryNameNews").html(
              `Country: ${countryLocationWithCapital}`
            );
            if (result.data.message) {
              news.innerHTML = result.data.message;
              return;
            } else {
              result.data.forEach((element) => {
                news.innerHTML += `
                     <div>
                     <h6>${element.title}</h6>
                     ${
                       element.image_url != null
                         ? `<img src="${element.image_url}" width="160px" alt="&nbsp;Image not found."> `
                         : ""
                     }
                     <p>${
                       element.description != null ? element.description : ""
                     }</p>
                     </div>
                     &nbsp; &nbsp; <a href="${
                       element.link
                     }" target="_blank" class='a'>Link</a>
                     <hr>
                    `;
              });
            }
          },
        });
        

        // first success
      },
    });

    // ------------ Easy Buttons  ------------------------------------------------//
    L.easyButton(
      `<i class="fa-solid fa-circle-info"></i>`,
      function () {
        $(document).ready(function () {
          $("#modalInfo").trigger("click");
        });
      }
    ).addTo(map);

    L.easyButton(
      `<i class="fa-solid fa-circle-dollar-to-slot"></i>`,
      function () {
        $(document).ready(function () {
          $("#modalCurrency").trigger("click");
        });
      }
    ).addTo(map);

    L.easyButton(
      `<i class="fa-solid fa-cloud-sun"></i>`,
      function () {
        $(document).ready(function () {
          $("#modalWeather").trigger("click");
        });
      }
    ).addTo(map);

    L.easyButton(
      `<i class="fa-brands fa-wikipedia-w"></i>`,
      function () {
        $(document).ready(function () {
          $("#modalWikipedia").trigger("click");
        });
      }
    ).addTo(map);

    L.easyButton(
      `<i class="fa-solid fa-virus"></i>`,
      function () {
        $(document).ready(function () {
          $("#modalCovid").trigger("click");
        });
      }
    ).addTo(map);

    L.easyButton(
      `<i class="fa-solid fa-newspaper"></i>`,
      function () {
        $(document).ready(function () {
          $("#modalNews").trigger("click");
        });
      }
    ).addTo(map);

    // ------------------------------------------------------------------------------------------------------
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  navigator.geolocation.getCurrentPosition(success, error);
}

getLocation();

//--------------------------EVENT----------------------------------------//

selectTag.addEventListener("change", (e) => {
  if (e.target.value == "undefined") {
    return;
  }

  // Call countryBorders.geo.json
  $.ajax({
    url: "libs/php/borderCountry.php",
    type: "POST",
    dataType: "json",
    data: {
      isoA2: e.target.value,
    },
    success: function (result) {
      if (geojson) {
        geojson.clearLayers();
      }

      let findCountry = result;

      geojson = L.geoJSON(findCountry.geometry);
      geojson.addTo(map);

      // call news
      $.ajax({
        url: "libs/php/news.php",
        type: "POST",
        dataType: "json",
        data: {
          country: findCountry.properties["iso_a2"],
        },
        success: function (result) {
          $("#countryNameNews").html(`Country: ${findCountry.properties.name}`);
          news.innerHTML = "";
          if (result.data.message) {
            news.innerHTML = result.data.message;
            return;
          } else {
            result.data.forEach((element) => {
              news.innerHTML += `
               <div>
               <h6>${element.title}</h6>
               ${
                 element.image_url != null
                   ? `<img src="${element.image_url}" width="160px" alt="&nbsp;Image not found."> `
                   : ""
               }
               <p>${element.description != null ? element.description : ""}</p>
               </div>
               &nbsp; &nbsp; <a href="${
                 element.link
               }" target="_blank" class='a'>Link</a>
               <hr>
              `;
            });
          }
        },
      });

      // Call Covid
      $.ajax({
        url: "libs/php/covid.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
          $("#countryNameCovid").html(
            `Country: ${findCountry.properties.name}`
          );
          let countryCovid = result.data.find(
            (v) => v.CountryCode == e.target.value
          );

          let dateCovid = new Date(countryCovid.Date.split("T")).getDate();
          let monthCovid = new Date(countryCovid.Date.split("T")).getMonth();
          let yearCovid = new Date(countryCovid.Date.split("T")).getFullYear();
          $("#dateCovid").html(`${dateCovid}/${monthCovid}/${yearCovid}`);

          $("#newCases").html(
            Number(countryCovid.NewConfirmed).toLocaleString("en-US")
          );
          $("#newDeaths").html(
            Number(countryCovid.NewDeaths).toLocaleString("en-US")
          );
          $("#newRecovered").html(
            Number(countryCovid.NewRecovered).toLocaleString("en-US")
          );
          $("#totalCases").html(
            Number(countryCovid.TotalConfirmed).toLocaleString("en-US")
          );
          $("#totalDeaths").html(
            Number(countryCovid.TotalDeaths).toLocaleString("en-US")
          );
          $("#totalRecovered").html(
            Number(countryCovid.TotalRecovered).toLocaleString("en-US")
          );
        },
      });

      // Call Wikipedia
      $.ajax({
        url: "libs/php/geonamesWikipedia.php",
        type: "POST",
        dataType: "json",
        data: {
          q: findCountry.properties.name.toLowerCase().split(" ").join(""),
        },
        success: function (result) {
          $("#countryNameW").html(`Country: ${findCountry.properties.name}`);
          wikipedia.innerHTML = "";
          result.data.forEach((element) => {
            wikipedia.innerHTML += `
        <div>
        <h6>${element.title}</h6>
        ${
          element.thumbnailImg != null
            ? `<img src="${element.thumbnailImg}" width="160px"> `
            : ""
        }
        <p>${element.summary != null ? element.summary : ""}</p>
        </div>
        &nbsp; &nbsp; <a href="https://${
          element.wikipediaUrl
        }" target="_blank" class='a'>Link</a>
        <hr>
        `;
          });
        },
      });

      
           // Call searchJson 
           $.ajax({
            url:'libs/php/search.php',
            type:'POST',
            dataType:"json",
            data: {
              country: findCountry.properties['iso_a2']
            },
            success: function (result) {
              if (markers) {
                map.removeLayer(markers);
              }
  
              markers = L.markerClusterGroup();
             
              for (var i = 0; i < result.data.length; i++) {
                
                if (result.data[i]['fclName'].split(',')[0] == 'parks') {
                  var marker = L.marker([result.data[i].lat, result.data[i].lng], {icon: parkMarker , title: result.data[i].toponymName});       
                }
                if (result.data[i]['fclName'].split(',')[0] == 'city') {
                  var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: cityMarker , title: result.data[i].toponymName});
                }
                if (result.data[i]['fclName'].split(',')[0] == 'country') {  
                  var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: countryMarker , title: result.data[i].toponymName});      
                }
                if (result.data[i]['fclName'].split(',')[0] == 'mountain') {
                  var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: mountainMarker , title: result.data[i].toponymName}); 
                }
                if (result.data[i]['fclName'].split(',')[0] == 'stream') {
                  var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: streamMarker , title: result.data[i].toponymName});  
                }

                if (result.data[i]['fclName'].split(',')[0] == 'spot') {
                  var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: spotMarker , title: result.data[i].toponymName});  
                }
                
                if(result.data[i]['asciiName'].split(' ')[result.data[i]['asciiName'].split(' ').length - 1] == 'Airport' || result.data[i]['asciiName'].split(' ')[result.data[i]['asciiName'].split(' ').length - 1] == 'Aerodrome') {
                  var marker =  L.marker([result.data[i].lat, result.data[i].lng], {icon: airportMarker , title: result.data[i].toponymName});
                }   
                
                marker.bindPopup(result.data[i].toponymName);
                markers.addLayer(marker);
                }
  
                map.addLayer(markers); 
  
            }
          })
  

      // Call geoNamesCountryInfo
      $.ajax({
        url: "libs/php/geonamesCountryInfo.php",
        type: "POST",
        dataType: "json",
        data: {
          country: findCountry.properties.iso_a2,
        },
        success: function (result) {
          let countryInfo = result;
          let southWest = [countryInfo.data[0].south, countryInfo.data[0].west];
          let northEast = [countryInfo.data[0].north, countryInfo.data[0].east];
          let bounds = L.latLngBounds(southWest, northEast);
          map.fitBounds(bounds);

          $("#countryName").html(
            `Country: ${result.data[0].countryName}  &nbsp; <img src="https://countryflagsapi.com/png/${findCountry.properties["iso_a2"]}" widht=20px height=20px>`
          );
          $("#capitalCity").html(`Capital: ${result.data[0].capital}`);
          $("#population").html(
            `Population: ${Number(result.data[0].population).toLocaleString(
              "en-US"
            )}`
          );

          // call geonamesChildren to print map and weather
          $.ajax({
            url: "libs/php/geonamesChildren.php",
            type: "POST",
            dataType: "json",
            data: {
              geonameId: result.data[0].geonameId,
            },
            success: function (result) {
              let numberRandom = Math.floor(Math.random() * result.data.length);
              let arrayPlaces = result.data[numberRandom];

            

              // Call Weather Api
              $.ajax({
                url: "libs/php/openWeatherMap.php",
                type: "POST",
                dataType: "json",
                data: {
                  lat: arrayPlaces.lat,
                  lon: arrayPlaces.lng,
                },
                success: function (result) {
                  let dateCurrent = new Date().getDate();
                  let dateWeather = new Date(
                    result.current.dt * 1000
                  ).getDate();
                  let monthWeather =
                    new Date(result.current.dt * 1000).getMonth() + 1;
                  let yearWeather = new Date(
                    result.current.dt * 1000
                  ).getFullYear();
                  $("#dateWeather").html(
                    `${dateWeather}/${monthWeather}/${yearWeather}`
                  );

                  let day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                  $("#weatherName").html(`${arrayPlaces.adminName1}`);
                  $("#weatherBox3A").html(
                    `<img src="https://openweathermap.org/img/wn/${result.current.weather[0].icon}.png" width="100%" >`
                  );
                  $("#weatherBox3Bmax").html(
                    `${parseInt(result.current.temp - 273)}°`
                  );
                  $("#weatherBox3C").html(
                    `${
                      result.current.weather[0].description
                        .charAt(0)
                        .toUpperCase() +
                      result.current.weather[0].description.slice(1)
                    }`
                  );
                  dailyWeather.innerHTML = "";
                  result.daily.forEach((element) => {
                    dailyWeather.innerHTML += `
              <div class="weatherBox4A b${element.weather[0].icon}">
              <div class="weatherBox4A1">
                 <div>${
                   new Date(element.dt * 1000).getDate() == dateCurrent
                     ? "Today"
                     : day[new Date(element.dt * 1000).getDay()]
                 }</div>
                 <img src="https://openweathermap.org/img/wn/${
                   element.weather[0].icon
                 }.png" width="30px" height="30px">
              </div>
              <div class="weatherBox4A2">
                <div class="weatherBox4A2B">${parseInt(
                  element.temp.max - 273
                )}°</div>
                <div >${parseInt(element.temp.min - 273)}°</div>
              </div>
              </div>    
              `;
                  });
                },
              });
            },
          });

          // Call openExchangeRates.php
          $.ajax({
            url: "libs/php/openExchangeRates.php",
            type: "GET",
            dataType: "json",
            data: {
              country: findCountry.properties["iso_a2"],
            },
            success: function (result) {
              $("#countryNameC").html(
                `Country: ${findCountry.properties.name}`
              );
              $("#currency").html(
                `Currency: ${countryInfo.data[0].currencyCode}`
              );
              $("#exchange").html(
                `Current exchange rate: 1 USD = ${Number(
                  result.data[countryInfo.data[0].currencyCode]
                ).toFixed(2)} ${countryInfo.data[0].currencyCode}`
              );
            },
          });
        },
      });
    },
  });
  
});





















  