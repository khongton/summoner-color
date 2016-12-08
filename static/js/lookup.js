var summonerName = '';
var participantID = null;
var playerFrames = []


function drawGraph() {
	if ($.trim($('svg').html() !== '')) {
		$('svg').empty();
	}

	$(document).ajaxStop(function() {
		var data = formatData();
		var graph = d3.select('#graph'),
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
		xAxis = d3.axisBottom().ticks(playerFrames.length).scale(xRange),
		yAxis = d3.axisLeft().scale(yRange);
		var lineFunction = d3.line()
							.x(function(data) { return xRange(data.x);})
							.y(function(data) { return yRange(data.y);})
							.curve(d3.curveCatmullRom);

		//These two lines attach the graph to our HTML document
		graph.append('svg:g').attr('class', 'x-axis').attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')').call(xAxis);
		graph.append('svg:g').attr('class', 'y-axis').attr('transform', 'translate(' + (MARGINS.left) + ',0)').call(yAxis);
		graph.append('svg:path').attr('d', lineFunction(data)).attr('stroke', 'blue').attr('stroke-width', 2).attr('fill', 'none');
	});
}
function formatData() {
	var data = []
	for (var idx = 0; idx < playerFrames.length; idx++) {
		var curGold = playerFrames[idx].currentGold;
		var dataPoint = {x: idx, y: curGold};
		data.push(dataPoint);
	}
	return data;
}

function searchSummoner(data) {
	summonerId = data[Object.keys(data)[0]].id;
	var jsonId = {'summonerId' : summonerId};
	$.ajax({
		url: '/match-search',
		data: jsonId,
		contentType: 'application/json;charset=UTF-8',
		type: 'POST',
		success: function(response) {
			console.log('Success');		
			console.log(response);
		},
		error: function(error) {
			errorOutput(error);
		}
	});
}

function searchMatches(summonerID) {
	var jsonID = {'summonerid' : summonerID};
	$.ajax({
		url: '/matchlist',
		data: JSON.stringify(jsonID),
		contentType: 'application/json;charset=UTF-8',
		type: 'POST',
		success: function(response) {
			//JSON object contains list of ranked games user has played
			var matchJSON = $.parseJSON(response);
			for (index in matchJSON.matches) {
				findMatchDetail(matchJSON.matches[index].matchId);
			}
		},
		error: function(error) {
			errorOutput(error);
		}
	});
}

function findMatchDetail(matchID) {
	var jsonMatch = {'matchid' : matchID};
	$.ajax({
		url: '/matchdetail',
		data: JSON.stringify(jsonMatch),
		contentType: 'application/json;charset=UTF-8',
		type: 'POST',
		success: function(response) {
			var detail = $.parseJSON(response);
			for (player in detail.participantIdentities) {
				if (detail.participantIdentities[player].player.summonerName === summonerName) {
					participantID = detail.participantIdentities[player].participantId;
				}
			}			
			for (frame in detail.timeline.frames) {
				playerFrames.push(detail.timeline.frames[frame].participantFrames[participantID]);
			}
			console.log(playerFrames.length);
		},
		error: function(error) {
			errorOutput(error);
		}
	})
}

function errorOutput(error) {
	$('#response').html('<p>Looks like something went wrong!</p>');
	console.log(error);
}