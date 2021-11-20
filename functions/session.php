<?php
session_start();// Starting Session
include("db_con.php");
// Storing Session

if(isset($_GET['page'])){
    if($_GET['page'] == "dashboard" && isset($_SESSION['login_userID'])){

        $userID = $_SESSION['login_userID'];
        $select = mysqli_query($con, "SELECT `fname`, `email`, `role` from users WHERE `id` = '$userID'");
    
        if (mysqli_num_rows($select) > 0) {
            $row = mysqli_fetch_assoc($select); 
            $login_name = $row['fname'];
            $role = $row['role'];
     
            if($role == 'admin' || $role == 'subadmin'){
                echo 2;
            }else if($role == 'editor'){
                echo 1;
            }else if($role == 'viewer'){
                echo 0;
            }else{
                echo null;
            }
        }else{
            echo null;
        }
    
    }else if($_GET['page'] == "signup"){
        if(isset($_SESSION['login_userID']) != ''){
           echo 'index.html'; 
        }
        
    }else{
        echo 'index.html';
    }
}else{
    if(isset($_SESSION['login_userID'])){

        $userID = $_SESSION['login_userID'];
        $select = mysqli_query($con, "SELECT `fname`, `lname`, `email`, `birthday`, `address`, `number`, `recv_name`, `recv_address`, `recv_phone`, `recv_email`, `trn`, `role` from users WHERE `id` = '$userID'");
    
        if (mysqli_num_rows($select) > 0) {
            $row = mysqli_fetch_assoc($select); 
            $login_name = $row['fname'];
            $role = $row['role'];
            
            if($role != 'user'){
                echo '<li class="nav-item">
                        <a class="nav-link" href="dashboard.html">'.$login_name.'</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="functions/logout.php">Logout</a>
                      </li>';
            }else{
                $lname = $row['lname'];
                $email = $row['email'];
                $birthday = $row['birthday'];
                $address = $row['address'];
                $number = $row['number'];
                $recv_name = $row['recv_name'];
                $recv_address = $row['recv_address'];
                $recv_phone = $row['recv_phone'];
                $recv_email = $row['recv_email'];
                $trn = $row['trn'];
                echo '<li class="nav-item">
                        <a class="nav-link" data-toggle="modal"data-target="#udata" title="See Your Details">'.$login_name.'</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="functions/logout.php">Logout</a>
                      </li>
                      <!-- The Modal -->
                      <div class="modal fade" id="udata">
                        <div class="modal-dialog modal-xl">
                          <div class="modal-content">

                            <!-- Modal Header -->
                            <div class="modal-header">
                              <h3 class="modal-title">User Details</h3>
                              <button type="button" class="close" data-dismiss="modal">×</button>
                            </div>

                            <!-- Modal body -->
                            <div class="modal-body">
                                <form id="udUpdate" method="post">
                                <div class="row"style="margin-top: 20px;margin-bottom: 20px;">
                                    <div class="col-sm-4">
                                        <div class="form-group">
                                            <label for="fname">First Name</label>
                                            <input type="text" class="form-control" value="'.$login_name.'" required disabled >
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="form-group">
                                            <label for="lname">Last Name</label>
                                            <input type="text" class="form-control" value="'.$lname.'" required disabled>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="form-group">
                                            <label for="email">Email Address</label>
                                            <input type="email" class="form-control" value="'.$email.'" required disabled>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="form-group">
                                            <label for="date_of_birth">Date Of Birth</label>
                                            <input type="date" class="form-control" value="'.$birthday.'" required disabled> 
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="form-group">
                                            <label for="trn">Tax Registration Number</label>
                                            <input type="text" class="form-control" value="'.$trn.'" required disabled> 
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="form-group">
                                            <label for="number">Your Phone Number</label>
                                            <input type="number" class="form-control" value="'.$number.'"required disabled>
                                        </div>
                                    </div>
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <label for="Address">Your Complete Address </label>
                                            <input type="text" class="form-control" id="Address" value="'.$address.'"required>
                                        </div>
                                    </div>
                                    <div class="col-sm-12" align="center">
                                        <h4 style="display: -webkit-inline-box;background-color: #f9f6f6;padding: 0px 5px; font-weight: 700;color: gray;"> Receiver Information </h4>
                                        <hr style="margin-top: -20px;border: 1px solid darkgray;">
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="r_name">Name</label>
                                            <input type="text" class="form-control" value="'.$recv_name.'" required disabled>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="r_address">Receiver Full Address including Country</label>
                                            <input type="text" class="form-control" id="r_address" value="'.$recv_address.'" required>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="r_phone">Phone</label>
                                            <input type="number" class="form-control" placeholder=" Include area code and no dashes or spaces" value="'.$recv_phone.'" required disabled>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label for="r_email">Email</label>
                                            <input type="email" class="form-control" value="'.$recv_email.'" disabled>
                                        </div>
                                    </div>
                                    <div class="col-sm-12"align="right">
                                        <button type="submit" id="udUpdateBtn" class="btn btn-outline-primary" name="subBTN">UPDATE</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Modal footer -->
                            <div class="modal-footer">
                              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>

                          </div>
                        </div>
                      </div>';
            }
        }else{
            echo 0;
        }
    }
}
?>