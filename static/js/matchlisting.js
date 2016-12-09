function listMatches(matchHistory) {
	var list = $('#listing');
	$.each(matchHistory.games, function(index, value) {
		var date = new Date(value.createDate);
		var dateString = date.toLocaleDateString();
		var timeString = date.toLocaleTimeString();
		list.append('<div id="match-' + index + '">' + dateString + ' ' + timeString + '</div>');
	});
}