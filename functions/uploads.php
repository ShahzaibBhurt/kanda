<?php
include("db_con.php");

if(isset($_POST['artist_name'])){
    
    $test = explode('.', $_FILES["file"]["name"]);
    $artist_name = $con -> real_escape_string($_POST['artist_name']);
    $description = $con -> real_escape_string($_POST['description']);
    $ext = end($test);
    $name = $artist_name . '.' . $ext;
    $location = '../img/artists/' . $name;
    $DBlocation = 'img/artists/' . $name;  
    move_uploaded_file($_FILES["file"]["tmp_name"], $location);

    $insert = "INSERT INTO `artists`(`name`, `description`, `picture`)
     VALUES ('$artist_name', '$description', '$DBlocation')";
    $res = mysqli_query($con, $insert);

    if($res > 0){
        echo 'Saved'; //'<img src="functions/'.$location.'" height="150" width="225" class="img-thumbnail" />';
    }else{
        echo mysqli_error($con);
    }
}
if(isset($_FILES["productImg"]["name"])){
    
    $test = explode('.', $_FILES["productImg"]["name"]);
    $productCategory = $con -> real_escape_string($_POST['productCategory']);
    $paintingName = $con -> real_escape_string($_POST['paintingName']);
    $productDescription = $con -> real_escape_string($_POST['productDescription']);
    $productSize = $con -> real_escape_string($_POST['productSize']);
    $artistName = $con -> real_escape_string($_POST['artistName']);
    $productPrice = $con -> real_escape_string($_POST['productPrice']);
    $date = date('Y-m-d');
    $ext = end($test);
    $name = $paintingName . '.' . $ext;
    $location = '../img/products/' . $name;
    $DBlocation = 'img/products/' . $name;  
    move_uploaded_file($_FILES["productImg"]["tmp_name"], $location);

    $insert = "INSERT INTO `products`(`picture`, `category`, `name`, `description`, `size`, `artist_name`, `price`, `date`)
     VALUES ('$DBlocation', '$productCategory', '$paintingName', '$productDescription', '$productSize', '$artistName', '$productPrice', '$date')";
    
    $res = mysqli_query($con, $insert);

    if($res > 0){
        echo 'Saved';
    }else{
        echo mysqli_error($con);
    }
}
?>