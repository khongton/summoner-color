$(function() {
	$('button').click(function() {
		var user = $('#txtUser').val();
		var pass = $('#txtPass').val();
		$.ajax({
			url: '/signUpUser',
			data: $('form').serialize(),
			type: 'POST',
			success: function(response) {
				$('#response-div').append('<p>' + response + '</p>');
			},
			error: function(error) {
				$('#response-div').append('<p>' + error + '</p>');
			}
		});
	});
});