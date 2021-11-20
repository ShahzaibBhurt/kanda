$(document).ready(function () {
    let checking = 0;
    //checking session
    $.ajax({
        type: "GET",
        url: "functions/session.php",
        data: {
            page: "dashboard"
        },             
        dataType: "html",                
        success: function(res){
            if(res == null){
                window.location = 'index.html'
            }else{
                //alert(res)
                checking = res;
                getUsers();
                getUsersList(); 
                getAdmins();
            }
        }
    });
    //get Users data
    function getUsers(){
        //alert(checking)
        editor = new $.fn.dataTable.Editor( {
		ajax: "functions/datatable/controllers/staff.php",
		table: "#UsersTable",
		fields: [ {
				label: "First name:",
				name: "fname"
			}, {
				label: "Last name:",
				name: "lname"
			}, {
				label: "Email:",
				name: "email"
			}, {
				label: "Address:",
				name: "address"
			}, {
				label: "Birthday:",
				name: "birthday",
				type: "date"
			}, {
				label: "Tax Registration Number:",
				name: "trn"
			}, {
				label: "Number:",
				name: "number"
			}, {
				label: "Additional Number:",
				name: "additional_number"
			}, {
				label: "Gender:",
				name: "gender",
                type: 'select',
                options: ['Male', 'Female']
			}, {
				label: "Reciever Name:",
				name: "recv_name"
			}, {
				label: "Reciever Address:",
				name: "recv_address"
			}, {
				label: "Reciever Phone:",
				name: "recv_phone"
			}, {
				label: "Reciever Email:",
				name: "recv_email"
			}
		]
	} );
    if(checking == 0){
        //remove admins
        $('#manageAdmins').html('');
        //romeve btn
        $('#updatesBtn').remove()
        
        $('#UsersTable').DataTable( {
		dom: "Bfrtip",
		ajax: "functions/datatable/controllers/staff.php",
		columns: [
            { data: "id" },
			{ data: "fname"},
            { data: "lname"},
            { data: "email"},
            { data: "address"},
            { data: "birthday"},
            { data: "trn"},
            { data: "number"},
            { data: "additional_number"},
            { data: "gender"},
            { data: "recv_name"},
            { data: "recv_address"},
            { data: "recv_phone"},
            { data: "recv_email"},
            { data: "account_cre_date"}
		],
        select: false,
        buttons:[]
	} );
    }else if(checking == 1){
        //remove admins
        $('#manageAdmins').html('');
        //romeve btn
        $('#updatesBtn').remove()
        
        $('#UsersTable').DataTable( {
		dom: "Bfrtip",
		ajax: "functions/datatable/controllers/staff.php",
		columns: [
            { data: "id" },
			{ data: "fname"},
            { data: "lname"},
            { data: "email"},
            { data: "address"},
            { data: "birthday"},
            { data: "trn"},
            { data: "number"},
            { data: "additional_number"},
            { data: "gender"},
            { data: "recv_name"},
            { data: "recv_address"},
            { data: "recv_phone"},
            { data: "recv_email"},
            { data: "account_cre_date"}
		],
        select: true,
        buttons:[{ extend: "edit",   editor: editor }]
	} );
    }else if(checking == 2){
        $('#UsersTable').DataTable( {
		dom: "Bfrtip",
		ajax: "functions/datatable/controllers/staff.php",
		columns: [
            { data: "id" },
			{ data: "fname"},
            { data: "lname"},
            { data: "email"},
            { data: "address"},
            { data: "birthday"},
            { data: "trn"},
            { data: "number"},
            { data: "additional_number"},
            { data: "gender"},
            { data: "recv_name"},
            { data: "recv_address"},
            { data: "recv_phone"},
            { data: "recv_email"},
            { data: "account_cre_date"}
		],
        select: true,
        buttons:[
                    { extend: "edit",   editor: editor },
                    { extend: "remove", editor: editor }
                ]
	} );
    }
	
    }
    // configure users table
    
    //get Users List
    function getUsersList(){
        var table = $('#usersList').DataTable({
            'ajax': 'functions/getUsersList.php',
            'columnDefs': [
             {
                'targets': 0,
                'checkboxes': {
                    'selectRow': true
                }
             }
          ],
          'select': {
             'style': 'multi'
          },
          'order': [[1, 'asc']]
       });

        // Handle form submission event
       $('#sendingEmails').on('submit', function(e){
          var form = this;
          var rows_selected = table.column(0).checkboxes.selected();
          var EmailsArray = [];
          // Iterate over all selected checkboxes
          $.each(rows_selected, function(index, rowId){
              EmailsArray[index] = rowId;
          });    
          
          e.preventDefault();
          
          var subject = $('#subject').val()
          var msg     = $('#msg').val()
          
            $.ajax({
                type: "POST",
                url: "functions/process.php",             
                dataType: "html",
                data:{
                    data:"sendingEmails",
                    subject:subject,
                    msg:msg,
                    Emails:EmailsArray
                },
                beforeSend: function () {
                    $('#EmailSenderBtn').prepend('<div class="spinner-border text-dark"></div>')
                    $('#EmailSenderBtn').attr('disabled', true)
                },                
                success: function(response){  
                    if(response == ''){
                        alert("EMAIL SENT!!");
                    }else{
                        alert(response);
                    }
                    
                   // window.location = window.location
                },
                complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                    $('#EmailSenderBtn div').remove('.spinner-border')
                    $('#EmailSenderBtn').attr('disabled', false)
                    
                },
                error: function(error){
                    alert(error)
                }
            });
    //});
       });   
    }
    
    //get CurrentUser data
    $.ajax({
        type: "POST",
        url: "functions/process.php",
        data:{
            data: "getCurrentUser"
        },             
        dataType: "json",                
        success: function(data){
            if(data != 0){
                $('#fname').val(data["data"][0]["fname"])
                $('#lname').val(data["data"][0]["lname"])
                $('#email').val(data["data"][0]["email"])
            }else{
                alert(data)
            }
        }
    });
    function getAdmins(){
        $.ajax({
            type: "POST",
            url: "functions/process.php",
            data:{
                data: "getAdmins"
            },             
            dataType: "json",                
            success: function(data){
                $('#adminsList tbody').html('');
                if(data != 0){
                    for(var x in data["data"]) {
                        $('#adminsList tbody').append(`<tr>
                            <td><i class="fas fa-trash" id="${data["data"][x]["id"]}"></i></td>
                            <td>${data["data"][x]["email"]}</td>
                            <td>${data["data"][x]["role"]}</td>
                        </tr>`);
                    }
                }else{
                    alert(data)
                }
                 $('#adminsList').on('click', '.fa-trash', function(){
                    
                    var id = this.id
                    var c = confirm("Are you sure you want to delete this Admin if you click 'OK' then the record will be delete permanently")
                    if(c==true){
                        $.ajax({
                            type: "POST",
                            url: "functions/process.php",
                            data:{
                                data: "DeleteAdmin",
                                id:id
                            },             
                            dataType: "html",                
                            success: function(data){
                                if(data != 0){
                                    getAdmins();
                                }else{
                                    alert("Not Deleted!")
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    
    // block form
    $("#admin_edit, #add_admin").submit(function(e){
        e.preventDefault()
    })
    // checking passwords
    $('#re_pass').on('keyup', function(){
        var pass = $('#pass').val()
        var cpass = $('#re_pass').val()
        if(pass != cpass){
            $('#re_passLab').css("color", "red")
        }else{
            $('#re_passLab').css("color", "black")
        }
    })
  //edit admin
    $('#form-btn').click(()=>{
        var fname = $('#fname').val()
        var lname = $('#lname').val()
        var email = $('#email').val()
        var old_pass = $('#old_pass').val()
        var pass = $('#pass').val()
        var cpass = $('#re_pass').val()
        var form = "admin_edit"
        if(pass === cpass && old_pass != '' && fname != '' && lname != '' && email != ''){
            $.ajax({
                type: "POST",
                url: "functions/process.php",             
                dataType: "html",
                data:{
                    data:form,
                    fname:fname,
                    lname:lname,
                    email:email,
                    old_pass:old_pass,
                    pass:pass
                },
                beforeSend: function () {
                    $('#form-btn').prepend('<div class="spinner-border text-dark"></div>')
                    $('#form-btn').attr('disabled', true)
                },                
                success: function(response){
                    alert(response);
                },
                complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                    $('#form-btn div').remove('.spinner-border')
                    $('#form-btn').attr('disabled', false)
                },
                error: function(error){
                    alert(error)
                }
            });
        }else{
            $('#regFormAlert').append("<b>Password Not Matched!</b>")
            $('#regFormAlert').addClass("show")
        }
    })
    
    //checking passwords from dashboard page
    $('#admin_re_pass').keyup(function(){
        var pass    =   $('#admin_pass').val();
        var cpass   =   $('#admin_re_pass').val();
        if(pass!=cpass){
             $("#admin_re-passLab").css({"color" : "red"});
             $("#admin_re_pass").css({"border-color" : "red","color" : "red"});
            $('#admin_form-btn').attr('disabled', true); //disable input
        }
        else{
            $("#admin_re-passLab").css({"color" : "black"});
            $("#admin_re_pass").css({"border" : "1px solid #ccc","color" : "black"});
            $('#admin_form-btn').removeAttr('disabled'); //enable input

        }
    });
    //Register Admin
    $('#AddAdminBTN').click(()=>{
        	
        var email = $('#Admin_email').val()
        var pass  = $('#admin_pass').val()
        var cpass  = $('#admin_re_pass').val()
        var role  = $('#role').val()
        var form  = "AdminAddForm";
        
        if(pass == cpass && email != '' && pass != '' && role!= ''){
            $.ajax({
                type: "POST",
                url: "functions/user-login.php",             
                dataType: "html",
                data:{
                    form:form,
                    email:email,
                    pass:pass,
                    role:role
                },
                beforeSend: function () {
                    $('#AddAdminBTN').prepend('<div class="spinner-border text-dark"></div>')
                    $('#AddAdminBTN').attr('disabled', true)
                },                
                success: function(response){               
                    alert(response);
                    $('#Admin_email').val('')
                    $('#admin_pass').val('')
                    $('#admin_re_pass').val('')
                    $('#role').val('')
                },
                complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                    $('#AddAdminBTN div').remove('.spinner-border')
                    $('#AddAdminBTN').attr('disabled', false)
                    getAdmins();
                },
                error: function(error){
                    alert(error)
                }
            });
        }else{
            $('#regFormAlert').append("<b>Password Not Matched!</b>")
            $('#regFormAlert').addClass("show")

        }
    });
    
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});