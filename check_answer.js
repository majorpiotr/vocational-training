$( document ).ready(function() {
//alert("works");
//$("#question_img").ajax("question_img/dog.jpg");
//$( "#question_title" ).load( "questions_text/1.xml" );

//var xml = "<question><title>Test Question 1 - Title</title><to_do>What can you see on the picture below</to_do><correct>dog</correct><img_src>question_img/dog.jpg</img_src></question> ",

$.ajax({
    type: "GET",
    url: "questions_text/1.xml",
    dataType: "xml",
    success: function(xml){
    $( "#question_title" ).text($(xml).find("title").text());
   	$( "#to_do").text($(xml).find("to_do").text());
   	$( "#question_img").attr("src",$(xml).find("img_src").text());
   	correct_answer=$(xml).find("correct").text();
    }
  });

function check_answear( ans_a, ans_b )
{
if (ans_a.toLowerCase().trim() == ans_b.toLowerCase().trim()) 
{
	alert("Your answear is correct :)");
	$("#user_answear").val(""); 
}

}

$("#submit_it").click(function() {
  check_answear( $("#user_answear").val() , correct_answer );
});
$("#user_answear").keypress(function (e) {
  if (e.which == 13) {
  	e.preventDefault();
  	check_answear( $("#user_answear").val() , correct_answer );
    return false;    //<---- Add this line
  }
});





//$("#question_img").load("question_img/dog.jpg");
});
