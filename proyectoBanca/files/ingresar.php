<?php
include "header.php";
?>
<div class="caja-negra">
    <div class="numeros">
        <span class="numero-activo">Ingresar Dinero</span>
    </div>
</div>
<!-- Ingresar Dinero -->
<h2>Ingresar Dinero</h2>
<form method="POST" action="../controlador/procesar.php?action=ingresar">
    <label for="cantidad">Cantidad:</label>
    <input type="number" name="cantidad" id="cantidad" required><br>
    <button type="submit">Ingresar</button>
</form>
</body>
</html>