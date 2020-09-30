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

    //Initialization and pulling initial data
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

    //Button Functionality
        //Search button in the top menu
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

        //Clear stored entries in the top menu
    $("#clearBtn").click(function(){
        $("#prevSearch").empty();
        localStorage.clear();
        locHistory = 0;
        histSearch = {};
    });

        //Click event for the buttons of stored search items
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

    //This pulls in the Date
    $("#cardDate").text(moment().format("dddd, MMMM Do YYYY"));

    //Functions for page construction and data handling
        //This builds the query for the current weather
    function buildQuery() {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
        queryParams["appid"] = "33a9e9a3d35d99cb12be3090a81d6df0";
        return queryURL + $.param(queryParams);
    }

        //This will populate the page with the data from a stored item
    function searched(WeatherData) {
        weatherInfo = WeatherData;
        updateCurrent();
        var currentCity = WeatherData.name;
        var cityCheck = $("button:contains('"+currentCity+"')");
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
    }

        //This clears the serach form after submitting a search
    function clear() {
        $("#search-Form").val("");
    }

        //This will request and update the UV index data
    function updateUVI() {
        var uvqueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat="+weatherInfo.coord.lat+"&lon="+weatherInfo.coord.lon+"&appid=33a9e9a3d35d99cb12be3090a81d6df0";
        $.ajax({
            url: uvqueryURL,
            method: "GET"
        }).then(function(response){
            uvIndex = response.value;
            return uvIndex;
        });
    }
    
        //This will request and update the weather forecast
    function updateForecast() {
        var uFqueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+weatherInfo.coord.lat+"&lon="+weatherInfo.coord.lon+"&exclude=current,minutely,hourly,alerts&cnt=5&appid=33a9e9a3d35d99cb12be3090a81d6df0";
        $.ajax({
            url: uFqueryURL,
            method: "GET"
        }).then(function(response){
            $("#fiveDay").empty();
            for (i=1; i < 6; i++) {
                var foreDate = moment().add(i, 'days').format("dddd, MMMM Do YYYY");
                $("#fiveDay").append("<div class='col-12 text-left mb-1 my-auto forecast'>"+foreDate+"<img src='https://openweathermap.org/img/wn/"+response.daily[i].weather[0].icon+".png'>Temperature: "+Math.round((((response.daily[i].temp.day-273.15)*1.8)+32))+"F Humidity: "+response.daily[i].humidity+"% </div>");
            }
        });
    }
        //This will pull the results of updateUVI() and updateForecast(), then it updates the main view and the charts
    function updateCurrent() {
        updateUVI();
        updateForecast();
        setTimeout(function() {
            $("#cardStatus").attr("src","https://openweathermap.org/img/wn/"+weatherInfo.weather[0].icon+"@2x.png");
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
        //This was created as part of the page initialization
    function updateFirstRun(WeatherData) {
        weatherInfo = WeatherData;
        updateUVI();
        updateForecast();
        setTimeout(function() {
            $("#cardStatus").attr("src","https://openweathermap.org/img/wn/"+weatherInfo.weather[0].icon+"@2x.png");
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

        //This is a support function to remove data from the charts
    function removeData(chart) {
        chart.data.labels.pop();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
        chart.update();
    }

        //This is a support function to add data to the charts
    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
    

    //This section is for managing the chart options
    var bar_ctx = document.getElementById('uvChart').getContext('2d');
    var background_1 = bar_ctx.createLinearGradient(0, 0, 0, 95);
    background_1.addColorStop(0, 'rgba(217, 83, 79, 0.95)');
    background_1.addColorStop(1, 'rgba(255, 186, 21, 0.7)');

        //Humidity Chart Parameters
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


        //Wind Speed Chart Parameters
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

        //UV index chart parameters
    var uvChart = new Chart(ctu, {    type: 'bar',
        data: {
            labels: ['UV INDEX'+' '+uvIndex],
            datasets: [{
                backgroundColor: background_1,
                data: [uvIndex],
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