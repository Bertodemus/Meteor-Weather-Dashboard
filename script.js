$(document).ready(function() {
    //variable assignments
    var weatherInfo;
    var histSearch = {};
    var histClick = false;
    var histStoredFirst = false;
    var queryParams = {};
    var locHistory = 0;
    var cth = document.getElementById('humidChart');
    var ctw = document.getElementById('windChart');
    var ctu = document.getElementById('uvChart');

    var humidity = 0;
    var windMPH = 0;
    var uvIndex = 0;

    Init();

    function Init() {
        var storedHistSearch = JSON.parse(localStorage.getItem("histSearch"));
        if (storedHistSearch !== null) {
            histSearch = storedHistSearch;
          }

        $.each( histSearch, function( key, value ) {
            $("#prevSearch").prepend(
                "<div class='col-12 mb-1'><button class='btn btn-secondary w-100 stored'>"+value+"</button></div>"
            );
            locHistory++;
            histStoredFirst = true;
          });

          queryParams = { "q": "Richmond"};
          var queryURL = buildQuery();
          $.ajax({
              url: queryURL,
              method: "GET"
            }).then(updateFirstRun);
    }


    $("#searchBtn").click(function(event) {
        event.preventDefault();
        queryParams = { "q": $("#search-Form").val().trim()};
        var queryURL = buildQuery();
        clear();
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(searched);
    });

    $("#clearBtn").click(function(){
        $("#prevSearch").empty();
        localStorage.clear();
        locHistory = 0;
        histSearch = {};
    });

    $("div").off().on("click", "button.stored", function(event){
        histClick = true;
        queryParams = {};
        event.preventDefault();
        queryParams = { "q": $(this).html()};
        var queryURL = buildQuery();
        $("#headCollapse").click();
        clear();
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(searched);
          return false;
    });


// Date
$("#cardDate").text(moment().format("dddd, MMMM Do YYYY"));




    function buildQuery() {
        // queryURL is the url we'll use to query the API
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

        // Begin building an object to contain our API call's query parameters
        // Grab text the user typed into the search input, add to the queryParams object
        // queryParams = { "q": $("#search-Form").val().trim()};
      
        // Set the API key
        queryParams["appid"] = "33a9e9a3d35d99cb12be3090a81d6df0";
      
        // Logging the URL so we have access to it for troubleshooting
        // console.log("---------------\nURL: " + queryURL + "\n---------------");
        // console.log(queryURL + $.param(queryParams));
        // console.log($.param(queryParams));
        return queryURL + $.param(queryParams);
      }



      function searched(WeatherData) {
        // Log the WeatherData to console, where it will show up as an object
        weatherInfo = WeatherData;
        // console.log(weatherInfo);
        // updateUVI();
        updateCurrent();
        // console.log(WeatherData);
        // console.log("------------------------------------");
        var currentCity = WeatherData.name;
        var cityCheck = $("button:contains('"+currentCity+"')")
        console.log(currentCity);
        console.log(histClick);
        console.log($("button").filter(".stored").html());
        console.log($(cityCheck).html());
        console.log(histStoredFirst);


        // console.log($(".stored").filter(currentCity).html());
        // if (!histClick) {
        if (histClick === false && currentCity !== $(cityCheck).html() || histStoredFirst === false) {

            $("#prevSearch").prepend(
                "<div class='col-12 mb-1'><button class='btn btn-secondary w-100 stored'>"+currentCity+"</button></div>"
            );
            histStoredFirst = true;
            histSearch[locHistory] = currentCity;
            localStorage.setItem('histSearch', JSON.stringify(histSearch));
            locHistory++;
        }
        histClick = false;
        console.log("clicked");
        console.log(histClick);
      }


      function searchedHist(WeatherData) {
        // Log the WeatherData to console, where it will show up as an object
        weatherInfo = WeatherData;
        // console.log(weatherInfo);
        updateUVI();
        updateCurrent();
        // console.log(WeatherData);
        // console.log("------------------------------------");
        var currentCity = WeatherData.name;
        // console.log(currentCity);
        if (!histClick) {
            $("#prevSearch").prepend(
                "<div class='col-12 mb-1'><button class='btn btn-secondary w-100 stored'>"+currentCity+"</button></div>"
            );
            histClick = false;
        }
      }



      function clear() {
        $("#search-Form").val("");
      }

      function updateUVI() {
        var uvqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+weatherInfo.coord.lat+"&lon="+weatherInfo.coord.lon+"&appid=33a9e9a3d35d99cb12be3090a81d6df0";
        $.ajax({
            url: uvqueryURL,
            method: "GET"
          }).then(function(response){
            uvIndex = response.value;
            return uvIndex;
          });
      }
    


      function updateCurrent() {
        updateUVI();
        setTimeout(function() {
            $("#cardStatus").attr("src","http://openweathermap.org/img/wn/"+weatherInfo.weather[0].icon+"@2x.png");
            $("#cardCity").html(weatherInfo.name);
            $("#cardTemp").html("Currently: "+Math.round((((weatherInfo.main.temp-273.15)*1.8)+32))+"F");
            $("#cardHilow").html(Math.round((((weatherInfo.main.temp_max-273.15)*1.8)+32))+"F / "+Math.round((((weatherInfo.main.temp_min-273.15)*1.8)+32))+"F");
            humidity = weatherInfo.main.humidity;
            windMPH = Math.round(weatherInfo.wind.speed*2.237);
            removeData(humidChart);
            addData(humidChart, 'HUMIDITY'+' '+humidity+'%', humidity);
            removeData(windChart);
            addData(windChart, 'WIND SPEED'+' '+windMPH+'MPH', windMPH);
            removeData(uvChart);
            addData(uvChart, 'UV INDEX'+' '+uvIndex, uvIndex);
        },500);
      }

      function updateFirstRun(WeatherData) {
        weatherInfo = WeatherData;

        updateUVI();
        setTimeout(function() {
            $("#cardStatus").attr("src","http://openweathermap.org/img/wn/"+weatherInfo.weather[0].icon+"@2x.png");
            $("#cardCity").html(weatherInfo.name);
            $("#cardTemp").html("Currently: "+Math.round((((weatherInfo.main.temp-273.15)*1.8)+32))+"F");
            $("#cardHilow").html(Math.round((((weatherInfo.main.temp_max-273.15)*1.8)+32))+"F / "+Math.round((((weatherInfo.main.temp_min-273.15)*1.8)+32))+"F");
            humidity = weatherInfo.main.humidity;
            windMPH = Math.round(weatherInfo.wind.speed*2.237);
            removeData(humidChart);
            addData(humidChart, 'HUMIDITY'+' '+humidity+'%', humidity);
            removeData(windChart);
            addData(windChart, 'WIND SPEED'+' '+windMPH+'MPH', windMPH);
            removeData(uvChart);
            addData(uvChart, 'UV INDEX'+' '+uvIndex, uvIndex);
        },500);
      }
    

      function removeData(chart) {
        chart.data.labels.pop();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
        chart.update();
    }

    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
    
// Chart shenanigans


    var humidChart = new Chart(cth, {    type: 'bar',
    data: {
        labels: ['HUMIDITY'+' '+humidity+'%'],
        datasets: [{
            data: [humidity],
            backgroundColor: [
                'rgba(152, 210, 240, 0.5)',

            ],
        }]
    },
    options: {
            legend: {
                display: false,
            },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    callback: function(value, index, values) {
                        return value + '%';
                    }
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                }
            }]

        }
    }
});

var windChart = new Chart(ctw, {    type: 'bar',
data: {
    labels: ['WIND SPEED'+' '+windMPH+'MPH'],
    datasets: [{
        data: [windMPH],
        backgroundColor: [
            'rgba(180, 180, 180, 0.5)',

        ],
    }]
},
options: {
        legend: {
            display: false,
        },
    scales: {
        yAxes: [{
            // display: false,
            ticks: {
                beginAtZero: true,
                suggestedMax: 75,
            }
        }],
        xAxes: [{
            gridLines: {
                display: false,
            }
        }]

    }
}
});

var uvChart = new Chart(ctu, {    type: 'bar',
data: {
    labels: ['UV INDEX'+' '+uvIndex],
    datasets: [{
        data: [uvIndex],
        backgroundColor: [
            'rgba(255, 186, 21, 0.5)',

        ],
    }]
},
options: {
        legend: {
            display: false,
        },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                suggestedMax: 11
            }
        }],
        xAxes: [{
            gridLines: {
                display: false,
            }
        }]

    }
}
});

});