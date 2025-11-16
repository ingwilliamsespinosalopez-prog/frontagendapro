// Variable global para la sección en edición (para el modal)
let seccionActual = null;

// --- FUNCIONES GLOBALES DE EDICIÓN ---
function activarEdicion(seccion) {
    const contenido = document.getElementById('contenido-' + seccion);
    const botones = document.getElementById('botones-' + seccion);
    const botonEditar = document.getElementById('btn-editar-' + seccion);
    
    if (!contenido || !botones || !botonEditar) return;
    
    contenido.querySelectorAll('.valor-campo').forEach(valor => valor.style.display = 'none');
    contenido.querySelectorAll('.input-edicion').forEach(input => input.style.display = 'block');
    
    botones.style.display = 'flex';
    botonEditar.style.display = 'none';
    console.log('Modo de edición activado para: ' + seccion);
}

function cancelarEdicion(seccion) {
    seccionActual = seccion;
    const modal = document.getElementById('modal-confirmacion');
    if (modal) {
        modal.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }
}

function confirmarCancelacion() {
    const seccion = seccionActual;
    const contenido = document.getElementById('contenido-' + seccion);
    const botones = document.getElementById('botones-' + seccion);
    const botonEditar = document.getElementById('btn-editar-' + seccion);
    
    if (!contenido || !botones || !botonEditar) return;
    
    const valoresCampo = contenido.querySelectorAll('.valor-campo');
    const inputsEdicion = contenido.querySelectorAll('.input-edicion');
    
    inputsEdicion.forEach(input => {
        const campo = input.getAttribute('data-campo');
        const valorOriginal = contenido.querySelector('.valor-campo[data-campo="' + campo + '"]');
        
        if (valorOriginal) {
            input.value = valorOriginal.textContent.trim();
        }
        
        input.style.display = 'none';
        input.style.borderColor = '#d1d1d1';
    });
    
    valoresCampo.forEach(valor => valor.style.display = 'block');
    
    botones.style.display = 'none';
    botonEditar.style.display = 'block';
    cerrarModal();
    console.log('Edición cancelada para: ' + seccion);
}

function cerrarModal() {
    const modal = document.getElementById('modal-confirmacion');
    if (modal) {
        modal.classList.remove('activo');
        document.body.style.overflow = '';
    }
    seccionActual = null;
}

function guardarCambios(seccion) {
    const contenido = document.getElementById('contenido-' + seccion);
    const botones = document.getElementById('botones-' + seccion);
    const botonEditar = document.getElementById('btn-editar-' + seccion);
    
    if (!contenido || !botones || !botonEditar) return;
    
    const inputsEdicion = contenido.querySelectorAll('.input-edicion');
    let todosValidos = true;
    let datosActualizados = {};
    
    inputsEdicion.forEach(input => {
        const valor = input.value.trim();
        const campo = input.getAttribute('data-campo');
        
        if (valor === '') {
            todosValidos = false;
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#d1d1d1';
            datosActualizados[campo] = valor;
        }
    });
    
    if (!todosValidos) {
        window.mostrarNotificacion('Por favor completa todos los campos marcados', 'error');
        return;
    }
    
    // Actualizar los <p> con los nuevos valores de los <input>
    inputsEdicion.forEach(input => {
        const campo = input.getAttribute('data-campo');
        const valorElemento = contenido.querySelector('.valor-campo[data-campo="' + campo + '"]');
        
        if (valorElemento) {
            valorElemento.textContent = input.value.trim();
        }
    });
    
    const valoresCampo = contenido.querySelectorAll('.valor-campo');
    
    inputsEdicion.forEach(input => input.style.display = 'none');
    valoresCampo.forEach(valor => valor.style.display = 'block');
    
    botones.style.display = 'none';
    botonEditar.style.display = 'block';
    
    window.mostrarNotificacion('¡Cambios guardados exitosamente!', 'success');
    console.log('Datos guardados para ' + seccion + ':', datosActualizados);
}

// --- LÓGICA PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica del Menú Hamburguesa ---
    const botonMenu = document.getElementById('boton-menu');
    const menuLateral = document.getElementById('menu-lateral');
    const overlayMenu = document.getElementById('overlay-menu');
    const itemsMenu = document.querySelectorAll('.item-menu');
    
    // --- Lógica de Cerrar Sesión (Variables) ---
    const btnLogout = document.getElementById('logout-button');
    const modalLogout = document.getElementById('modal-logout');
    const btnLogoutVolver = document.getElementById('btn-logout-volver');
    const btnLogoutConfirmar = document.getElementById('btn-logout-confirmar');

    function esMobile() {
        return window.innerWidth <= 768;
    }

    function abrirMenu() {
        if (esMobile()) {
            menuLateral.classList.add('abierto');
            overlayMenu.classList.add('activo');
            botonMenu.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }

    function cerrarMenu() {
        menuLateral.classList.remove('abierto');
        overlayMenu.classList.remove('activo');
        botonMenu.classList.remove('activo');
        document.body.style.overflow = '';
    }

    if (botonMenu) {
        botonMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menuLateral.classList.contains('abierto')) {
                cerrarMenu();
            } else {
                abrirMenu();
            }
        });
    }

    if (overlayMenu) {
        overlayMenu.addEventListener('click', cerrarMenu);
    }

    itemsMenu.forEach(item => {
        if (item.id !== 'logout-button') {
            item.addEventListener('click', (e) => {
                itemsMenu.forEach(i => {
                    if (i.id !== 'logout-button') {
                        i.classList.remove('activo');
                    }
                });
                item.classList.add('activo');
                
                if (esMobile()) {
                    cerrarMenu();
                }
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuLateral.classList.contains('abierto') && esMobile()) {
            cerrarMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (!esMobile()) {
            cerrarMenu();
        }
    });

    // --- Lógica de Cerrar Sesión (Listeners) ---
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Mostramos el nuevo modal en lugar del confirm()
            if (modalLogout) {
                modalLogout.classList.add('activo');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Listeners para el NUEVO modal de logout
    if (btnLogoutVolver) {
        btnLogoutVolver.addEventListener('click', () => {
            if (modalLogout) {
                modalLogout.classList.remove('activo');
                document.body.style.overflow = '';
            }
        });
    }

    if (btnLogoutConfirmar) {
        btnLogoutConfirmar.addEventListener('click', () => {
            // Esta es la lógica que estaba dentro del confirm()
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '../paginas/Rol_Usuario.html';
        });
    }


    // --- Lógica de Notificaciones ---
    const notificacion = document.getElementById('mi-notificacion');
    const mensajeEl = document.getElementById('notificacion-mensaje');
    const cerrarBtn = document.getElementById('notificacion-cerrar');
    let timeoutId = null;

    function ocultarNotificacion() {
        if (notificacion) {
            notificacion.classList.remove('mostrar');
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    window.mostrarNotificacion = function(mensaje, tipo = 'success') {
        if (!notificacion || !mensajeEl) {
            alert(mensaje); 
            return;
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        mensajeEl.textContent = mensaje;
        notificacion.classList.remove('success', 'error');
        if (tipo === 'error') {
            notificacion.classList.add('error');
        } else {
            notificacion.classList.remove('error');
        }
        notificacion.classList.add('mostrar');
        
        timeoutId = setTimeout(ocultarNotificacion, 5000);
    }

    if (cerrarBtn) {
        cerrarBtn.addEventListener('click', ocultarNotificacion);
    }

    // --- Lógica de Edición de Perfil (Listeners) ---
    const btnEditarDatosPersonales = document.getElementById('btn-editar-datos-personales');
    const btnEditarInfoContacto = document.getElementById('btn-editar-informacion-contacto');
    const btnCancelarDatosPersonales = document.getElementById('btn-cancelar-datos-personales');
    const btnGuardarDatosPersonales = document.getElementById('btn-guardar-datos-personales');
    const btnCancelarInfoContacto = document.getElementById('btn-cancelar-informacion-contacto');
    const btnGuardarInfoContacto = document.getElementById('btn-guardar-informacion-contacto');

    const modalConfirmacion = document.getElementById('modal-confirmacion');
    const btnVolverModal = document.getElementById('btn-volver');
    const btnConfirmarCancelarModal = document.getElementById('btn-confirmar-cancelar');

    // Botones de Editar
    if (btnEditarDatosPersonales) {
        btnEditarDatosPersonales.onclick = () => activarEdicion('datos-personales');
    }
    if (btnEditarInfoContacto) {
        btnEditarInfoContacto.onclick = () => activarEdicion('informacion-contacto');
    }
    
    // Botones de Cancelar
    if (btnCancelarDatosPersonales) {
        btnCancelarDatosPersonales.onclick = () => cancelarEdicion('datos-personales');
    }
    if (btnCancelarInfoContacto) {
        btnCancelarInfoContacto.onclick = () => cancelarEdicion('informacion-contacto');
    }
    
    // Botones de Guardar
    if (btnGuardarDatosPersonales) {
        btnGuardarDatosPersonales.onclick = () => guardarCambios('datos-personales');
    }
    if (btnGuardarInfoContacto) {
        btnGuardarInfoContacto.onclick = () => guardarCambios('informacion-contacto');
    }

    // --- Listeners de Modales (Cancelación y Logout) ---

    // Modal de Cancelación (el que ya tenías)
    if (btnVolverModal) {
        btnVolverModal.addEventListener('click', cerrarModal);
    }
    if (btnConfirmarCancelarModal) {
        btnConfirmarCancelarModal.addEventListener('click', confirmarCancelacion);
    }
    if (modalConfirmacion) {
        modalConfirmacion.addEventListener('click', (e) => {
            if (e.target === modalConfirmacion) cerrarModal();
        });
    }

    // Modal de Logout (el que acabamos de agregar)
    if (modalLogout) {
        modalLogout.addEventListener('click', (e) => {
            if (e.target === modalLogout && btnLogoutVolver) {
                btnLogoutVolver.click(); // Simula clic en "Volver"
            }
        });
    }

    // Listener de la tecla Escape para AMBOS modales
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Si el modal de cancelar está activo, ciérralo
            if (modalConfirmacion && modalConfirmacion.classList.contains('activo')) {
                cerrarModal();
            }
            // Si el modal de logout está activo, ciérralo
            if (modalLogout && modalLogout.classList.contains('activo') && btnLogoutVolver) {
                btnLogoutVolver.click(); // Simula clic en "Volver"
            }
        }
    });


    // --- Lógica de Carga de Foto ---
    const inputFoto = document.getElementById('input-foto');
    const imagenPerfil = document.getElementById('imagen-perfil');
    if (inputFoto && imagenPerfil) {
        inputFoto.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagenPerfil.src = e.target.result;
                    mostrarNotificacion('Foto de perfil actualizada.', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    console.log('✅ Perfil Administrador cargado correctamente');
});