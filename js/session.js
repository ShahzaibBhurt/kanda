$(document).ready(function(){
    //checking session
    $.ajax({
        type: "GET",
        url: "functions/session.php",
        dataType: "html",                
        success: function(response){
            if(response != 0){
                $('#signInBtn').remove()
                $('#signUpBtn').remove()
                $('#nav-menu').append(response)
            }
            $("#udUpdate").submit(function(e){
                e.preventDefault()
            })
            
            //Update User data
            $('#udUpdateBtn').click(()=>{

                var address           = $('#Address').val()
                var r_address         = $('#r_address').val()
                var form              = "udUpdateForm";

                if(address != '' && r_address != ''){

                    $.ajax({
                        type: "POST",
                        url: "functions/user-login.php",             
                        dataType: "html",
                        data:{
                            form:form,
                            address:address,
                            r_address:r_address
                        },
                        beforeSend: function () {
                            $('#udUpdateBtn').prepend('<div class="spinner-border text-dark"></div>')
                            $('#udUpdateBtn').attr('disabled', true)
                        },                
                        success: function(response){               
                            alert(response);
                        },
                        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                            $('#udUpdateBtn div').remove('.spinner-border')
                            $('#udUpdateBtn').attr('disabled', false)

                        },
                        error: function(error){
                            alert(error)
                        }
                    });
                }
            });
        }
    });
})