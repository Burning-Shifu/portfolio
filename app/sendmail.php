<?php

  // ini_set('display_errors', 1);
  // ini_set('display_startup_errors', 1);
  // error_reporting(E_ALL);

  // include necessary files
  use PHPMailer\PHPMailer\PHPMailer ;
  use PHPMailer\PHPMailer\Exception;
  use PHPMailer\PHPMailer\SMTP;

  require 'phpmailer/src/Exception.php';
  require 'phpmailer/src/PHPMailer.php';
  require 'phpmailer/src/SMTP.php';

  try {
    // declare
    $mail = new PHPMailer(true) ;
    $mail->CharSet = 'UTF-8';
    $mail->setLanguage('ru', 'phpmailer/language/');
    $mail->IsHTML(true);
    $mail->IsSMTP();  // telling the class to use SMTP

    // Specify main and backup SMTP servers
    $mail->Host = 'smtp.gmail.com'; // SMTP server
    $mail->SMTPAuth = true;  // turn on SMTP authentication
    $mail->Username = 'bububume@gmail.com';  // SMTP username
    $mail->Password = 'cuejtuqvafehdbzo'; // SMTP password
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // FROM
    $mail->setFrom('bububume@gmail.com', 'From my Portfolio website');
    // TO WHOM
    $mail->addAddress('kris.deniso@mail.ru');
    // TOPIC
    $mail->Subject = 'Message from my portfolio website' ;

    // body

    $body = '<h1>:з</h1>';

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
  } catch (Exception $e) {
    $message = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
  }

  $response = ['message' => $message];

  header('Content-type: application/json');
  echo json_encode($response);

?>