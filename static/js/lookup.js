var summonerName = '';
var participantID = null;
var playerFrames = []
$(function() {
	$('button').click(function() {
		searchSummoner();
	})
});


function searchSummoner() {
	summonerName = $('#summoner-name').val();
	$.ajax({
		url: '/summoner-search',
		data: $('form').serialize(),
		type: 'POST',
		success: function(response) {
			var jsonObj = $.parseJSON(response);
			var profileID = jsonObj[summonerName.toLowerCase()].id;
			$('#response').html('<p>Summoner Information: ' + profileID + '</p>');
			searchMatches(profileID);
		},
		error: function(error) {
			errorOutput(error);
		}
	})
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