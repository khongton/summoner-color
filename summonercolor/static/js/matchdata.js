var participantFrames = [];
var data = [];

var gameData = {
	time : [],
	gold : []
}

function parseParticipantFrames(matchData, summonerName, history) {
	console.log(history);
	var participants = matchData.participantIdentities;
	var requestID = '';

	//We need to determine if the identity is publicly available. If it is, filter through
	//array until we find the player's participant ID
	if (typeof participants[0].player !== 'undefined') {
		for (player in participants) {
			var curPlayer = participants[player].player.summonerName;
			if (curPlayer === summonerName) {
				requestID = participants[player].participantId;
				break;
			}
		}
	} 
	else {
		//We must determine identity based on what champion you are playing.
		var championId = '';
		for (game in history.games) {
			if (matchData.matchId === history.games[game].gameId) {
				championId = history.games[game].championId.id;
				break;
			}
		}
		for (player in matchData.participants) {
			if (matchData.participants[player].championId === championId) {
				requestID = matchData.participants[player].participantId;
				break;
			}
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
	var ctx = chartElm.getContext('2d');
	var gradient = ctx.createLinearGradient(0, 0, 0, 450);

	var dataset = {
		labels: gameData.time,
		datasets: [{
			label: 'Mochidear',
			backgroundColor: gradient,
			borderColor: '#000',
			pointBackgroundColor: '#fff',
			pointBorderColor: '#000',
			data: gameData.gold
		}]
	};
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
	};

	gradient.addColorStop(1, 'rgba(229, 34, 4, 1)');
	gradient.addColorStop(0.25, 'rgba(234, 250, 66, 1)');
	gradient.addColorStop(0.5, 'rgba(234, 250, 66, 1)');
	gradient.addColorStop(0.75, 'rgba(234, 250, 66, 1)');
	gradient.addColorStop(0, 'rgba(234, 250, 66, 1)');
	var goldChart = new Chart(ctx, {
		type: 'line',
		data: dataset,
		options: options
	});
}