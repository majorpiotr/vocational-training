$( document ).ready(function() {
//alert("works");
//$("#question_img").ajax("question_img/dog.jpg");
//$( "#question_title" ).load( "questions_text/1.xml" );

//var xml = "<question><title>Test Question 1 - Title</title><to_do>What can you see on the picture below</to_do><correct>dog</correct><img_src>question_img/dog.jpg</img_src></question> ",
try_number = 1;
question_numer=1;
past_answears = [];
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
/* it checks mistake type, count how many mistakes in one word, and so on 
function mark_speeling( ans_a , ans_b )
{
	ans_a = ans_a.split();
	ans_b = ans_b.split();
	if (ans_a.lenght()==ans_b.lenght())
	{
		return 0;
	}
}
*/ 
function go_to_next(question_numer)
{
	question_url = "questions_text/";
	question_url += question_numer;
	question_url += ".xml";
	$.ajax({
    type: "GET",
    url: question_url,
    dataType: "xml",
    success: function(xml){
    $( "#question_title" ).text($(xml).find("title").text());
   	$( "#to_do").text($(xml).find("to_do").text());
   	$( "#question_img").attr("src",$(xml).find("img_src").text());
   	correct_answer=$(xml).find("correct").text();
   	reset_clock();
    }})
}
function check_answear( ans_a, ans_b )
{

if (ans_a.toLowerCase().trim() == ans_b.toLowerCase().trim()) 
{
	UIkit.notification({message: ans_a + '  - is the correct answear. ' + '<br> So proud of you' + ' User_name', status: 'success'});
	//alert("Your answear is correct :)");
	past_answears = [];
	$("#user_answear").val("");
	val = parseInt($("#js-progressbar").attr("value"));
	val += 10; 
	$("#js-progressbar").attr("value",val);
	question_numer++;
	go_to_next(question_numer);
	if ($("#js-progressbar").attr("value") == 100) 
	{
	UIkit.notification({message:'Test has been done :)', status: 'danger'});	
	}

}
else
{
	if (!past_answears.includes(ans_a))
	{
	UIkit.notification({message: ans_a + '  - is completely not correct', status: 'danger'});
	if (try_number <= 3 )
	{

		$("#try_" + try_number ).text( ans_a );
		try_number ++;
		past_answears.push(ans_a);
	//	alert(past_answears);
	}
	else
	{
			$("#user_answear").val("");
			UIkit.notification({message: 'You have answeared 3 times incorrectly. Lets skip this question', status: 'danger'});
			question_numer++;
			go_to_next(question_numer);
	}
	}
	else
	{
					UIkit.notification({message: 'The definition of insanity is doing the same thing over and over again and expecting a different result.' + ans_a + '<br> ,  was not, and never will be the correct answear for this :(', status: 'danger'});
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
