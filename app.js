var dir = 'http://0bb91c38.ngrok.io/',
	answers;
(function () {

    'use strict';

    $(document).ready(function () {
		var getAnswers = function(){
			var i;
			console.log(dir);
	        $.ajax({
	            type: 'GET',
	            url: dir + 'answer',
	            success: function (data) {
	            	

	            	answers = JSON.parse(data);
	            	console.log(answers);
	            	// console.log(answers.length);
	            	for (i=0; i<answers.length; i++){
	                    $('#main').append(
	                    	$('<div/>', {
	                    		'id': i
	                    	}).append(
	                    		$('<div/>').text(answers[i])
	                    	))
	                   
	                   	
	                    console.log(answers[i])
	                	
	                }
	            }
	        });
		};
		console.log("ready");
		getAnswers();
    });
}());