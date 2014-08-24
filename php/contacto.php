<?php
error_reporting(-1);
$me = "fili06604@gmail.com";
$nombre = strip_tags($_POST["nombre"]);
$asunto = strip_tags($_POST["asunto"]);
$mensaje = strip_tags($_POST["mensaje"]);
$email = strip_tags($_POST["email"]);

$headers = "MIME-Version:1.0;\r\n";
$headers .= "Content-type: text/html; \r\n charset=utf-8; \r\n";
$headers .= "From: $email \r\n";
$headers .= "To: $me; \r\n Subject:$asunto \r\n";

if(mail($me,$asunto,$mensaje,$headers))
	echo "<script>alert('Enviado correctamente')</script>";

else
	echo "<script>alert('Fallo en el envio')</script>";

?>