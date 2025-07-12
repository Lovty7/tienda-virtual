//let productos = JSON.parse(localStorage.getItem('productos')) || [];

function cargaProductosPublico() {
  const contenedor = document.getElementById('contenedorProductos');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  productos.forEach(p => {
    contenedor.innerHTML += `
      <div class="producto" data-id="${p.id}">
        <img src="${p.imagen}" alt="${p.nombre}" />
        <h3>${p.nombre}</h3>
        <p>${p.detalle}</p>
        <span>$${p.precio.toFixed(2)}</span>
        <button class="btn-confirmar">Agregar al carrito</button>
      </div>
    `;
  });
  
  document.addEventListener('click', e => {
  if (e.target.classList.contains('btn-confirmar')) {
    const productoDiv = e.target.closest('.producto');
    const id = parseInt(productoDiv.getAttribute('data-id'));

    const productoSeleccionado = productos.find(p => p.id === id);
    if (!productoSeleccionado) {
      console.error("❌ Producto no encontrado por ID:", id);
      return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(productoSeleccionado.id); // solo el id
    localStorage.setItem('carrito', JSON.stringify(carrito));
    document.getElementById('contador-carrito').textContent = carrito.length;

    alert(`🛒 Agregado: ${productoSeleccionado.nombre}`);
  }
});

}