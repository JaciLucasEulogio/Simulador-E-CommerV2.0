class Producto {
    constructor(producto,cantidad){
        this.id=producto.id;
        this.nombre=producto.nombre;
        this.precio=producto.precio;
        this.stock=producto.stock;
        this.imagen=producto.imagen;
        this.subTotal=producto.subTotal;
        this.cantidad=cantidad;
    }
    sumarCantidadComprada(){
        this.stock--;
        this.cantidad++;
    }
    restarCantidadComprada(){
        this.cantidad--;
        this.stock++;
    }
    actualizarSubTotal(){
        this.subTotal = this.precio*this.cantidad;
    }
}

const productos = `./productos.json`;


async function cargarProductos(){
    const searchInput = document.getElementById('esp-buscar');
    const contenedorProductos = document.getElementById('contenedorProductos');


    const cargarProductos = async () => {
        try {
            const respuesta = await fetch(productos);
            const datos = await respuesta.json();

            datos.forEach(producto => {
                let card = document.createElement("div");
                card.innerHTML = `
                    <div id="caja-producto" class="producto">
                    <img class="producto-imagen" src="${producto.imagen}" alt="">
                    <div class="producto-info">
                        <h3 class="producto-titulo">${producto.nombre}</h3>
                        <p class="producto-precio">S/.${producto.precio} PEN</p>
                        <p class="producto-stock" id="stock${producto.id}">Stock: ${producto.stock} </p>
                        <button id="agregar${producto.id}" class="agregar">Agregar</button>
                    </div>
                    </div>
                `;
                contenedorProductos.appendChild(card);

                let boton = document.getElementById(`agregar${producto.id}`);
                boton.addEventListener("click", () => agregarAlCarrito(producto.id));
            });

            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();

                contenedorProductos.innerHTML = '';

                if (searchTerm !== '') {
                    const filteredProducts = datos.filter(producto =>
                        producto.nombre.toLowerCase().includes(searchTerm)
                    );

                    if (filteredProducts.length > 0) {
                        filteredProducts.forEach(producto => {
                            let card = document.createElement("div");
                            card.innerHTML = `
                                            <div id="caja-producto" class="producto">
                                                <img class="producto-imagen" src="${producto.imagen}" alt="">
                                                <div class="producto-info">
                                                <h3 class="producto-titulo">${producto.nombre}</h3>
                                                <p class="producto-precio">S/.${producto.precio} PEN</p>
                                                <p class="producto-stock" id="stock${producto.id}">Stock: ${producto.stock} </p>
                                                <button id="agregar${producto.id}" class="agregar">Agregar</button>
                                                </div>
                                            </div>
                                            `;
                            contenedorProductos.appendChild(card);

                            let boton = document.getElementById(`agregar${producto.id}`);
                            boton.addEventListener("click", () => agregarAlCarrito(producto.id));
                        });
                    } else {
                        contenedorProductos.innerHTML = 'No se encontraron resultados';
                    }
                } else {
                    datos.forEach(producto => {
                        let card = document.createElement("div");
                        card.innerHTML = `
                            <div id="caja-producto" class="producto">
                            <img class="producto-imagen" src="${producto.imagen}" alt="">
                            <div class="producto-info">
                                <h3 class="producto-titulo">${producto.nombre}</h3>
                                <p class="producto-precio">S/.${producto.precio} PEN</p>
                                <p class="producto-stock" id="stock${producto.id}">Stock: ${producto.stock} </p>
                                <button id="agregar${producto.id}" class="agregar">Agregar</button>
                            </div>
                            </div>
                        `;
                        contenedorProductos.appendChild(card);

                        let boton = document.getElementById(`agregar${producto.id}`);
                        boton.addEventListener("click", () => agregarAlCarrito(producto.id));
                    });
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    cargarProductos();
}

let carrito=[];
let carritoCantidadTotal=0;

function recuperarCarritoStorage(){
    let carritoRecuperado = JSON.parse(localStorage.getItem("carritoEnStorage"));

    if(carritoRecuperado){
        let arreglo=[];
        for(const objetoProducto of carritoRecuperado){
            let productoEnCarrito = new Producto (objetoProducto, objetoProducto.cantidad);
            productoEnCarrito.actualizarSubTotal();
            arreglo.push(productoEnCarrito);
            carritoCantidadTotal += objetoProducto.cantidad;
        }
        imprimirCarrito(arreglo);
        imprimirCantidadTotalCarrito(carritoCantidadTotal);
        return arreglo;
    }
    imprimirCantidadTotalCarrito(carritoCantidadTotal);
    return [];
}

async function agregarAlCarrito(idProducto){
    let productoAgregado = carrito.find((productoYaAgregado)=>productoYaAgregado.id === idProducto);

    const respuesta = await fetch(productos);
    const traido = await respuesta.json();

    if(productoAgregado){
        let indice = carrito.findIndex((elemento) => elemento.id === productoAgregado.id);
        carrito[indice].sumarCantidadComprada();
        carrito[indice].actualizarSubTotal();
        carritoCantidadTotal++;
    }else{
        let prod = new Producto(traido[idProducto], 1)
        carrito.push(prod);
        carritoCantidadTotal++;
    }

    localStorage.setItem("carritoEnStorage",JSON.stringify(carrito));
    imprimirCarrito(carrito);
    imprimirCantidadTotalCarrito(carritoCantidadTotal);
    
    console.log(carrito);
}

function imprimirCantidadTotalCarrito(carritoCantidadTotal) {
    let contenedorCarritoCantidadTotal = document.getElementById("compraTotal");
    contenedorCarritoCantidadTotal.innerHTML =`${carritoCantidadTotal}`;
}

function imprimirCarrito(carritoArreglo){
    let totalPagar = obtenerPrecioTotal(carritoArreglo);
    let contenedorCarrito = document.getElementById("carrito-contenido");
    contenedorCarrito.innerHTML="";

    for(let producto of carritoArreglo){
        let datos = document.createElement("div");
        datos.innerHTML=`
                        <div class="caja-carrito">
                            <img src="${producto.imagen}" class="carrito-img">
                            <div class="caja-detalles">
                            <div class="titulo-producto">${producto.nombre}</div>
                            <div class="precio-producto">${producto.precio}</div>
                            <div class="precio-producto">Cantidad: ${producto.cantidad}</div>
                            </div>

                            <ion-icon id="eliminar${producto.id}" class="remover-cantidad" name="trash-outline"></ion-icon>
                        </div>
                        `;
        contenedorCarrito.appendChild(datos);

        let botonEliminar = document.getElementById(`eliminar${producto.id}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(producto.id))
    }

    let accionesCarrito = document.getElementById("total");
    accionesCarrito.innerHTML=`
                                <div class="titulo-total">Total</div>
                                <div class="total-precio">S/.${totalPagar}</div>
                                <div>
                                <button type="button" onclick="mensaje()" class="btn-comprar" id="btn-comprar">Comprar Ahora</button>
                                <button id="vaciarCarrito" onclick="eliminarCarrito()" type="button" class="btn-comprar">Vaciar Carrito</button>
                                
                                </div>
                                `;
}

function mensaje(){
    const botonComprar = document.getElementById("btn-comprar");
    if(carrito.length){
        botonComprar.addEventListener("click", () =>{
            Swal.fire({
                title: '¿Confirmar compra?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Claro que sí',
                cancelButtonText: 'Aún no'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Compra confirmada',
                        'Muchas gracias por comprar en nuestra tienda.',
                        'success'
                    )
                    eliminarCarrito();
                }
            })
        })
    }else{
        botonComprar.addEventListener("click", () =>{
            Swal.fire('No has seleccionado ningún producto.')
        })
    }
}

function obtenerPrecioTotal(arreglo){
    let total=arreglo.reduce((total,elemento)=>total+elemento.subTotal,0);
    return total.toFixed(2);
}

function eliminarDelCarrito(id){
    let productor = carrito.find((producto)=>producto.id===id);
    let indice = carrito.findIndex((elemento)=>elemento.id===productor.id);
    console.log(productor);
    
    if(productor.cantidad>1){
        carrito[indice].restarCantidadComprada();
        carrito[indice].actualizarSubTotal();
        carritoCantidadTotal--;
    }else{
        carrito.splice(indice,1);
        carritoCantidadTotal--;
    }
    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirCarrito(carrito);
    imprimirCantidadTotalCarrito(carritoCantidadTotal);
}

function eliminarCarrito(){
    carrito=[];
    localStorage.removeItem("carritoEnStorage");
    document.getElementById("carrito-contenido").innerHTML="";
    document.getElementById("total").innerHTML="";
    carritoCantidadTotal=0
    imprimirCantidadTotalCarrito(carritoCantidadTotal);
}

cargarProductos();
carrito = recuperarCarritoStorage();

