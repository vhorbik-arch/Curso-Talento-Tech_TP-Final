/* =====================================================
            CARRITO DE COMPRAS - "CHANGUITO"
    ===================================================== */

// Inventario de productos de Valya PyroArt (los reales)
let productos = [
    { nombre: "Gatito", precio: 7500, stock: 5, item_id: 1 },
    { nombre: "Corazón", precio: 7000, stock: 6, item_id: 2 },
    { nombre: "Gnomo", precio: 7500, stock: 5, item_id: 3 },
    { nombre: "Mesa", precio: 165000, stock: 1, item_id: 4 },
    { nombre: "Mate", precio: 25000, stock: 3, item_id: 5 },
    { nombre: "Cuadro", precio: 58000, stock: 1, item_id: 6 },
	{ nombre: "Tabla", precio: 155000, stock: 1, item_id: 7 },
	{ nombre: "Pirograbador", precio: 222000, stock: 2, item_id: 8 },
	{ nombre: "Calendario", precio: 1000, stock: 10, item_id: 9 }
];

// El carrito es un array vacío al inicio
let changuito = [];

// Clave para guardar en localStorage
const CLAVE_CARRITO = "changuito";

/* =====================================================
    FUNCIÓN 1: GUARDAR CARRITO EN MEMORIA DEL NAVEGADOR
    ===================================================== */
function guardarChanguito() {
    // localStorage solo guarda TEXTO, no objetos
    // JSON.stringify() convierte el array a texto
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(changuito));
    console.log("✓ Changuito guardado en localStorage");
}

/* =====================================================
    FUNCIÓN 2: CARGAR CARRITO QUE ESTABA GUARDADO
    ===================================================== */
function cargarChanguito() {
    // Busca si hay algo guardado con esa clave
    let guardado = localStorage.getItem(CLAVE_CARRITO);

    // Si existe, lo convierte de texto a array (lo contrario a stringify)
    if (guardado) {
        changuito = JSON.parse(guardado);
        console.log("✓ Changuito cargado desde localStorage");
    }
}

/* =====================================================
    FUNCIÓN 3: AGREGAR UN PRODUCTO AL CARRITO
    ===================================================== */
function agregarAlChanguito(producto) {
    // 1. Buscamos si el item ya existe en el changuito
    let encontrado = changuito.find(item => item.item_id === producto.item_id);

    // 2. CONTROL DE STOCK
    // Si ya existe en el carrito y la cantidad llegó al límite de stock...
    if (encontrado && encontrado.cantidad >= producto.stock) {
        Swal.fire({
            icon: "warning",
            title: "¡Disculpas!",
            text: `No quedan más unidades de ${producto.nombre}. Nuestro stock actual es de ${producto.stock} unidades.`,
            confirmButtonColor: "#933eee"
        });
        return; // Corta la ejecución de la función acá, no agrega nada
    }
    
    // Si es el primero que agrega pero justo el stock de ese producto es 0 (por las dudas)
    if (!encontrado && producto.stock <= 0) {
        Swal.fire({
            icon: "error",
            title: "Sin stock",
            text: "Este artículo se encuentra agotado por el momento.",
            confirmButtonColor: "#933eee"
        });
        return;
    }

    // 3. Si pasó el control de stock, seguimos normalmente
    if (encontrado) {
        encontrado.cantidad++;
        console.log("✓ Se sumó una unidad a: " + encontrado.nombre);
    } else {
        changuito.push({
            item_id:  producto.item_id,
            nombre:   producto.nombre,
            precio:   producto.precio,
            cantidad: 1
        });
        console.log("✓ " + producto.nombre + " agregado por primera vez");
    }
    
    actualizarChanguito();


// --- CONTROL VISUAL DE BOTONES EN EL CATÁLOGO ---
let botonesAgregar = document.querySelectorAll(".btn-agregar");

botonesAgregar.forEach(boton => {
    let indice = boton.getAttribute("data-indice");
    let prodCatalogo = productos[indice];
    
    // Buscamos si este producto ya está en el changuito
    let enCarrito = changuito.find(item => item.item_id === prodCatalogo.item_id);
    
    // Si ya está en el carrito y alcanzó el stock máximo disponible
    if (enCarrito && enCarrito.cantidad >= prodCatalogo.stock) {
        boton.disabled = true;
        boton.textContent = "Agotado 🚫";
        boton.style.backgroundColor = "#ccc"; // Color gris de deshabilitado
        boton.style.cursor = "not-allowed";
    } else {
        // Si todavía hay stock o se quitaron unidades, lo dejamos normal
        boton.disabled = false;
        boton.textContent = "Agregar";
        boton.style.backgroundColor = "#933eee"; // Tu color original
        boton.style.cursor = "pointer";
    }
});


}


/* =====================================================
    FUNCIÓN 4: CALCULAR EL TOTAL DEL CARRITO
    ===================================================== */
function calcularTotal() {
    let total = 0;

    // Recorre cada producto en el changuito
    for (let producto of changuito) {
    // Multiplicamos el precio por la cantidad de ese producto
    total += producto.precio * producto.cantidad;
}

    // Retorna el número final
    return total;
}

/* =====================================================
    FUNCIÓN 5: MOSTRAR CARRITO EN LA CONSOLA 
    ===================================================== */
function mostrarChanguito() {
    console.log("=== PRODUCTOS EN EL CHANGUITO ===");
    
    if (changuito.length === 0) {
        /*console.log("El changuito está vacío");*/
		
		/*Swal.fire("El changuito está vacío!");*/
		
    } else {
        for (let producto of changuito) {
            console.log(producto.nombre + " - $" + producto.precio);
        }
    }
}


/* =====================================================
    FUNCIÓN 6: DIBUJAR PRODUCTOS EN LA PÁGINA
    ===================================================== */
function mostrarProductos() {
    // Busca el elemento UL donde irán los productos
    let lista = document.getElementById("lista-productos");
    lista.innerHTML = "";  // Lo limpia primero

    // Por cada producto en el array
    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];

        // Crea un elemento LI para cada producto
        let item = document.createElement("li");
        item.className = "producto-item";

        // Arma el HTML del producto con su botón
        item.innerHTML =
            "<span class='producto-nombre'>" + producto.nombre + "</span>" +
            "<span class='producto-precio'>$" + producto.precio + "</span>" +
            "<button class='btn-agregar' data-indice='" + i + "'>Agregar</button>";

        // Lo agrega a la lista
        lista.appendChild(item);
    }

    // Ahora le asigna el evento "click" a cada botón
    let botones = document.querySelectorAll(".btn-agregar");

    for (let boton of botones) {
        boton.addEventListener("click", function () {
            // Cuando cliqueas, obtiene el índice del producto
            let indice = boton.getAttribute("data-indice");
            // Y lo agrega al changuito
            agregarAlChanguito(productos[indice]);
        });
    }
}

/* =====================================================
    FUNCIÓN 7: QUITAR UN PRODUCTO DEL CARRITO
    ===================================================== */
function quitarDelChanguito(indice) {
    let producto = changuito[indice];
    
    // Si la cantidad es mayor a 1, solo restamos una unidad
    if (producto.cantidad > 1) {
        producto.cantidad--;
        console.log("✓ Se quitó una unidad de: " + producto.nombre);
    } else {
        // Si queda solo uno, lo borramos por completo del array
        changuito.splice(indice, 1);
        console.log("✓ " + producto.nombre + " eliminado del changuito");
    }
    
    // Actualizamos la pantalla y guardamos el estado
    actualizarChanguito();
}

/* =====================================================
    FUNCIÓN 8: VACIAR EL CARRITO COMPLETO
    ===================================================== */
function vaciarChanguito() {
    // Deja el array totalmente vacío
    changuito = [];
    console.log("✓ Changuito vacío");
    
    // Actualiza la pantalla
    actualizarChanguito();
}

/* =====================================================
    FUNCIÓN 9: GENERAR EL TICKET DE COMPRA
    ===================================================== */
function generarTicket() {
    // Obtiene la fecha y hora actual
    let ahora = new Date();
    let fecha = ahora.toLocaleDateString('es-AR');
    let hora = ahora.toLocaleTimeString('es-AR');

    // Empieza a armar el ticket como texto
    let ticketTexto = "═══════════════════════════════\n";
    ticketTexto += "     TICKET DE COMPRA\n";
    ticketTexto += "═══════════════════════════════\n\n";
    
    ticketTexto += "Fecha: " + fecha + "\n";
    ticketTexto += "Hora:  " + hora + "\n";
    ticketTexto += "\n───────────────────────────────\n\n";

    // Si el carrito está vacío
    if (changuito.length === 0) {
        ticketTexto += "     CARRITO VACÍO\n\n";
    } else {
        // Agrega cada producto del carrito
        for (let i = 0; i < changuito.length; i++) {
            let producto = changuito[i];
            let nombre = producto.nombre;
            let precio = producto.precio;
            
            // Formato: "Producto        $Precio"
            ticketTexto += nombre + " ".repeat(20 - nombre.length) + "$" + precio + "\n";
        }
    }

	let subtotal = calcularTotal();
    let iva = subtotal * 0.21;
    let totalConIva = subtotal + iva;

    ticketTexto += "\n───────────────────────────────\n";
    ticketTexto += "SUBTOTAL: $" + subtotal.toFixed(2) + "\n";
    ticketTexto += "IVA (21%):$" + iva.toFixed(2) + "\n";
    ticketTexto += "TOTAL:    $" + totalConIva.toFixed(2) + "\n";
    ticketTexto += "═══════════════════════════════\n\n";
    
    ticketTexto += "    ¡Gracias por tu compra!\n";
    ticketTexto += "   Valya PyroArt Buenos Aires\n"; 
    ticketTexto += "═══════════════════════════════\n";

    return ticketTexto;
}

function actualizarChanguito() {
    // Busca los elementos del HTML donde mostrar el carrito
    let listaCarrito = document.getElementById("items-carrito");
    let totalTexto = document.getElementById("total-carrito");
    let cantidadTexto = document.getElementById("cantidad-carrito");
    let areaTicket = document.getElementById("ticket-display");

    // Limpia la lista anterior
    listaCarrito.innerHTML = "";

    // Si el carrito está vacío, muestra un mensaje
    if (changuito.length === 0) {
        listaCarrito.innerHTML = "<li class='carrito-vacio'>Tu changuito está vacío 🛒</li>";
    } else {
        // Si hay productos, los muestra uno por uno
        for (let i = 0; i < changuito.length; i++) {
            let producto = changuito[i];

            // Crea un LI para cada producto del carrito
            let item = document.createElement("li");
            item.className = "carrito-item";

            // Arma el HTML con el producto y un botón para eliminarlo
	item.innerHTML =
		"<span class='item-nombre'>" + producto.nombre + " x " + producto.cantidad + "</span>" +
		"<span class='item-precio'>$" + (producto.precio * producto.cantidad) + "</span>" +
		"<button class='btn-quitar' data-indice='" + i + "'>✕</button>";

            // Lo agrega a la lista del carrito
            listaCarrito.appendChild(item);
        }

        // Asigna el evento "click" a los botones de quitar
        let botonesQuitar = document.querySelectorAll(".btn-quitar");

        for (let boton of botonesQuitar) {
            boton.addEventListener("click", function () {
                // Obtiene el índice del producto a eliminar
                let indice = boton.getAttribute("data-indice");
                // Y lo quita
                quitarDelChanguito(indice);
            });
        }
    }

    // Actualiza la cantidad de items
    cantidadTexto.textContent = changuito.length;

    // Actualiza el TICKET en tiempo real
    if (areaTicket) {
        areaTicket.textContent = generarTicket();
    }

    // --- NUEVO: TOTAL CON IVA ABAJO DEL CARRITO ---
    let neto = calcularTotal();
    let totalFinal = neto * 1.21;
    totalTexto.textContent = "$" + totalFinal.toFixed(2);

    // IMPORTANTE: Guarda el estado en localStorage
    guardarChanguito();

    // También lo muestra en la consola para verificar
    mostrarChanguito();
}
    

/* =====================================================
    FUNCIÓN 10: FINALIZAR COMPRA (SIMULADO)
    ===================================================== */
function finalizarCompra() {
    if (changuito.length === 0) {
        alert("Tu changuito está vacío. Agregá productos antes de pagar.");
        return;
    }

    // Calculamos el total final con IVA para el cartel
    let totalFinal = calcularTotal() * 1.21;

    Swal.fire({
        title: "¡Gracias por tu compra!",
        html: "Total a pagar (IVA inc.): <strong>$" + totalFinal.toFixed(2) + "</strong><br><br><small>* Este pago es SIMULADO.</small>",
        iconHtml: '<i class="fa-solid fa-cart-shopping" style="color: #933eee; font-size: 3rem;"></i>',
        customClass: {
            icon: 'border-0'
        },
        confirmButtonText: "Entendido",
        confirmButtonColor: "#933eee"
    }).then((result) => {
        if (result.isConfirmed) {
            vaciarChanguito();
            console.log("✓ Compra finalizada con éxito y pantalla limpia.");
        }
    });
}

/* =====================================================
    FUNCIÓN 11: CUANDO CARGA LA PÁGINA (ARRANQUE)
    ===================================================== */
document.addEventListener("DOMContentLoaded", function () {
    console.log("=== PÁGINA CARGADA ===");
    
    // 1. Primero carga el changuito que estaba guardado
    cargarChanguito();

    // 2. Dibuja los productos disponibles
    mostrarProductos();
    
    // 3. Actualiza el carrito en pantalla
    actualizarChanguito();

    // 4. Asigna los eventos a los botones principales
    let botonVaciar = document.getElementById("btn-vaciar");
    let botonPagar = document.getElementById("btn-pagar");

    // Si existen, les asigna las funciones
    if (botonVaciar) {
        botonVaciar.addEventListener("click", vaciarChanguito);
    }
    if (botonPagar) {
        botonPagar.addEventListener("click", finalizarCompra);
    }
});
