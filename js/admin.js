document.addEventListener('DOMContentLoaded', () => {
  const btnAbrir       = document.getElementById('btnAbrirModal');
  const modal          = document.getElementById('modalAgregar');
  const btnCerrarModal = document.getElementById('btnCerrarModal');
  const btnCerrarFooter= document.getElementById('btnCerrarFooter');
  const form           = document.getElementById('formAgregarProducto');

  console.log("✅ admin.js cargado correctamente");

  // Abrir modal
  btnAbrir?.addEventListener('click', () => {
    modal.classList.add('show');
  });

  // Cerrar modal
  btnCerrarModal?.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  btnCerrarFooter?.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Procesar formulario de nuevo producto
  form?.addEventListener('submit', e => {
    e.preventDefault();

    const nombre  = document.getElementById('nombre')?.value.trim();
    const detalle = document.getElementById('detalle')?.value.trim();
    const precio  = parseFloat(document.getElementById('precio')?.value);
    const imagen  = document.getElementById('imagen')?.files[0];

    if (!nombre || !detalle || isNaN(precio) || !imagen) {
      alert("⚠️ Completa todos los campos correctamente.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const producto = {
        id: Date.now(),
        nombre,
        detalle,
        precio,
        imagen: reader.result
      };

      const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
      productosGuardados.push(producto);
      localStorage.setItem('productos', JSON.stringify(productosGuardados));

      alert("✅ Producto agregado con éxito");
      form.reset();
      modal.classList.remove('show');
    };

    reader.onerror = () => {
      alert("❌ Error al procesar la imagen.");
      console.error("Error al leer la imagen:", reader.error);
    };

    reader.readAsDataURL(imagen);
  });
  document.getElementById('verStock')?.addEventListener('click', () => {
  const productos = JSON.parse(localStorage.getItem('productos')) || [];

  if (!productos.length) {
    alert("No hay productos registrados");
    return;
  }

  let mensaje = "📋 Inventario actual:\n\n";
  productos.forEach(p => {
    mensaje += `🛒 ${p.nombre}\nPrecio: $${p.precio.toFixed(2)}\nStock: ${p.stock ?? 'sin definir'}\n\n`;
  });

  alert(mensaje);
  });
  const modalStock = document.getElementById('modalStock');
  const cerrarStock = document.getElementById('cerrarStock');
  const cerrarFooterStock = document.getElementById('cerrarFooterStock'); 
  const contenidoStock = document.getElementById('contenidoStock'); 

  document.getElementById('verStock')?.addEventListener('click', () => {
  const productos = JSON.parse(localStorage.getItem('productos')) || [];
  contenidoStock.innerHTML = '';

  if (!productos.length) {
    contenidoStock.innerHTML = '<p>No hay productos en el inventario.</p>';
  } else {
    productos.forEach(p => {
      const bloque = document.createElement('div');
      bloque.style.marginBottom = '1rem';
      bloque.innerHTML = `
        <strong>🛒 ${p.nombre}</strong><br>
        Precio: $${p.precio.toFixed(2)}<br>
        Stock: ${p.stock ?? 'sin definir'}
      `;
      contenidoStock.appendChild(bloque);
    });
  }

  modalStock.classList.add('show');
  });

  [cerrarStock, cerrarFooterStock].forEach(btn =>
  btn?.addEventListener('click', () => modalStock.classList.remove('show'))
 );
});