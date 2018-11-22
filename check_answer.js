$( document ).ready(function() {
//alert("works");
//$("#question_img").ajax("question_img/dog.jpg");
//$( "#question_title" ).load( "questions_text/1.xml" );

//var xml = "<question><title>Test Question 1 - Title</title><to_do>What can you see on the picture below</to_do><correct>dog</correct><img_src>question_img/dog.jpg</img_src></question> ",
try_number = 1;
function reset_clock()
{
	start_date = new Date(Date.now()) ;
	end_date = new Date(Date.now()+600000);
	$("#countdown_clock").attr("uk-countdown", "date: " + end_date );
}
$.ajax({
    type: "GET",
    url: "questions_text/1.xml",
    dataType: "xml",
    success: function(xml){
    $( "#question_title" ).text($(xml).find("title").text());
   	$( "#to_do").text($(xml).find("to_do").text());
   	$( "#question_img").attr("src",$(xml).find("img_src").text());
   	correct_answer=$(xml).find("correct").text();
   	reset_clock();
    }
  });



  /*  UIkit.util.ready(function () {

        var bar = document.getElementById('js-progressbar');

        var animate = setInterval(function () {

            bar.value += 10;

            if (bar.value >= bar.max) {
                clearInterval(animate);
            }

        }, 1000);

    });
*/
function mark_speeling()
{
return 0;
}
function check_answear( ans_a, ans_b )
{

if (ans_a.toLowerCase().trim() == ans_b.toLowerCase().trim()) 
{
	UIkit.notification({message: ans_a + '  - is the correct answear. ' + '<br> So proud of you' + ' User_name', status: 'success'});
	//alert("Your answear is correct :)");
	$("#user_answear").val("");
	val = parseInt($("#js-progressbar").attr("value"));
	val += 10; 
	$("#js-progressbar").attr("value",val);
	if ($("#js-progressbar").attr("value") == 100) 
	{
	UIkit.notification({message:'Test has been done :)', status: 'danger'});	
	}
}
else
{
	UIkit.notification({message: ans_a + '  - is completely not correct', status: 'danger'});
	if (try_number <= 3 )
	{

		$("#try_" + try_number ).text( ans_a );
		try_number ++;

	}
	else
	{
			UIkit.notification({message: 'You have answeared 3 times incorrectly. Lets skip this question', status: 'danger'});

	}
}


}

$("#submit_it").click(function() {
  check_answear( $("#user_answear").val() , correct_answer );
});
$("#user_answear").keypress(function (e) {
  if (e.which == 13) {
  	e.preventDefault();
	input = $(this).val(); 
	if (input.trim()!= "" ) //it checks if input is not empty
	{
  	check_answear( $("#user_answear").val() , correct_answer );
	}
    return false;    //<---- Add this line
  }
});





//$("#question_img").load("question_img/dog.jpg");
});
