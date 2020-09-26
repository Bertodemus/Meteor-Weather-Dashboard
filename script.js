$(document).ready(function() {

    $("#submit-Btn").click(function(event) {
        event.preventDefault();
        getArticles();
    });
    
    
    
    
    function getArticles() {
        // var searched = $('#search-Form').val();
        // console.log(searched);
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=denver,US-VA&appid=6fe27358cbc7f5171bd1457e1e332dec`;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
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
        });
    }
    
    
    // });

// Chart shenanigans
    var cth = document.getElementById('humidChart');
    var ctw = document.getElementById('windChart');
    var ctu = document.getElementById('uvChart');

    var humidity = 50;
    var windMPH = 55;
    var uvIndex = 4.2;

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
                suggestedMax: 100,
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