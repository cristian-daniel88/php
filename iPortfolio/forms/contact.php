<?php

use PHPMailer\PHPMailer\PHPMailer;

require_once "PHPMailer.php";
require_once "SMTP.php";
require_once "Exception.php";

$name = $_POST["name"];
$subject = $_POST["subject"];
$email = $_POST["email"];
$message = $_POST["message"];

$mail = new PHPMailer(true);

try {
    
    $mail->isSMTP();                                            
    $mail->Host       = 'smtp.ionos.co.uk';                     
    $mail->SMTPAuth   = true;                                  
    $mail->Username   = 'mail@cristianherrera.co.uk';                     
    $mail->Password   = '';                               
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            
    $mail->Port       = 465;                                   

    //Recipients
    $mail->setFrom('mail@cristianherrera.co.uk', 'from cristianherrera.co.uk');
    $mail->addAddress('cristian.daniel.herrera@hotmail.com');              
    

 

    //Content
    $mail->isHTML(true);                                  
    $mail->Subject = $subject;
    $mail->Body    =  '
    <body>
    <style>
      div, a , b {
        font-size: 20px;
      }
      .container {
       margin: auto;
       height: auto;
       border: solid 3px black;
       border-radius: 10px;
       padding: 10px;
      }
      .details {
          margin-bottom : 20px;
          font-style: italic;
      }
    </style>
    <div class="container bg-transparent">
      <h2>Email from cristianherrera.co.uk</h2>
      <hr>
      <div><b>Name: </b>'.$name.'</div>
      <br>
      <div><b>Subject: </b>'.$subject.'</div>
      <br>
      <div><b>Email: </b> <a href="mailto:'.$email.'?subject = Feedback&body = Message">'.$email.'</a></div>
      <br>
      <div><b>Message: </b></div>
      <div class="details">'.$message.'</div>
    </div>
    </body>';


    $mail->send();
    exit(json_encode(array("status" => "sent")));
    
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}



?>
