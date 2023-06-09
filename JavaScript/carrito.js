/* Carrito */
let carritoIcono = document.querySelector(`#car`);
let carritoMostrar = document.querySelector(`.carritoCompras`);
let cerrarCarrito = document.querySelector(`#cerrar-carrito`);



carritoIcono.onclick = () => {
    carritoMostrar.classList.add("active");
}
cerrarCarrito.onclick = () => {
    carritoMostrar.classList.remove("active");
}
