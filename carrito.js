const carrito = [];
let historialPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

const botonesAgregar = document.querySelectorAll('.agregar');
const contador = document.getElementById('contador-carrito');
const modal = document.getElementById('modal-carrito');
const abrir = document.getElementById('abrir-carrito');
const cerrar = document.getElementById('cerrar-modal');
const contenido = document.getElementById('contenido-productos');
const total = document.getElementById('total-carrito');
const abrirHistorial = document.getElementById('abrir-historial');
const cerrarHistorial = document.getElementById('cerrar-historial');
const modalHistorial = document.getElementById('modal-historial');

// Agregar producto al carrito
botonesAgregar.forEach(btn => {
  btn.addEventListener('click', () => {
    const producto = btn.parentElement;
    const nombre = producto.querySelector('h2').textContent;
    const precio = parseFloat(producto.querySelector('p').textContent.replace('$',''));
    const existe = carrito.find(p => p.nombre === nombre);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }
    actualizar();
  });
});

// Abrir y cerrar carrito
abrir.addEventListener('click', () => {
  modal.classList.add('abierto');
  mostrarCarrito();
});

cerrar.addEventListener('click', () => {
  modal.classList.remove('abierto');
});

function actualizar() {
  contador.textContent = carrito.reduce((a, p) => a + p.cantidad, 0);
}

function mostrarCarrito() {
  contenido.innerHTML = '';
  carrito.forEach((producto, index) => {
    const div = document.createElement('div');
    div.className = 'producto-carrito';
    div.innerHTML = `
      <span>${producto.nombre}</span>
      <div class="controles">
        <button onclick="cambiarCantidad(${index}, -1)">–</button>
        <span>${producto.cantidad}</span>
        <button onclick="cambiarCantidad(${index}, 1)">+</button>
        <button onclick="eliminar(${index})">🗑️</button>
      </div>
    `;
    contenido.appendChild(div);
  });
  total.textContent = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0).toFixed(2);
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  actualizar();
  mostrarCarrito();
}

function eliminar(index) {
  carrito.splice(index, 1);
  actualizar();
  mostrarCarrito();
}

// Confirmar compra y guardar pedido
document.getElementById('confirmar').addEventListener('click', () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const productosPedido = carrito.map(p => ({ ...p }));
  const totalPedido = productosPedido.reduce((s, p) => s + p.precio * p.cantidad, 0).toFixed(2);

  const pedido = {
    id: historialPedidos.length + 1,
    fecha: new Date().toLocaleString(),
    productos: productosPedido,
    total: totalPedido
  };

  historialPedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(historialPedidos));

  carrito.length = 0;
  actualizar();
  mostrarCarrito();
  alert(`¡Gracias por tu compra! Tu pedido #${pedido.id} ha sido guardado.`);
});

// Mostrar historial
document.getElementById('abrir-historial').addEventListener('click', mostrarHistorialPedidos);

function mostrarHistorialPedidos() {
  const historial = JSON.parse(localStorage.getItem("pedidos")) || [];
  const contenedor = document.getElementById("contenedor-historial");
  contenedor.innerHTML = '';

  if (historial.length === 0) {
    contenedor.innerHTML = "<p>No hay pedidos registrados aún.</p>";
    return;
  }

  historial.sort((a, b) => a.id - b.id);

  historial.forEach(p => {
    const div = document.createElement("div");
    div.className = "pedido";
    div.innerHTML = `
      <h3>Pedido #${p.id} – ${p.fecha}</h3>
      <ul>
        ${p.productos.map(prod => `<li>${prod.nombre} × ${prod.cantidad} – $${prod.precio}</li>`).join('')}
      </ul>
      <strong>Total: $${p.total}</strong><br>
      <button class="eliminar-btn" onclick="eliminarPedido(${p.id})">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}

function eliminarPedido(id) {
  historialPedidos = historialPedidos.filter(p => p.id !== id);
  localStorage.setItem("pedidos", JSON.stringify(historialPedidos));
  mostrarHistorialPedidos();
}

abrirHistorial.addEventListener('click', () => {
  mostrarHistorialPedidos();
  modalHistorial.classList.add('abierto');
});

cerrarHistorial.addEventListener('click', () => {
  modalHistorial.classList.remove('abierto');
});
