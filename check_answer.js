$( document ).ready(function() {
ducats_for_question = 0;
try_number = 1;
question_numer=1;
past_answears = [];
progress_array = [0, 100];
ans_jokes=["computer","you","something","i love you","fuck"];

var ctx = $(".myChart");
var myBarChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ["Correct:", "Target:"],
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
// function allows computer to speak
function speak(to_speak)
{
	responsiveVoice.cancel();
	voice_pitch = 1 ;
	voice_rate  = 1 ;
	responsiveVoice.speak(to_speak,"US English Female",{pitch: voice_pitch , rate: voice_rate});
}
// function for making UK_notification
function prepare_message(message_text)
{
		message_text += "<canvas class='myBarChart_copy' id='mini_chart_" ;
		message_text += question_numer ;
		message_text +=  "' width='40' height='40'></canvas> " ;
		return(message_text);
}
function render_notes( message_text , message_type ,message_place, message_time)
{
	if(message_text)
	{
		if (  message_time  == undefined ) { message_time  = 100 ; }
		if (  message_place == undefined ) { message_place = "top-right" ; }
		if (  message_time  == undefined ) { message_type  = "success" ; }
		message_text += " <div class = 'uk-text-small'> window will be close after speach </div> ";
		UIkit.notification({message: message_text , status: message_type , pos: message_place ,message_time});
	}
}
function recognise_notes(message_text)
{
	//alert(" function recognise_notes(message_text) : " + message_text);
	message_text=message_text.split(" ");
	switch(message_text[0].toLowerCase()) 
	{
    case "sorry":
    	return("danger");
        break;
    case "unfortunetely":
    	return("danger");
        break;
    case "wow":
    	return("success");
        break;
    case "nice":
    	return("success");
        break;
    case "please":
    	return("warning");
    	break;
    default:
	}
}
function show_notes( message_text , message_type , message_place , message_time )
{
	//alert("function show_notes(" );
	UIkit.notification.closeAll();
	speak(message_text);
	message_text=message_text.split("!").join("<BR>");
	if ( message_type == undefined ) 
	{
			message_type=recognise_notes(message_text);
			render_notes(message_text,message_type,message_place, message_time);		
	}
	else
	{
		message_type=message_type.split("_");
		if(message_type[1]=="chart")
			{
				render_notes(prepare_message(message_text),message_type[0],message_place, message_time);
				draw_minichart(question_numer);
			}
		else
			{
				render_notes(message_text,message_type[0],message_place, message_time);
			}
	}
		
}
function wrong_notes( ans_a , mark)
{
	if (mark>0.9)
	{
		show_notes( 'Almost perfect!. ' + ans_a + '  - is not correct, however more than 90% of word is correct. You got '+ ducats_for_question +' Ducats' , 'success' , 'top-right' );
		if( ducats_for_question-try_number < 8)
		{
		ducats_for_question = parseInt((8-try_number)+1);
		console.log("Ducats for question :" + ducats_for_question); 
		}
	}
	else if (mark >0.8)
	{
    	show_notes( 'Almost good!. ' + ans_a + '  - it seams to be spelling mistake , but you remember the word. More than 80% is good, you got' + ducats_for_question +'Ducats' , 'warning' , 'top-right' );
		if( ducats_for_question-try_number < 5)
		{
		ducats_for_question = parseInt((5-try_number)+1);
		console.log("Ducats for question :" + ducats_for_question); 
		}
	}
	else if (mark >0.65)
	{
		show_notes( 'Far from perfect!. ' + ans_a + ' is not correct , You got 70% and' + ducats_for_question + ' Ducats for this' , 'warning' , 'top-right' );
		if( ducats_for_question-try_number < 1)
		{
		ducats_for_question = parseInt((1-try_number)+1); 
		console.log("Ducats for question :" + ducats_for_question); 
		}
	
	}	
    else	
    {
    	console.log("Ducats for question :" + ducats_for_question); 
      	show_notes( ans_a + "  - is completely not correct. No Gold for bad spelling" , 'danger' , 'top-right' );
    }
} 
function joke(ans_joke)
{
	if(ans_joke=="computer" || ans_joke=="something" ){
		show_notes("Actually, it always will be a correct answer!","success","top-left");
	}
	else if (ans_joke == "i love you")
	{
		show_notes("No matter what, has happened. No matter what , you have done. No matter what ,you will do. I will always love you. I swear it.","success","top-left", "5000");
		//show_notes("So, merry me! ","success","top-left");
	}
	else if (ans_joke == "you")
	{
		show_notes("Me too. All the time, since your camera is on!","danger","top-left");
	}
	else if (ans_joke == "fuck" )
	{
		show_notes("well... Try by USB port. Meantime, watch up your language !","danger","top-left");
	}	
	$("#user_answear").val("");
}
function reset_clock()
{
	start_date = new Date(Date.now()) ;
	end_date = new Date(Date.now()+600000);
	$("#countdown_clock").attr("uk-countdown", "date: " + end_date );
}
function prepare_next_question(i_progres)
{
	progress_array[0] += i_progres;
	wallet_update();
	//show_notes("You have : " + progress_array[0] + " Ducats in your wallet");
	ducats_for_question = 0;
	UIkit.countdown("#countdown_clock").stop(); // stop the clock during loading next question
	past_answears = [];
	$("#user_answear").val("");
	$(".try_list").text("");
	$("#dont_repead").text("");
	
	$("#question_card").css("animation-name", "rotated-90_anim");
	$("#question_card").css("animation-duration", "2s");

	draw_minichart(question_numer);
	question_numer++;
	go_to_next(question_numer);
	myBarChart.update();
	try_number = 1;
}
function wallet_update()
{
	$("#wallet").text(progress_array[0]);
}
function answer_correct(ans_a)
{
	show_notes( "I love this speling!" + ans_a + '  - is the correct answear ! You got ' + parseInt((12-try_number)+1) + ' Ducats ','success_chart','top-left' );
	ducats_for_question = parseInt((12-try_number)+1);
	console.log("Ducats for question :" + ducats_for_question); 
	prepare_next_question(ducats_for_question);
	
}
function try_once_more(ans_a)
{
	//alert(past_answears);
	$("#try_" + try_number ).html("<s>" +  ans_a + " </s> " + ducats_for_question + " Ducats");
	try_number ++;
	past_answears.push(ans_a);
}
function on_more_tries(ans_a)
{

	show_notes('You have answered 3 times incorrectly. The correct answer is ' + correct_answer + ' Lets skip this question' ,'danger_chart','top-left');	
	$("#to_do").html("<H1 class = 'uk-h1 uk-text-success'>" + correct_answer + "</H1><P><H2 class = 'uk-h2 uk-text-primary'> is the correct answer!</H2></P> <P><H3 class = 'uk-h3 uk-text-primary'> write this answer in order to go to next question</H3> </P>")
	try_number = 13;
	//prepare_next_question(ducats_for_question);

}
function already_said(ans_a)
{
	show_notes(ans_a + '! was not, and never will be the correct answer for this !', 'danger','top-right');
	//show_notes('<blockquote class = "uk-text-danger">The definition of insanity is doing the same thing over and over again and expecting a different result.</blockquote>'+ '<footer>Arbert Einstein</footer>' + '<br> <img src="einstein.jpg"> ', 'danger', 'top-left');
	$("#user_answear").val("");
	$("#dont_repead").append("<li>remember it is not a " + ans_a + ":)</li>");
}

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
   	if ($( "#to_do").text() != $(xml).find("to_do").text())
   	{	
   	$( "#to_do").text($(xml).find("to_do").text());
   	speak($("#to_do").text());
   	}
   	$( "#question_img").attr("src",$(xml).find("img_src").text());
   	correct_answer=$(xml).find("correct").text();
   	UIkit.countdown("#countdown_clock").start();//it starts the clock again, since new question has been loaded
    },
    error: function()
    {
    show_notes("Sorry We dont have more question in database.  ");
    }
	})
}
function draw_minichart(where)
{
	var ctx_copy = $("#mini_chart_" + where);
	var myBarChart_copy = new Chart(ctx_copy , {
    type: 'doughnut',
    data: {
        labels: ["Correct :" + progress_array[0] ,"Target :" + progress_array[1]],
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
//change here! star
function parse_answer( ans_a , ans_b )
{	
	ans_a=ans_a.trim().toLowerCase();
	ans_a_array = ans_a.split(" ");
	if (ans_a_array[0]=="the" || ans_a_array[0]=="a")
	{
		ans_a_array[0] = "";
		ans_a_array = ans_a_array.join("");
		ans_a=ans_a_array;
	}
	return(ans_a);//changed here :)
}
function check_lenght( ans_check , ans_cor)
{
	table_lenght = [];
	ans_check = ans_check.split("");
	ans_cor	  = ans_cor.split("");
	table_lenght.push(ans_check.length);
	table_lenght.push(ans_cor.length);
	table_lenght.sort();
	return table_lenght[0]/table_lenght[1];
}
function check_letters(  ans_check , ans_cor )
{
	//alert("check_letters(  ans_check , ans_cor )");
	table_cor = [];
	table_cor_reverse = [];//for checking words backwords
	ans_check = ans_check.split("");
	ans_cor	  = ans_cor.split("");
	table_cor_incorect = [];
	for (i = 0; i <= ans_cor.length - 1; i++)
	{
			if (ans_check[i]==ans_cor[i])
			{
				table_cor.push(ans_check[i]);
			}	
			else if (ans_check[i]!=ans_cor[i])
			{
				table_cor_incorect.push(ans_check[i]);
			}
	}
	return ( Math.abs(1 - ( table_cor_incorect.length / ans_cor.length )));
}
// function for checking the answer
function check_answear( ans_a , ans_b )
{
	ans_a = parse_answer(ans_a);	
	if (ans_a == ans_b) 
	{
		answer_correct(ans_a);
	}
	else
	{
		if (! past_answears.includes(ans_a))
		{
			if (ans_jokes.includes(ans_a))
			{
			joke(ans_a);
			}
			else{
				mark = check_letters( ans_a , ans_b )
				wrong_notes(ans_a , mark);
				if (try_number < 3 )
				{
					try_once_more(ans_a);
				}
				else
				{
					on_more_tries(ans_a);
				}
			}
		}
		else
		{
			already_said(ans_a);
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
    return false;  
}
});
if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  //alert("something works");
  show_notes("You can talk with me now. ! Just use you  microphone.","success", "top-right" );
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
     	if (input.trim()!= "" ) //it checks if input is not empty
			{
  				check_answear( $("#user_answear").val() , correct_answer );
   				alert("I can hear you. NEXT");
			}
		else
		{
			show_notes("Hey, I can not see your answer.","warning");
		}
    },
    'enter': function() {
    	if (input.trim()!= "" ) //it checks if input is not empty
			{
  				check_answear( $("#user_answear").val() , correct_answer );
   				alert("I can hear you. enter");
			}
		else
		{
			show_notes("Hey, I can not see your answer.","warning");
		}

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
else
{
	$("#welcome_error_message").html("Unfortunetely, you can not talk with me, because your browser does not support voice control. <a href ='https://www.google.com/chrome/'>Please download Google Chrome, so we can talk.</a>");
	$("#welcome_error_message").addClass("uk-alert-danger");
	UIkit.notification({message: 'Link for google chrom :<a href="https://www.google.com/chrome/"> Download Here </a>', status: 'danger',pos: 'top-right'});

}

function welcome()
{
UIkit.modal("#modal-example").show();
if($("#welcome_error_message").text() != "")
{
	speak($("#welcome_error_message").text() + " . " + $("#welcome_text").text() + " ! "+ $("#welcome_form").text());
}
else
{
	speak($("#welcome_text").text() + " ! "+ $("#welcome_form").text());
}
$("#user_name").keypress(function (e) {
  if (e.which == 13) {
  	e.preventDefault();
	input = $(this).val(); 
	if (input.trim()!= "" ) //it checks if input is not empty
	{
  		show_notes("Nice to meet you " +  $("#user_name").val(),"success" );
	}
	else
	{
		show_notes("Please. don't be so shy. !  Are you sure don't wont to introduce yourself?","warning");
	}
    return false; 
  }
});
$("#go").click(function(){
UIkit.modal("#modal-example").hide();
reset_clock();
go_to_next(question_numer);
});
$("#modal-example").hide(
function(){
	reset_clock();
go_to_next(question_numer);
}
	);}
welcome();
});
