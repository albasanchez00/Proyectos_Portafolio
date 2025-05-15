<?php
if (!isset($_SESSION["usuario"])){
include "header.php";
?>
<div class="caja-negra">
    <div class="numeros">
        <span class="numero-activo">Cambiar Pin</span>
    </div>
</div>
<div class="caja-blanca">
    <!-- Cambiar PIN -->
    <h2>Cambiar PIN</h2>
    <form method="POST" action="../controlador/procesar.php?action=cambiar_pin">
        <label for="nuevoPin">Nuevo PIN:</label>
        <input type="password" name="nuevoPin" id="nuevoPin" required><br>
        <button type="submit">Cambiar PIN</button>
    </form>
    <?php
    }else{
        echo "Usuario no autorizado para esta acción";
    }
    ?>
</div>
</body>
</html>

