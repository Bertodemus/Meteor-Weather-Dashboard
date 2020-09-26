$(document).ready(function() {
    //variable assignments
    var weatherInfo;
    var histClick = false;
    var queryParams = {};
    var cth = document.getElementById('humidChart');
    var ctw = document.getElementById('windChart');
    var ctu = document.getElementById('uvChart');

    var humidity = 0;
    var windMPH = 0;
    var uvIndex = 0;

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
    });

    $("div").off().on("click", "button.stored", function(event){
        histClick = true;
        queryParams = {};
        event.preventDefault();
        queryParams = { "q": $(this).html()};
        var queryURL = buildQuery();
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
        // queryURL is the url we'll use to query the API
        var uvqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+weatherInfo.coord.lat+"&lon="+weatherInfo.coord.lon+"&appid=33a9e9a3d35d99cb12be3090a81d6df0";
        // console.log(uvqueryURL);
        $.ajax({
            url: uvqueryURL,
            method: "GET"
          }).then(function(response){
            uvIndex = response.value;
            // console.log(uvIndex);
            return uvIndex;
          });
        // // Begin building an object to contain our API call's query parameters
        // // Grab text the user typed into the search input, add to the queryParams object
        // var uvqueryParams = { "lat": weatherInfo.coord.lat,"lon": weatherInfo.coord.lon};
      
        // // Set the API key
        // uvqueryParams["appid"] = "33a9e9a3d35d99cb12be3090a81d6df0";
      
        // // Logging the URL so we have access to it for troubleshooting
        // console.log("---------------\nURL: " + uvqueryURL + "\n---------------");
        // console.log(uvqueryURL + $.param(uvqueryParams));
        // console.log($.param(uvqueryParams));
        // return uvqueryURL + $.param(uvqueryParams);
      }
    
      function updateCurrent() {
        updateUVI();
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
    
    // function getWeather() {
        // var searched = $('#search-Form').val();
        // console.log(searched);
        // var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=denver,US-VA&appid=6fe27358cbc7f5171bd1457e1e332dec`;
        // console.log(queryURL);
        // $.ajax({
        //     url: queryURL,
        //     method: "GET"
        // }).then(function(response) {
        //     console.log(response);
            // var result = response.response;
            // console.log(result);
            // for (var i = 0; i < result.docs.length; i++) {
            //     var containerDiv = $('<div>');
            //     var h5El = $('<h5>').text(result.docs[i].headline.main);
            //     var h3El = $('<h3>').text(result.docs[i].byline.original);
            //     containerDiv.append(h5El);
            //     console.log(result.docs[1].headline);
            //     containerDiv.append(h3El);
            //     $('#top-Results').append(containerDiv);
            // };
    //     });
    // }
    
    
    // });










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