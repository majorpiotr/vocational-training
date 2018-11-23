$( document ).ready(function() {
//alert("works");
//$("#question_img").ajax("question_img/dog.jpg");
//$( "#question_title" ).load( "questions_text/1.xml" );

//var xml = "<question><title>Test Question 1 - Title</title><to_do>What can you see on the picture below</to_do><correct>dog</correct><img_src>question_img/dog.jpg</img_src></question> ",
try_number = 1;
question_numer=1;
past_answears = [];
progress_array = [0, 0];

//$("#modal-example").show();
//data: [20, 10];
var ctx = $(".myChart");
var myBarChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ["Correct","Wrong"],
        datasets: [{
            label: '# of Votes',
            data: progress_array,
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255,99,132,1)'
            ],
            borderWidth: 1
        }]
    }
});
function reset_clock()
{
	start_date = new Date(Date.now()) ;
	end_date = new Date(Date.now()+600000);
	$("#countdown_clock").attr("uk-countdown", "date: " + end_date );
}




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
function speak(to_speak)
{
	responsiveVoice.speak(to_speak);
}
function go_to_next(question_numer)
{
	$("#question_card").css("animation-name", "rotated-90_anim");
	$("#question_card").css("animation-duration", "4s");
	UIkit.countdown("#countdown_clock").stop(); // stop the clock during loading next question
	$(".try_list").text("");
	$("#dont_repead").text("");
	question_url = "questions_text/";
	question_url += question_numer;
	question_url += ".xml";
	$.ajax({
    type: "GET",
    url: question_url,
    dataType: "xml",
    success: function(xml){
    $( "#question_title" ).text($(xml).find("title").text());
   	if ($( "#to_do").text() != $(xml).find("to_do").text())
   	{	
   	$( "#to_do").text($(xml).find("to_do").text());
   	speak($("#to_do").text());
   	}
   	$( "#question_img").attr("src",$(xml).find("img_src").text());
   	correct_answer=$(xml).find("correct").text();
   	UIkit.countdown("#countdown_clock").start();//it starts the clock again, since new question has been loaded
    }})
	$("#question_card").css("animation-name", "un_rotated-90_anim");
	$("#question_card").css("animation-duration", "4s");	
}

function draw_minichart(where)
{
	var ctx_copy = $("#mini_chart_" + where);
	var myBarChart_copy = new Chart(ctx_copy , {
    type: 'doughnut',
    data: {
        labels: ["Correct","Wrong"],
        datasets: [{
            label: '# of Votes',
            data: progress_array,
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255,99,132,1)'
            ],
            borderWidth: 1
        }]
    }});
}
function check_answear( ans_a, ans_b )
{
ans_a = ans_a.trim().toLowerCase().split(" ");
if (ans_a[0]=="the" || ans_a[0]=="a")
{
	ans_a[0] = "";
	ans_a = ans_a.join("");
}
//alert(ans_a);
if (ans_a == ans_b) 
{
	//alert("Your answear is correct :)");
	past_answears = [];
	$("#user_answear").val("");
	//val = parseInt($("#js-progressbar").attr("value"));
	//val += 10; 
	//$("#js-progressbar").attr("value",val);
	question_numer++;
	go_to_next(question_numer);
	progress_array[0]=progress_array[0]+1;
	
myBarChart.update();	
	UIkit.notification.closeAll();
	UIkit.notification({message: ans_a + '  - is the correct answear. ' + '<br> So proud of you' + ' User_name' + '<BR>'+  '<canvas class="myBarChart_copy"' + "id='mini_chart_" + question_numer + "'  " +' width="40" height="40"></canvas>' ,pos: 'top-left', status: 'success',timeout: 1500});
draw_minichart(question_numer);
speak(ans_a + " is the correct answear");

}
else
{
	if (!past_answears.includes(ans_a))
	{
	UIkit.notification.closeAll();
	UIkit.notification({message: ans_a + '  - is completely not correct', status: 'danger',timeout:1500});
	responsiveVoice.speak(ans_a + "is completely not correct");
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
			UIkit.notification.closeAll();
			UIkit.notification({message: 'You have answered 3 times incorrectly. Lets skip this question' + '<canvas class="myBarChart_copy"' + "id='mini_chart_" + question_numer + "'  " +' width="40" height="40"></canvas>' , status: 'danger',pos: 'top-left',timeout:1500});
			progress_array[1]=progress_array[1]+1;
			draw_minichart(question_numer);
			question_numer++;
			go_to_next(question_numer);
			responsiveVoice.speak("You have answered 3 times incorrectly. Lets skip this question");
			
	myBarChart.update();
	}
	}
	else
	{
					UIkit.notification.closeAll();
					UIkit.notification({message: ans_a + '<br> <B>was not</B>, and <B>never will</B> be the correct answer for this :(', status: 'danger',pos: 'top-right'});
					UIkit.notification({message: '<blockquote class = "uk-text-danger">The definition of <B>insanity</B> is doing the same thing over and over again and expecting a different result.</blockquote>'+ '<footer>Arbert Einstein</footer>' + '<br> <img src="einstein.jpg"> ', status: 'danger',pos: 'top-left'});
					$("#user_answear").val("");
					$("#dont_repead").append("<li>remember it is not a " + ans_a + ":)</li>");
					responsiveVoice.speak(ans_a + "will be never the correct answer for this");
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
if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  //alert("something works");
  var commands = {
   	'I can see *tag': function(tag) {
      //if (input.trim()!= "" ) //it checks if input is not empty
		//{
  		//check_answear( $("#user_answear").val() , correct_answer );
   		$("#user_answear").val(tag);
   		alert("I can hear you. I can see" + tag);

		//}
    },
   	'is': function() {
      //if (input.trim()!= "" ) //it checks if input is not empty
		//{
  		//check_answear( $("#user_answear").val() , correct_answer );
   		 //$("#user_answear").val(tag);
   		alert("I can hear you. It is");

		//}
    },
    'next': function() {
     // if (input.trim()!= "" ) //it checks if input is not empty
		//{
  		check_answear( $("#user_answear").val() , correct_answer );
   		//alert("I can hear you. NEXT");

		//}
    },
    'enter': function() {
      //if (input.trim()!= "" ) //it checks if input is not empty
		//{
  		//check_answear( $("#user_answear").val() , correct_answer );
   		alert("I can hear you. enter");

		//}
    },
    'ok': function() {
      //if (input.trim()!= "" ) //it checks if input is not empty
		//{
  		//check_answear( $("#user_answear").val() , correct_answer );
  		alert("I can hear you. OK");
		//}
    },
    'fuck': function() {
      //if (input.trim()!= "" ) //it checks if input is not empty
		//{
  		//check_answear( $("#user_answear").val() , correct_answer );
  		alert("I can hear you. fuck");
		//}
    },
    'hello': function() {
      //if (input.trim()!= "" ) //it checks if input is not empty
		//{
  		//check_answear( $("#user_answear").val() , correct_answer );
  		alert("I can hear you. hello");
		//}
    }
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}
function welcome()
{
UIkit.modal("#modal-example").show();
speak($("#welcome_text").text() + " ! "+ $("#welcome_form").text());
$("#go").click(function(){
UIkit.modal("#modal-example").hide();;
reset_clock();
go_to_next(question_numer);

});
}

welcome();
});
