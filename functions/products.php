<?php
include("db_con.php");
if(isset($_POST['category'])){
    $category = $_POST['category'];

    $select = "SELECT * FROM `products` WHERE `category`='$category'";
    $res = mysqli_query($con, $select);

    if (mysqli_num_rows($res) > 0) {
        while($row = mysqli_fetch_assoc($res)) {
            $arr[] = $row;
        }
        echo json_encode(array('data' => $arr));
    }else{
        echo 0;
    }
}
if(isset($_GET['productID'])){
    $id = $_GET['productID'];

    $select = "SELECT p.`id`, p.`picture`, p.`category`, p.`name`, p.`description`, p.`size`, p.`artist_name`, a.description as artist_des, a.picture as artist_pic, p.`price` FROM `products` p INNER JOIN artists a ON p.`artist_name` = a.name WHERE p.id = '$id'";
    $res = mysqli_query($con, $select);

    if (mysqli_num_rows($res) > 0) {
        $row = mysqli_fetch_assoc($res);
        echo json_encode(array('data' => $row));
    }else{
        echo 0;
    }
}
?>