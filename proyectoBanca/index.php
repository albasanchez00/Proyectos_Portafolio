<?php
// Insertamos la cabecera
include "files/header.php";
?>

<div class="caja-negra">
    <div class="numeros">
        <span class="numero-activo">Ingresar al Banco</span>
    </div>
</div>
<div class="caja-blanca">

    <!-- Validación de Usuario -->
    <h3>Iniciar Sesión</h3>
    <form method="post" action="/proyectoBanca/controlador/procesar.php" class="formulario">
        <label for="nombre"></label>
        <input type="text" name="nombre" id="nombre" placeholder="Nombre:" required><br>
        <label for="pin"></label>
        <input type="password" placeholder="PIN:" name="pin" id="pin" required><br>
        <input type="submit" value="Iniciar Sesión" class="boton">
    </form>
    <?php
    if (!empty($_GET["mensaje"])){
        echo $_GET["mensaje"];
    }
    ?>
</div>
</body>
</html>

