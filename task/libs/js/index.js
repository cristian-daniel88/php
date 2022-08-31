$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});


let existSpan = true;


$('#submitCountryCode').click(function() {

  let countryCodeArray = $('#countryCode').val().split('%');

  $.ajax({
    url: "libs/php/getCountryCode.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: Number(countryCodeArray[0]),
      lng: Number(countryCodeArray[1])
    },
    success: function(result) {

      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {

        $('#txtCountryCode').html("1. Country code for " + countryCodeArray[2] + ': ' + result['data'][0]['countryCode']);

        if(existSpan) {
          $('#countryName').html("cola");
          existSpan = false

        }


        
      

      }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
    }
  }); 

});


$('#submitCountryTime').click(function() {

  let countryTimeArray = $('#countryTime').val().split('%');

  $.ajax({
    url: "libs/php/getCountryTime.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: Number(countryTimeArray[0]),
      lng: Number(countryTimeArray[1])
    },
    success: function(result) {

      console.log(JSON.stringify(result['data']));

      if (result.status.name == "ok") {

        $('#txtCountryTime').html("2. Time in " + countryTimeArray[2] + ': ' + result['data']);

      

      }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
    }
  }); 

});


$('#submitCountryPopulation').click(function() {

  let countryPopulationArray = $('#countryPopulation').val().split('%');

  $.ajax({
    url: "libs/php/getCountryPopulation.php",
    type: 'POST',
    dataType: 'json',
    data: {
      country: countryPopulationArray[0]
    },
    success: function(result) {

      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {

        $('#txtCountryPopulation').html("3. Population in " + countryPopulationArray[1] + ': ' + result['data'][0]['population']);

        if(existSpan) {
          $('#txtCountryTime').html("");
          existSpan = false

        }

        
      

      }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
    }
  }); 

});

