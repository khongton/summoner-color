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
		participantFrames.push(gameFrames[frame].participantFrames[requestID]);
	}
	//Frames now contains the per minute gold data of this summoner
}

function drawGraph() {
	var data = formatData();
	var graph = d3.select('#graph').attr('width', 1200).attr('height', 600),
	MARGINS = {
		top: 20, 
		right: 20,
		bottom: 20,
		left: 50
	},
	WIDTH = 1000,
	HEIGHT = 500,
	xRange = d3.scaleLinear().range([MARGINS.left * 2, WIDTH]).domain([d3.min(data, function(dataPoint) {
		return dataPoint.x;
	}), d3.max(data, function(dataPoint) {
		return dataPoint.x;
	})]),
	yRange = d3.scaleLinear().range([HEIGHT, MARGINS.bottom]).domain([d3.min(data, function(dataPoint) {
		return dataPoint.y;
	}), d3.max(data, function(dataPoint) {
		return dataPoint.y;
	})]),
	xAxis = d3.axisBottom().ticks(participantFrames.length).scale(xRange),
	yAxis = d3.axisLeft().scale(yRange);

	var bisectData = d3.bisector(function(data) { return data.x}).left; //what am i doing???????
	var lineFunction = d3.line()
						.x(function(data) { return xRange(data.x);})
						.y(function(data) { return yRange(data.y);})
						.curve(d3.curveCatmullRom.alpha(0.5));
	var focus = graph.append('g')
					 .attr('class', 'focus')
					 .style('display', 'none');
	focus.append('circle').attr('r', 4.5);
	focus.append('text').attr('x', 9).attr('dy', '.35em');

	graph.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (HEIGHT + MARGINS.bottom - MARGINS.top) + ')')
			.call(xAxis);
	graph.append("text")
			.attr('transform', 'translate(' + (WIDTH/2) + ',' +(HEIGHT + MARGINS.top + 20) + ')')
			.text("Time (minutes)");
	
	graph.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + (MARGINS.left * 2) +',0)')
			.call(yAxis);
	graph.append('svg:text')
			.attr('transform', 'translate(50' + ',' + ((HEIGHT - MARGINS.bottom)/2) +') rotate(-90)')
			.text("Gold");
	
	graph.append('path')
			.attr('d', lineFunction(data))
			.attr('stroke', 'blue')
			.attr('stroke-width', 2)
			.attr('fill', 'none');
}

function formatData() {
	for (var idx = 0; idx < participantFrames.length; idx++) {
		var curGold = participantFrames[idx].currentGold;
		var dataPoint = {x: idx, y: curGold};
		data.push(dataPoint);
	}
	return data;
}

function mouseMove() {
	var x0 = xRange.invert(d3.mouse(this)[0]),
		 i = bisectData(data, x0, 1),
		 d0 = data[i - 1],
		 d1 = data[i],
		 d = x0 - d0.x > d1.x - x0 ? d1 : d0;
	focus.attr('transform', 'translate(' + x(d.x) + ',' + y(d.y) +')');
	console.log(d.y);
	focus.select('text').text(d.y);
}