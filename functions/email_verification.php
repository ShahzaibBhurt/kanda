<?php
	include("db_con.php");
	if(isset($_REQUEST['token']) && isset($_REQUEST['email']))
	{
		$email = $_REQUEST['email'];
		$token = $_REQUEST['token'];
		 $query = "SELECT * FROM tokens WHERE email = '".$email."' AND token_number = '".$token."' ";
		
		$res = mysqli_query($con, $query);

		if($res)
		{

			 $query = "UPDATE users SET is_verified = 1 WHERE email = '".$email."' ";
			
			$res = mysqli_query($con, $query);
			if($res)
			{?>
				<center>
					<div style="width: 30%; height: 100px; background-color: green; color: white;">
						Your Account has been Verified You can now access your account
					</div>	
				</center>
			<?php 
				 $query = "DELETE FROM tokens WHERE email = '".$email."' AND token_number = '".$token."'";
				
				$res = mysqli_query($con, $query);	
			}
		}	

	}
?>