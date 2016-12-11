var participantFrames = [];
var data = [];

function parseParticipantFrames(matchData, summonerName) {
	var participants = matchData.participantIdentities;
	var requestID = '';
	for (player in participants) {
		if (participants[player].player.summonerName === summonerName) {
			requestID = participants[player].participantId;
			break;
		}
	}

	var gameFrames = matchData.timeline.frames;
	for (frame in gameFrames) {
		console.log(gameFrames[frame].participantFrames[requestID]);
		participantFrames.push(gameFrames[frame].participantFrames[requestID]);
	}
	//Frames now contains the per minute gold data of this summoner
}

function drawGraph() {
	var data = formatData();
	var graph = d3.select('#graph').attr('width', 1000).attr('height', 500),
	WIDTH = 1000,
	HEIGHT = 500,
	MARGINS = {
		top: 20, 
		right: 20,
		bottom: 20,
		left: 50
	},
	xRange = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function(dataPoint) {
		return dataPoint.x;
	}), d3.max(data, function(dataPoint) {
		return dataPoint.x;
	})]),
	yRange = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data, function(dataPoint) {
		return dataPoint.y;
	}), d3.max(data, function(dataPoint) {
		return dataPoint.y;
	})]),
	xAxis = d3.axisBottom().ticks(participantFrames.length).scale(xRange),
	yAxis = d3.axisLeft().scale(yRange);
	var lineFunction = d3.line()
						.x(function(data) { return xRange(data.x);})
						.y(function(data) { return yRange(data.y);})
						.curve(d3.curveCatmullRom);

	graph.append('svg:g').attr('class', 'x-axis').attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')').call(xAxis);
	graph.append('svg:g').attr('class', 'y-axis').attr('transform', 'translate(' + (MARGINS.left) +',0)').call(yAxis);
	graph.append('svg:path').attr('d', lineFunction(data)).attr('stroke', 'blue').attr('stroke-width', 2).attr('fill', 'none');
}

function formatData() {
	for (var idx = 0; idx < participantFrames.length; idx++) {
		var curGold = participantFrames[idx].currentGold;
		var dataPoint = {x: idx, y: curGold};
		data.push(dataPoint);
	}
	return data;
}