
var url = "https://ldp5h6ugz3.execute-api.us-east-1.amazonaws.com/dev/get-data";
var chartNames = ['home-kitchen','opo-outside','opo-inside','opo-basement']

// default to showing 24 hours of data
var beginTime = Date.now() - 24*60*60*1000;

var charts = [];

window.onload = function() {
	initAllCharts();
	updateAllCharts();
}

function initAllCharts() {
	chartNames.forEach(function(name) {
		initOneChart(name);
	});
}

function initOneChart(name) {
	var color = Chart.helpers.color;
	var ctx = document.getElementById(name).getContext('2d');
	charts[name] = new Chart(ctx, {
		type : 'line',
		data : {
			datasets : [ {
				label : 'temperature',
				data : [],
				backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
				borderColor: window.chartColors.red,
				fill: false,
			}, {
				label : 'humidity',
				data : [],
				backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
				borderColor: window.chartColors.blue,
				fill: false,
			} ]
		},
		options: {
			title: {
				display: true,
				text: name
			},
			scales: {
				xAxes: [{
					type: 'time',
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Date/Time'
					},
					ticks: {
						major: {
							fontStyle: 'bold',
							fontColor: '#FF0000'
						}
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Temperature F / Humidity %'
					}
				}]
			}
		}
	});
}

document.getElementById('btnAll').addEventListener('click', function() {
	beginTime = 0;
	updateAllCharts();
});

document.getElementById('btn1Year').addEventListener('click', function() {
	beginTime = Date.now() - 365*24*60*60*1000;
	updateAllCharts();
});

document.getElementById('btn1Month').addEventListener('click', function() {
	beginTime = Date.now() - 30*24*60*60*1000;
	updateAllCharts();
});

document.getElementById('btn1Week').addEventListener('click', function() {
	beginTime = Date.now() - 7*24*60*60*1000;
	updateAllCharts();
});

document.getElementById('btn1Day').addEventListener('click', function() {
	beginTime = Date.now() - 24*60*60*1000;
	updateAllCharts();
});

document.getElementById('btn6Hours').addEventListener('click', function() {
	beginTime = Date.now() - 6*60*60*1000;
	updateAllCharts();
});

function updateAllCharts() {
	chartNames.forEach(function(name) {
		updateOneChart(name);
	});
}

function updateOneChart(name) {
	$.get(url + "?id=" + name + "&dateTime=" + beginTime, function(data) {

		var temperatureData = [], humidityData = [];

		data.forEach(function(dp) {
			temperatureData.push({
				t : dp.dateTime,
				y : dp.temperature
			});
			humidityData.push({
				t : dp.dateTime,
				y : dp.humidity
			});
		});
		
	    charts[name].data.datasets[0].data = temperatureData;
	    charts[name].data.datasets[1].data = humidityData;
	    charts[name].update();
	});
}
