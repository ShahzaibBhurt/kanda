<?php
include("db_con.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
require ('PHPMailer/src/PHPMailer.php');
require ('PHPMailer/src/SMTP.php');
require ('PHPMailer/src/Exception.php');

session_start();// Starting Session

if($_POST['data'] == "admin_edit"){
    $fname = $con -> real_escape_string($_POST['fname']);
    $lname = $con -> real_escape_string($_POST['lname']);
    $email = $con -> real_escape_string($_POST['email']);
    $old_pass = $con -> real_escape_string($_POST['old_pass']);
    $pass = $con -> real_escape_string($_POST['pass']);
    $userID = $_SESSION['login_userID'];
    
    $select = "SELECT `password` FROM `users` WHERE `id` = '$userID'";
    $res = mysqli_query($con, $select);
    
    if(mysqli_num_rows($res) > 0){
        $row = mysqli_fetch_assoc($res);
        if(md5($old_pass) === $row['password']){
            if($pass != ''){
                $update = "UPDATE `users` SET `fname`='$fname',`lname`='$lname',`email`='$email',`password`='".md5($pass)."' WHERE `id` = '$userID' AND `password` = '".md5($old_pass)."'";
                mysqli_query($con, $update);
                
                if(mysqli_error($con)){
                    echo mysqli_error($con);
                }else{
                    echo "Profile Updated";
                }
            }else{
                $update = "UPDATE `users` SET `fname`='$fname',`lname`='$lname',`email`='$email' WHERE `id` = '$userID' AND `password` = '".md5($old_pass)."'";
                mysqli_query($con, $update);

                if(mysqli_error($con)){
                    echo mysqli_error($con);
                }else{
                    echo "Profile Updated";
                }
            }
        }else{
            echo "Password Incorrect";
        }
    }
}

if($_POST['data'] == "getCurrentUser"){

    $userID = $_SESSION['login_userID'];
    $select = "SELECT `fname`, `lname`, `email` FROM `users` WHERE `id` = '$userID'";
    $res = mysqli_query($con, $select);

    if (mysqli_num_rows($res) > 0) {
        while($row = mysqli_fetch_assoc($res)) {
            $arr[] = $row;
        }
        echo json_encode(array('data' => $arr));
    }else{
        echo mysqli_error($con);
    }
}

if($_POST['data'] == "getAdmins"){

    $userID = $_SESSION['login_userID'];
    $select = "SELECT id, `email`, role FROM `users` WHERE `id` not in($userID) AND role not in('user', 'admin')";
    $res = mysqli_query($con, $select);

    if (mysqli_num_rows($res) > 0) {
        while($row = mysqli_fetch_assoc($res)) {
            $arr[] = $row;
        }
        echo json_encode(array('data' => $arr));
    }else{
        echo mysqli_error($con);
    }
}

if($_POST['data'] == "DeleteAdmin"){
    $id = $_POST['id'];

    $deleteQuery = "DELETE FROM `users` WHERE `id`='$id'";

    $res = mysqli_query($con, $deleteQuery);

    if($res == 1){
        echo 1;
    }else{
        echo 0;
    }
}

if($_POST['data'] == "sendingEmails"){
    
    $subject = $con -> real_escape_string($_POST['subject']);
    $msg = nl2br($_POST['msg']);
    $Emails = $_POST['Emails'];
    
    foreach($Emails as $email){
     
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mailSMTP =SMTP::DEBUG_SERVER;
        $mail->Host='smtp.1and1.com';
        $mail->Port = 465;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->SMTPAuth = true;
        $mail->Username = 'do_not_reply@kacourier.com';
        $mail->Password = 'Kaadmin2020@';
        $mail->SMTPSecure = 'ssl'; 
        $mail->setFrom('do_not_reply@kacourier.com','MESSAGE FROM K&A EXPRESS');
        //$mail->addReplyTo('Do_Not_Reply@getitship.com','NOBODY');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $msg;

       if($mail->send()){ 
           //echo $msg." msg sent";
       }
       else{
            echo $email." EMAIL NOT SEND ";
       }
    }
}
?>