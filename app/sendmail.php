<?php

  // include necessary files
  use PHPMailer\PHPMailer\PHPMailer ;
  use PHPMailer\PHPMailer\Exception;

  require 'phpmailer/src/Exception.php';
  require 'phpmailer/src/PHPMailer.php';

  // declare
  $mail = new PHPMailler(true) ;
  $mail->CharSet = 'UTF-8';
  $mail->setLanguage('ru', 'phpmailer/language/');
  $mail->IsHTML(true);

  // FROM
  $mail->setFrom('info@fls.guru', 'OpwnaHcep no xv3HH');
  // TO WHOM
  $mail->addAddress('code@fls.guru');
  // TOPIC
  $mail->Subject = 'Hi!' ;

  // body

  $body = '<h1>Meet</h1>';

  if(trim(!empty($_POST['name']))){
    $body.='<p><strong>Name:</strong> '.$_POST['name'].'</p>';
  }
  if(trim(!empty($_POST['email']))){
    $body.='<p><strong>Email:</strong> '.$_POST['email'].'</p>';
  }
  if(trim(!empty($_POST['message']))){
    $body.='<p><strong>Message:</strong> '.$_POST['message'].'</p>';
  }

  $mail->Body = $body;

  // send
  if (!$mail->send()) {
    $message = "Error";
  } else {
    $message = "Your message was send succesfully!";
  }

  $response = ['message' => $message];

  header('Content-type: application/json');
  echo json_encode($response);

?>