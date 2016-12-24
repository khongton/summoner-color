var participantFrames = [];
var data = [];

var gameData = {
	time : [],
	gold : []
}

function parseParticipantFrames(matchData, summonerName) {
	var participants = matchData.participantIdentities;
	var requestID = '';

	//Filter until we find the requested summoner
	for (player in participants) {
		if (participants[player].player.summonerName === summonerName) {
			requestID = participants[player].participantId;
			break;
		}
	}

	var gameFrames = matchData.timeline.frames;
	for (var min = 0; min < gameFrames.length; min++) {
		var curFrame = gameFrames[min].participantFrames[requestID];
		gameData.time[min] = min;
		gameData.gold[min] = curFrame.currentGold;
	}

	for (frame in gameFrames) {
		participantFrames.push(gameFrames[frame].participantFrames[requestID]);
	}
	//Frames now contains the per minute gold data of this summoner
}

function drawChart() {
	var chartElm = document.getElementById('chart');
	var dataset = {
		labels: gameData.time,
		datasets: [{
			label: 'Mochidear',
			fill: true,
			data: gameData.gold
		}]
	}
	var options = {
		title: {
			display: true,
			text: 'Player Gold at Each Minute'
		},
		legend: {
			display: false
		},
		tooltips: {
			enabled: true,
			callbacks: {
				label: function(tooltipItems, data) {
					return tooltipItems.yLabel + ' gold';
				},
				title: function(tooltipItems, data) {
					return 'Minute ' + tooltipItems[0].xLabel;
				}
			}
		},
		responsive: false,
		scales: {
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Gold'
				}
			}],
			xAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Time (Minutes)'
				}
			}]
		}
	}

	var goldChart = new Chart(chartElm, {
		type: 'line',
		data: dataset,
		options: options
	});
}