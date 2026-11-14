// 1. Configuración de la API con tu clave real de GNews
const API_KEY = '88a690b7d88532a15a5e2f20f29a8d86';
const URL_API = `https://gnews.io/api/v4/top-headlines?category=general&lang=es&max=9&apikey=${API_KEY}`;

// 2. Referencias a los elementos del DOM
const contenedorNoticias = document.getElementById('contenedor-noticias');
const mensajeEstado = document.getElementById('mensaje-estado');
const btnRefrescar = document.getElementById('btn-refrescar');

// 3. Función asíncrona que utiliza Fetch para obtener noticias en formato JSON
async function obtenerNoticias() {
    // Limpiar estado previo e indicar que está cargando
    mensajeEstado.className = 'mensaje-estado';
    mensajeEstado.textContent = 'Cargando noticias actualizadas...';
    contenedorNoticias.innerHTML = '';

    try {
        // Petición HTTP mediante Fetch
        const respuesta = await fetch(URL_API);

        // Verificar si la respuesta HTTP fue exitosa (código 200-299)
        if (!respuesta.ok) {
            throw new Error(`Error en la API (Código: ${respuesta.status}). Verifica tu límite de peticiones.`);
        }

        // Convertir la respuesta a formato JSON
        const datos = await respuesta.json();

        // Validar si existen artículos disponibles
        if (!datos.articles || datos.articles.length === 0) {
            mensajeEstado.textContent = 'No hay noticias disponibles en este momento.';
            return;
        }

        // Limpiar mensaje de carga y renderizar las noticias
        mensajeEstado.textContent = '';
        mostrarNoticias(datos.articles);

    } catch (error) {
        // Manejo de posibles errores (sin internet, API caída, etc.)
        mensajeEstado.className = 'mensaje-estado mensaje-error';
        mensajeEstado.textContent = `Ocurrió un problema al cargar las noticias: ${error.message}`;
        console.error('Detalle del error:', error);
    }
}

// 4. Función para manipular el DOM y mostrar las noticias extraídas del JSON
function mostrarNoticias(articulos) {
    articulos.forEach(noticia => {
        // Crear la tarjeta contenedora
        const tarjeta = document.createElement('article');
        tarjeta.className = 'tarjeta-noticia';

        // Imagen por defecto si la noticia no trae fotografía
        const imagenUrl = noticia.image || 'https://via.placeholder.com/400x200?text=Sin+Imagen';
        
        // Formatear la fecha de publicación
        const fecha = new Date(noticia.publishedAt).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Construir el HTML interno (el título es un enlace para leer la noticia completa)
        tarjeta.innerHTML = `
            <img src="${imagenUrl}" alt="Imagen de la noticia">
            <div class="contenido-noticia">
                <h2 class="titulo-noticia">
                    <a href="${noticia.url}" target="_blank" rel="noopener noreferrer">
                        ${noticia.title}
                    </a>
                </h2>
                <p class="descripcion-noticia">${noticia.description || 'Haz clic en el título para leer la nota completa.'}</p>
                <div class="fuente-fecha">
                    <strong>${noticia.source.name}</strong> • ${fecha}
                </div>
            </div>
        `;

        contenedorNoticias.appendChild(tarjeta);
    });
}

// 5. Evento para refrescar las noticias sin recargar la página completa
btnRefrescar.addEventListener('click', obtenerNoticias);

// 6. Cargar las noticias automáticamente al abrir la página
document.addEventListener('DOMContentLoaded', obtenerNoticias);