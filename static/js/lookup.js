$(function() {
	$('button').click(function() {
		searchSummoner();
	})
});

function searchSummoner() {
	var summonerName = $('#summoner-name').val();
	$.ajax({
		url: '/summoner-search',
		data: $('form').serialize(),
		type: 'POST',
		success: function(response) {
			var jsonObj = $.parseJSON(response);
			var profileID = jsonObj[summonerName.toLowerCase()].id;
			$('#response').html('<p>Your summoner ID is: ' + profileID + '</p>');
		},
		error: function(error) {
			$('#response').html('<p>Looks like something went wrong!</p>');
			console.log(error);
		}
	})
}