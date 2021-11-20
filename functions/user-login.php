<?php
include("db_con.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
require ('PHPMailer/src/PHPMailer.php');
require ('PHPMailer/src/SMTP.php');

if($_POST['form'] == "RegistrationForm"){
    $fname              = $con -> real_escape_string($_POST['fname']);
    $lname              = $con -> real_escape_string($_POST['lname']);
    $email              = $con -> real_escape_string($_POST['email']);
    $birthday           = $con -> real_escape_string($_POST['birthday']);
    $trn                = $con -> real_escape_string($_POST['trn']);
    $address            = $con -> real_escape_string($_POST['address']);
    $number             = $con -> real_escape_string($_POST['number']);
    $additional_number  = $con -> real_escape_string($_POST['additional_number']);
    $gender             = $con -> real_escape_string($_POST['gender']);
    $pass               = $con -> real_escape_string($_POST['pass']);
    $que                = $con -> real_escape_string($_POST['ques']);
    $ans                = $con -> real_escape_string($_POST['ans']);
    $r_name             = $con -> real_escape_string($_POST['r_name']);
    $r_address          = $con -> real_escape_string($_POST['r_address']);
    $r_phone            = $con -> real_escape_string($_POST['r_phone']);
    $r_email            = $con -> real_escape_string($_POST['r_email']);
    $dateTime           = date('Y-m-d');
    $role               = "user";


    /*$trn = $con -> real_escape_string($_POST['trn']);
    $delivery_address = $con -> real_escape_string($_POST['delivery_address']);*/
    
    
    

    /*$insert = "INSERT INTO `users`(`fname`, `lname`, `email`, `address`, `trn`, `delivery_address`, `birthday`, `number`, `password`, `role`, `account_cre_date`)
     VALUES ('$fname', '$lname', '$email', '$address', '$trn', '$delivery_address', '$birthday', '$number', '".md5($pass)."', '$role', '$dateTime')";*/

     $insert = "INSERT INTO users (fname,lname,email,birthday,trn,address,number,additional_number,gender, password,question,answer,recv_name,recv_address,recv_phone,recv_email,account_cre_date,role) VALUES(

        '$fname','$lname','$email','$birthday','$trn','$address','$number','$additional_number','$gender','".md5($pass)."','$que','$ans','$r_name','$r_address','$r_phone','$r_email','$dateTime','$role')";
    $res = mysqli_query($con, $insert);


    if($res > 0){
        date_default_timezone_set("Asia/Karachi");
        $date_time =date("l-d-F-Y-h:i:s A");
        $token_number = bin2hex(openssl_random_pseudo_bytes(50));
        $insert = "INSERT INTO tokens(email,token_number,date_time) VALUES('$email','".htmlspecialchars($token_number,true)."','".htmlspecialchars($date_time,true)."')"; 
            $res = mysqli_query($con, $insert);
            if($res)
            {   
                $mail = new PHPMailer();
                $mail->isSMTP();
                $mailSMTP =SMTP::DEBUG_SERVER;
                $mail->Host='smtp.gmail.com';
                $mail->Port = 465;
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->SMTPAuth = true;
                $mail->Username = 'do_not_reply@kacourier.com';
                $mail->Password = 'Admin2020';
                $mail->setFrom('do_not_reply@kacourier.com','K&A EXPRESS');
                //$mail->addReplyTo('nobodynobody00099@gmail.com','NOBODY');
                $mail->addAddress($email,'');
                $mail->Subject = "Email verification link for K&A EXPRESS";
                $mail->msgHTML("Thank you for joining K&A EXPRESS's smaller package network.<br><br> You made the right choice to have your packages and parcels delivered to you, but first, click on the <a href=\"http://localhost/Shahzaib%20Project/k&a2/functions/email_verification.php?token=" . $token_number . "&email=$email\">link here</a> as we need to verify your identity before you can start saving on shipping.<br><br>Thank you again, and we look forward to serving you!");

                   if($mail->send())
                   {
                    echo "Account Created Successfully Please Check your Email To verify your account";    
                   }
                   else
                   {
                    echo "EMAIL ERROR";
                   } 

                        
            }

        
    }else{
        echo mysqli_error($con);
    }
}

if($_POST['form'] == "AdminAddForm"){
    $email              = $con -> real_escape_string($_POST['email']);
    $pass               = $con -> real_escape_string($_POST['pass']);
    $role               = $con -> real_escape_string($_POST['role']);

    $insert = "INSERT INTO users (email,password,role, fname, is_verified) VALUES('$email','".md5($pass)."','$role','$role', 1)";
    $res = mysqli_query($con, $insert);
    if($res > 0){
        echo "Account Created!!";
    }else{
        echo mysqli_error($con);
    }
}

if($_POST['form'] == "LoginForm"){
    $email = $con -> real_escape_string($_POST['email']);
    $pass = $con -> real_escape_string($_POST['pass']);
    $password = md5($pass);

    $select = "SELECT `id`, is_verified FROM `users` WHERE `email` = '$email' AND `password` = '$password' LIMIT 1";
    $res = mysqli_query($con, $select);

    if(mysqli_num_rows($res) > 0){
        $row = mysqli_fetch_assoc($res);
        if($row['is_verified'] == 1){
            session_start();
            $_SESSION['login_userID'] = $row['id'];
            echo 1;
        }else{
            echo "Your Account is not verified!!";
        }
    }else{
        if(mysqli_error($con)){
            echo mysqli_error($con);
        }else{
            echo "Incorrect email or password!";
        }
    }
}

if($_POST['form']=="checkEmail"){
    $email = $con->real_escape_string($_REQUEST['email']);
    $select = "SELECT `id` FROM `users` WHERE `email` = '$email'";
    $res = mysqli_query($con, $select);

    if(mysqli_num_rows($res) > 0){
       
        echo 0;
    }else{
        if(mysqli_error($con)){
            echo mysqli_error($con);
        }else{
            echo 1;
        }
    }




     
}

if($_POST['form'] == "ContactUsForm"){
    $name              = $con -> real_escape_string($_POST['name']);
    $email             = $con -> real_escape_string($_POST['email']);
    $message           = nl2br($_POST['message']);  
    
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mailSMTP =SMTP::DEBUG_SERVER;
    $mail->Host='smtp.gmail.com';
    $mail->Port = 465;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPAuth = true;
    $mail->Username = 'do_not_reply@kacourier.com';
    $mail->Password = 'Admin2020';
    $mail->setFrom('do_not_reply@kacourier.com','K&A EXPRESS');
    //$mail->addReplyTo('nobodynobody00099@gmail.com','NOBODY');
    $mail->addAddress('shazaibbhurt@gmail.com');
    $mail->Subject = "Someone Contacted you from K&A EXPRESS";
    $mail->msgHTML("Name: ".$name."<br>Email: ".$email."<br><br>Message: ".$message);

    if($mail->send()){
        echo 1;    
    }else{
        echo 0;
    } 
}

if($_POST['form'] == "udUpdateForm"){
    $address            = $con -> real_escape_string($_POST['address']);
    $r_address          = $con -> real_escape_string($_POST['r_address']);

    $update = "UPDATE users set address='$address',recv_address='$r_address'";
    $res = mysqli_query($con, $update);

    if($res > 0){
        echo "Address Updated!!";
    }else{
        echo mysqli_error($con);
    }
}

?>