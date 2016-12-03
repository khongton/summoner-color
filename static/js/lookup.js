$(function() {
	$('button').click(function() {
		searchSummoner();
	})
});


//I'm making a lot of AJAX calls - maybe template them or something
function searchSummoner() {
	var summonerName = $('#summoner-name').val();
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
	console.log(summonerID);
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
			console.log(response);
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