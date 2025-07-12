let productos = JSON.parse(localStorage.getItem('productos')) || [];
let carritoIDs = JSON.parse(localStorage.getItem('carrito')) || [];
let historialPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

const contador = document.getElementById('contador-carrito');
const modalCarrito = document.getElementById('modal-carrito');
const btnAbrirCarrito = document.getElementById('abrir-carrito');
const btnCerrarCarrito = document.getElementById('cerrar-modal');
const contenidoCarrito = document.getElementById('contenido-productos');
const totalCarrito = document.getElementById('total-carrito');

const btnAbrirHist = document.getElementById('abrir-historial');
const modalHist = document.getElementById('modal-historial');
const btnCerrarHist = document.getElementById('cerrar-historial');
const contHist = document.getElementById('contenedor-historial');

// Construir carrito con cantidades
function construirCarrito() {
  const mapa = new Map();
  carritoIDs.forEach(id => {
    if (mapa.has(id)) mapa.get(id).cantidad++;
    else {
      const prod = productos.find(p => p.id === id);
      if (prod) mapa.set(id, { ...prod, cantidad: 1 });
    }
  });
  return Array.from(mapa.values());
}

function actualizarContador() {
  contador.textContent = carritoIDs.length;
}

function renderCarrito() {
  const carrito = construirCarrito();
  contenidoCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach(p => {
    const div = document.createElement('div');
    div.className = 'producto-carrito';
    div.innerHTML = `
      <span>${p.nombre}</span>
      <div class="controles">
        <button onclick="cambiarCantidad(${p.id}, -1)">–</button>
        <span>${p.cantidad}</span>
        <button onclick="cambiarCantidad(${p.id}, 1)">+</button>
        <button onclick="eliminarDelCarrito(${p.id})">🗑️</button>
        <span>Precio: $${p.precio.toFixed(2)}</span>
      </div>
    `;
    contenidoCarrito.appendChild(div);
    total += p.precio * p.cantidad;
  });

  totalCarrito.textContent = total.toFixed(2);
}

function abrirModal(m) { m.classList.add('abierto'); }
function cerrarModal(m) { m.classList.remove('abierto'); }

btnAbrirCarrito?.addEventListener('click', () => {
  carritoIDs = JSON.parse(localStorage.getItem('carrito')) || [];
  renderCarrito();
  abrirModal(modalCarrito);
});

btnCerrarCarrito?.addEventListener('click', () => cerrarModal(modalCarrito));

// Confirmar compra → crear pedido + limpiar carrito
document.getElementById('confirmar')?.addEventListener('click', () => {
  const carrito = construirCarrito();
  if (!carrito.length) return alert("🛒 El carrito está vacío");

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0).toFixed(2);
  const pedido = {
    id: historialPedidos.length + 1,
    fecha: new Date().toLocaleString(),
    productos: carrito,
    total
  };

  historialPedidos.push(pedido);
  localStorage.setItem('pedidos', JSON.stringify(historialPedidos));
  localStorage.removeItem('carrito');
  carritoIDs = [];
  actualizarContador();
  renderCarrito();

  mostrarPopupCompra("🎉 Gracias por su compra");

function mostrarPopupCompra(texto) {
  const popup = document.getElementById('mensaje-compra');
  popup.textContent = texto;
  popup.classList.remove('hidden');
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
    popup.classList.add('hidden');
   }, 3000); // se oculta después de 3 segundos
 }
  cerrarModal(modalCarrito);
});

// Render historial de pedidos
btnAbrirHist?.addEventListener('click', () => {
  contHist.innerHTML = '';
  if (!historialPedidos.length) {
    contHist.innerHTML = '<p>No hay pedidos registrados.</p>';
    abrirModal(modalHist);
    return;
  }

  historialPedidos.forEach(p => {
    const div = document.createElement('div');
    div.className = 'pedido';
    div.innerHTML = `
      <h3>Pedido #${p.id} – ${p.fecha}</h3>
      <ul>
        ${p.productos.map(x => `
          <li>${x.nombre} ×${x.cantidad} – $${(x.precio * x.cantidad).toFixed(2)}</li>
        `).join('')}
      </ul>
      <strong>Total: $${p.total}</strong>
      <button class="eliminar-btn" onclick="eliminarPedido(${p.id})">Eliminar</button>
    `;
    contHist.appendChild(div);
  });

  abrirModal(modalHist);
});

btnCerrarHist?.addEventListener('click', () => cerrarModal(modalHist));

// Eliminar pedido del historial
function eliminarPedido(id) {
  historialPedidos = historialPedidos.filter(p => p.id !== id);
  localStorage.setItem("pedidos", JSON.stringify(historialPedidos));
  renderHistorial();
}

// Reusable
function renderHistorial() {
  const contHist = document.getElementById('contenedor-historial');
  const historialPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

  contHist.innerHTML = '';
  if (!historialPedidos.length) {
    contHist.innerHTML = '<p>No hay pedidos registrados.</p>';
    return;
  }

  historialPedidos.forEach(p => {
    const div = document.createElement('div');
    div.className = 'pedido';
    div.innerHTML = `
      <h3>Pedido #${p.id} – ${p.fecha}</h3>
      <ul>
        ${p.productos.map(x => `
          <li>${x.nombre} ×${x.cantidad} – $${(x.precio * x.cantidad).toFixed(2)}</li>
        `).join('')}
      </ul>
      <strong>Total: $${p.total}</strong>
    `;
    contHist.appendChild(div);
  });
}
document.getElementById('abrir-historial')?.addEventListener('click', () => {
  renderHistorial();
  document.getElementById('modal-historial')?.classList.add('show');
});

document.getElementById('cerrar-historial')?.addEventListener('click', () => {
  document.getElementById('modal-historial')?.classList.remove('show');
});

function eliminarDelCarrito(id) {
  carritoIDs = carritoIDs.filter(x => x !== id);
  localStorage.setItem('carrito', JSON.stringify(carritoIDs));
  actualizarContador();
  renderCarrito();
}
// Auto-actualiza contador
actualizarContador();