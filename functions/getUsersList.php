<?php
include("db_con.php");

$select = "SELECT id, `fname`, `lname`, `email` FROM `users`  WHERE role='user' ORDER BY `id` DESC";
    $res = mysqli_query($con, $select);

    if (mysqli_num_rows($res) > 0) {
        //$arr = array(
        while($row = mysqli_fetch_assoc($res)) {
            $arr[]=  array($row['email'],$row['fname'], $row['lname'], $row['email']);
       }
        echo json_encode(array('data' => $arr));
    }else{
        echo mysqli_error($con);
    }
?>