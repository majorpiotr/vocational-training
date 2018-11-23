$( document ).ready(function() {
//alert("works");
//$("#question_img").ajax("question_img/dog.jpg");
//$( "#question_title" ).load( "questions_text/1.xml" );

//var xml = "<question><title>Test Question 1 - Title</title><to_do>What can you see on the picture below</to_do><correct>dog</correct><img_src>question_img/dog.jpg</img_src></question> ",
try_number = 1;
question_numer=1;
past_answears = [];
progress_array = [0, 0];

//data: [20, 10];
var ctx = $(".myChart");
var myBarChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ["Answer's"],
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

    /*,
    options: {
       /* scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    barPercentage: 1
                }
            }]
        }*/
        /*
        scales: {
            xAxes: [{
                stacked: true,
                ticks: {
                max:100,	
                beginAtZero: true
            }
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                max:100,
                beginAtZero: true
            }
            }]
        }
    }
*/
   // options: options
});
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
	UIkit.countdown("#countdown_clock").stop(); // stop the clock during loading next question
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
   	UIkit.countdown("#countdown_clock").start();//it starts the clock again, since new question has been loaded
    }})

}

function draw_minichart()
{
	var ctx_copy = $(".myBarChart_copy");
	var myBarChart_copy = new Chart(ctx_copy , {
    type: 'doughnut',
    data: {
        labels: ["Answer's"],
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

if (ans_a.toLowerCase().trim() == ans_b.toLowerCase().trim()) 
{
	//alert("Your answear is correct :)");
	past_answears = [];
	$("#user_answear").val("");
	//val = parseInt($("#js-progressbar").attr("value"));
	//val += 10; 
	//$("#js-progressbar").attr("value",val);
	question_numer++;
	go_to_next(question_numer);
	progress_array[0]=progress_array[0]+10;
	
myBarChart.update();	
	UIkit.notification({message: ans_a + '  - is the correct answear. ' + '<br> So proud of you' + ' User_name' + '<BR>'+  '<canvas class="myBarChart_copy" width="40" height="40"></canvas>' , status: 'success',timeout: 1000});
 //$(".myBarChart_copy").append($(".myChart").html());

draw_minichart();

//$(".myBarChart_copy").html($(".myChart").clone());

	//if ($("#js-progressbar").attr("value") == 100) 
	//{
	//UIkit.notification({message:'Test has been done :)', status: 'danger'});	
	//}

}
else
{
	if (!past_answears.includes(ans_a))
	{
	UIkit.notification({message: ans_a + '  - is completely not correct', status: 'danger',timeout:1000});
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
			UIkit.notification({message: 'You have answeared 3 times incorrectly. Lets skip this question' +  '<canvas class="myBarChart_copy" width="40" height="40"></canvas>', status: 'danger',pos: 'bottom-center',timeout:3000});
			question_numer++;
			go_to_next(question_numer);
			progress_array[1]=progress_array[1]+10;

	myBarChart.update();
draw_minichart();
	}
	}
	else
	{
					UIkit.notification({message: ans_a + '<br> was not, and never will be the correct answear for this :(', status: 'danger',pos: 'top-right'});
					UIkit.notification({message: 'The definition of insanity is doing the same thing over and over again and expecting a different result.', status: 'danger',pos: 'top-left'});
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
