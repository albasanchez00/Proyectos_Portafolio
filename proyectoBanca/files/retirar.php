<?php
include "/proyectoBanca/files/header.php";
?>
<div class="caja-negra">
    <div class="numeros">
        <span class="numero-activo">Retirar Dinero</span>
    </div>
</div>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="/proyectoBanca/css/style.css"> <!-- Enlace opcional a CSS -->

</head>
<body>
<!-- Ingresar Dinero -->
<h2>Ingresar Dinero</h2>
<form method="POST" action="/proyectoBanca/controlador/procesar.php?action=sacar">
    <label for="cantidad">Cantidad:</label>
    <input type="number" name="cantidad" id="cantidad" required><br>
    <button type="submit">Ingresar</button>
</form>
</body>
</html>