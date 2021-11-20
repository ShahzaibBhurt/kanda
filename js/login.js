$(document).ready(function(){
    // block login and register forms
    $("#formReg, #formLogin, #contactForm, #udUpdate").submit(function(e){
        e.preventDefault()
    })
    // checking passwords
    $('#re_pass').on('keyup', function(){
        var pass = $('#pass').val()
        var cpass = $('#re_pass').val()
        if(pass != cpass){
            $('#re_pass').css("background", "red")
            $('#registerBtn').prop('disabled',true);
        }else{
            $('#re_pass').css("background", "white")
            $('#registerBtn').prop('disabled',false);
        }
    });
    
    //Register User
    $('#registerBtn').click(()=>{
        	
        //alert("HI");

        var fname             = $('#fname').val()
        var lname             = $('#lname').val()
        var email             = $('#email').val()
        var birthday          = $('#date_of_birth').val()
        var trn               = $('#trn').val()
        var address           = $('#Address').val()
        var number            = $('#number').val()
        var additional_number = $('#additional_number').val()
        var gender            = $('#gender').val()
        var pass              = $('#pass').val()
        var cpass             = $('#re_pass').val()
        var ques              = $('#ques').val()
        var ans               = $('#ans').val()
        var r_name            = $('#r_name').val()
        var r_address         = $('#r_address').val()
        var r_phone           = $('#r_phone').val()
        var r_email           = $('#r_email').val()


        //var trn = $('#trn').val()
       // var delivery_address = $('#delivery_address').val()
        
        
        var form = "RegistrationForm";
        if(pass === cpass && fname != '' && lname !='' && email != '' && birthday != '' && trn != '' && address != '' && number != ''
        && gender!= '' && pass != '' && ques!= '' && ans!= '' && r_name != '' && r_phone!= '' && r_email!= ''


            ){
            $.ajax({
                type: "POST",
                url: "functions/user-login.php",             
                dataType: "html",
                data:{
                    form:form,
                    fname:fname,
                    lname:lname,
                    email:email,
                    birthday:birthday,
                    trn:trn,
                    address:address,
                    number:number,
                    additional_number:additional_number,
                    gender:gender,
                    pass:pass,
                    cpass:cpass,
                    ques:ques,
                    ans:ans,
                    r_name:r_name,
                    r_address:r_address,
                    r_phone:r_phone,
                    r_email:r_email

                },
                beforeSend: function () {
                    $('#registerBtn').prepend('<div class="spinner-border text-dark"></div>')
                    $('#registerBtn').attr('disabled', true)
                },                
                success: function(response){               
                    alert(response);
                    window.location = window.location
                },
                complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                    $('#registerBtn div').remove('.spinner-border')
                    $('#registerBtn').attr('disabled', false)
                    
                },
                error: function(error){
                    alert(error)
                }
            });
        }else{
            alert('Password Not Matched!')
        }
    });
    // login user
    $('#LoginBtn').click(()=>{
        var email = $('#login_email').val()
        var pass = $('#login_pass').val()
        var form = "LoginForm"
        $.ajax({
            type: "POST",
            url: "functions/user-login.php",             
            dataType: "html",
            data:{
                form:form,
                email:email,
                pass:pass
            },
            beforeSend: function () {
                $('#LoginBtn').prepend('<div class="spinner-border text-dark"></div>')
            },                
            success: function(response){
                if(response == 1){
                    window.location = window.location
                }else{
                    $('#formLogin .alert').remove()
                    $('#formLogin').prepend(
                    '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<b>'+response+'</b>'+
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
                    '</div>')
                }
            },
            complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                $('#LoginBtn div').remove('.spinner-border')
            },
            error: function(error){
                alert(error)
            }
        });
    });
    
    //Contact Us FOrm
    $('#form-submit').click(()=>{
        	
        var name        = $('#name').val()
        var email       = $('#emailAddress').val()
        var message     = $('#message').val()
        var form        = "ContactUsForm";
        
        if(name != '' && email != '' && message != ''){
            
            $.ajax({
                type: "POST",
                url: "functions/user-login.php",             
                dataType: "html",
                data:{
                    form:form,
                    name:name,
                    email:email,
                    message:message
                },
                beforeSend: function () {
                    $('#form-submit').prepend('<div class="spinner-border text-dark"></div>')
                    $('#form-submit').attr('disabled', true)
                },                
                success: function(response){               
                    if(response == 1){
                        alert("Message Sent!!")
                        $('#name').val('')
                        $('#emailAddress').val('')
                        $('#message').val('')
                    }else{
                        alert("Message not Send please try it again!!")
                    }
                },
                complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                    $('#form-submit div').remove('.spinner-border')
                    $('#form-submit').attr('disabled', false)
                    
                },
                error: function(error){
                    alert(error)
                }
            });
        }
    });
    /* Write code Here For email */

    $('#email').blur(function(){

    	var email = $('#email').val();
    	var form  = "checkEmail";
    	if(email!='')
    	{

    		$.ajax({
                type: "POST",
                url: "functions/user-login.php",             
                dataType: "html",
                data:{
                    form  : form,
                    email : email
                },

                success: function(response){
                if(response == 1){
                    //email is unique
                    	$('#email_msg').html("email is Unique")
    					$('#email_msg').css("color", "green")
                        $('#registerBtn').prop('disabled',false);
    					

                }else{
                    //email is not unique
                    	$('#email_msg').html("Email alrady in use Please enter a new one")
    					$('#email_msg').css("color", "red")
    					$('#email').focus()
                        $('#registerBtn').prop('disabled',true);
                }
            },
           
            error: function(error){
                alert(error.statusText)
            }

    		});

    	}
    	
    	
    	

    	
    });
})