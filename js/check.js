$('document').ready(function(){
  $('#email').on('blur', function(){
 	var email = $('#email').val();
      
 	$.ajax({
      url: 'process.php',
      type: 'post',
      data: {
      	'email_check' : 1,
      	'email' : email,
      },
      success: function(response){
      	if (response == 'taken' ) {
          $('#form-btn').attr('disabled', true); //disable input
          $('#email').parent().removeClass();
          $('#email').parent().addClass("form_error");
          $('#email').siblings("span").text('Email already in use');
      	}else if (response == 'not_taken') {
          $('#form-btn').removeAttr('disabled'); //enable input
      	  $('#email').parent().removeClass();
      	  $('#email').parent().addClass("form_success");
      	  $('#email').siblings("span").text('Email available for use');
		  
      	}
      }
 	});
 });
    $('#re_pass').keyup(function(){
    var pass    =   $('#pass').val();
    var cpass   =   $('#re_pass').val();
    if(pass!=cpass){
		 $("#re-passLab").css({"color" : "red"});
		 $("#re_pass").css({"border-color" : "red","color" : "red"});
        $('#form-btn').attr('disabled', true); //disable input
		//$("#agree-term").prop("checked", false);
    }
    else{
        $("#re-passLab").css({"color" : "black"});
		$("#re_pass").css({"border" : "1px solid #ccc","color" : "black"});
        $('#form-btn').removeAttr('disabled'); //enable input
     
    }
});
    $('#free').click(function () {
        $("#account_type").val("Free");
    });
    $('#paid').click(function () {
        $("#account_type").val("Paid"); 
    }); 
$('.select2').select2();
    
    $('#form-btn').on('click', function(){
        if($('#packing_options').val() > 0){
            $("#signupForm").submit(function(e){
              e.currentTarget.submit();
            })
        }else{
            $("#signupForm").submit(function(e){
              e.preventDefault()
            })
            alert("Please select the PREFERRED PACKING OPTION");
        }
    })
 });