document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    const btnActualizarDatos = document.getElementById('btn-actualizar-datos');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnGuardar = document.getElementById('btn-guardar');
    const contenedorBotones = document.getElementById('contenedor-botones');
    const formularioPerfil = document.getElementById('formulario-perfil');
    
    // Menú hamburguesa
    const botonHamburguesa = document.getElementById('boton-hamburguesa');
    const menuLateral = document.getElementById('menu-lateral');
    const overlayMenu = document.getElementById('overlay-menu');
    const enlacesMenu = document.querySelectorAll('.item-menu');
    
    // Logout
    const btnLogout = document.getElementById('logout-button');
    const modalLogout = document.getElementById('modal-logout');
    const btnLogoutVolver = document.getElementById('btn-logout-volver');
    const btnLogoutConfirmar = document.getElementById('btn-logout-confirmar');
    
    // Campos del formulario
    const camposEntrada = document.querySelectorAll('.campo-entrada');
    const nombreCompleto = document.getElementById('nombre-completo');
    const rfc = document.getElementById('rfc');
    const curp = document.getElementById('curp');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');
    const calle = document.getElementById('calle');
    const codigoPostal = document.getElementById('codigo-postal');
    const colonia = document.getElementById('colonia');
    const ciudad = document.getElementById('ciudad');
    const estado = document.getElementById('estado');
    
    // Modales
    const modalCancelar = document.getElementById('modal-cancelar');
    const modalGuardar = document.getElementById('modal-guardar');
    const modalExito = document.getElementById('modal-exito');
    
    // Botones de modales
    const btnVolver = document.getElementById('btn-volver');
    const btnConfirmarCancelar = document.getElementById('btn-confirmar-cancelar');
    const btnRegresar = document.getElementById('btn-regresar');
    const btnConfirmarGuardar = document.getElementById('btn-confirmar-guardar');
    const btnCerrarExito = document.getElementById('btn-cerrar-exito');
    
    // Estado del formulario
    let modoEdicion = false;
    let datosOriginales = {};
    
    // ===== FUNCIONES DE UTILIDAD =====
    function esMobile() {
        return window.innerWidth <= 768;
    }
    
    function abrirMenu() {
        if (menuLateral && overlayMenu && botonHamburguesa) {
            menuLateral.classList.add('abierto');
            overlayMenu.classList.add('activo');
            botonHamburguesa.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function cerrarMenu() {
        if (menuLateral && overlayMenu && botonHamburguesa) {
            menuLateral.classList.remove('abierto');
            overlayMenu.classList.remove('activo');
            botonHamburguesa.classList.remove('activo');
            document.body.style.overflow = '';
        }
    }
    
    function abrirModal(modal) {
        if (modal) {
            modal.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function cerrarModal(modal) {
        if (modal) {
            modal.classList.remove('activo');
            document.body.style.overflow = '';
        }
    }
    
    // ===== MENÚ HAMBURGUESA =====
    if (botonHamburguesa) {
        botonHamburguesa.addEventListener('click', function(e) {
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
    
    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', function() {
            if (esMobile()) {
                cerrarMenu();
            }
        });
    });
    
    // ===== TECLA ESC =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (menuLateral && menuLateral.classList.contains('abierto') && esMobile()) {
                cerrarMenu();
            }
            if (modalLogout && modalLogout.classList.contains('activo')) {
                cerrarModal(modalLogout);
            }
            if (modalCancelar && modalCancelar.classList.contains('activo')) {
                cerrarModal(modalCancelar);
            }
            if (modalGuardar && modalGuardar.classList.contains('activo')) {
                cerrarModal(modalGuardar);
            }
            if (modalExito && modalExito.classList.contains('activo')) {
                cerrarModal(modalExito);
            }
        }
    });
    
    // ===== RESIZE =====
    window.addEventListener('resize', function() {
        if (!esMobile()) {
            cerrarMenu();
        }
    });
    
    // ===== LOGOUT =====
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            abrirModal(modalLogout);
        });
    }
    
    if (btnLogoutVolver) {
        btnLogoutVolver.addEventListener('click', function() {
            cerrarModal(modalLogout);
        });
    }
    
    if (btnLogoutConfirmar) {
        btnLogoutConfirmar.addEventListener('click', function() {
            localStorage.removeItem('afgcorporacion_cliente_perfil');
            localStorage.removeItem('afgcorporacion_asesorias_cliente');
            window.location.href = '../paginas/Rol_Usuario.html';
        });
    }
    
    if (modalLogout) {
        modalLogout.addEventListener('click', function(e) {
            if (e.target === modalLogout) {
                cerrarModal(modalLogout);
            }
        });
    }
    
    // ===== GUARDAR DATOS ORIGINALES =====
    function guardarDatosOriginales() {
        datosOriginales = {
            nombreCompleto: nombreCompleto.value,
            rfc: rfc.value,
            curp: curp.value,
            telefono: telefono.value,
            email: email.value,
            calle: calle.value,
            codigoPostal: codigoPostal.value,
            colonia: colonia.value,
            ciudad: ciudad.value,
            estado: estado.value
        };
    }
    
    // ===== RESTAURAR DATOS ORIGINALES =====
    function restaurarDatosOriginales() {
        nombreCompleto.value = datosOriginales.nombreCompleto;
        rfc.value = datosOriginales.rfc;
        curp.value = datosOriginales.curp;
        telefono.value = datosOriginales.telefono;
        email.value = datosOriginales.email;
        calle.value = datosOriginales.calle;
        codigoPostal.value = datosOriginales.codigoPostal;
        colonia.value = datosOriginales.colonia;
        ciudad.value = datosOriginales.ciudad;
        estado.value = datosOriginales.estado;
    }
    
    // ===== ACTIVAR MODO EDICIÓN =====
    function activarModoEdicion() {
        modoEdicion = true;
        guardarDatosOriginales();
        
        camposEntrada.forEach(campo => {
            campo.disabled = false;
        });
        
        contenedorBotones.style.display = 'flex';
        
        btnActualizarDatos.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Editando...
        `;
        btnActualizarDatos.style.backgroundColor = '#fef3c7';
        btnActualizarDatos.style.color = '#92400e';
    }
    
    // ===== DESACTIVAR MODO EDICIÓN =====
    function desactivarModoEdicion() {
        modoEdicion = false;
        
        camposEntrada.forEach(campo => {
            campo.disabled = true;
        });
        
        contenedorBotones.style.display = 'none';
        
        btnActualizarDatos.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Actualizar datos
        `;
        btnActualizarDatos.style.backgroundColor = 'white';
        btnActualizarDatos.style.color = '#117a8b';
    }
    
    // ===== VALIDAR CAMPOS =====
    function validarCampos() {
        const errores = [];
        
        if (!nombreCompleto.value.trim()) {
            errores.push('El nombre completo es obligatorio');
        }
        
        if (!rfc.value.trim() || rfc.value.trim().length < 12) {
            errores.push('El RFC debe tener al menos 12 caracteres');
        }
        
        if (!curp.value.trim() || curp.value.trim().length !== 18) {
            errores.push('El CURP debe tener exactamente 18 caracteres');
        }
        
        if (!telefono.value.trim() || telefono.value.trim().length < 10) {
            errores.push('El teléfono debe tener al menos 10 dígitos');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            errores.push('El correo electrónico no es válido');
        }
        
        if (!calle.value.trim()) {
            errores.push('La calle es obligatoria');
        }
        
        if (!codigoPostal.value.trim() || codigoPostal.value.trim().length !== 5) {
            errores.push('El código postal debe tener 5 dígitos');
        }
        
        if (errores.length > 0) {
            alert('Por favor corrige los siguientes errores:\n\n' + errores.join('\n'));
            return false;
        }
        
        return true;
    }
    
    // ===== GUARDAR DATOS EN LOCALSTORAGE =====
    function guardarDatosEnStorage() {
        const datosCliente = {
            nombreCompleto: nombreCompleto.value,
            rfc: rfc.value,
            curp: curp.value,
            telefono: telefono.value,
            email: email.value,
            calle: calle.value,
            codigoPostal: codigoPostal.value,
            colonia: colonia.value,
            ciudad: ciudad.value,
            estado: estado.value,
            fechaActualizacion: new Date().toISOString()
        };
        
        localStorage.setItem('afgcorporacion_cliente_perfil', JSON.stringify(datosCliente));
        
        document.getElementById('nombre-usuario').textContent = nombreCompleto.value;
    }
    
    // ===== CARGAR DATOS DE LOCALSTORAGE =====
    function cargarDatosDeStorage() {
        const datosGuardados = localStorage.getItem('afgcorporacion_cliente_perfil');
        
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            
            nombreCompleto.value = datos.nombreCompleto || '';
            rfc.value = datos.rfc || '';
            curp.value = datos.curp || '';
            telefono.value = datos.telefono || '';
            email.value = datos.email || '';
            calle.value = datos.calle || '';
            codigoPostal.value = datos.codigoPostal || '';
            colonia.value = datos.colonia || '';
            ciudad.value = datos.ciudad || '';
            estado.value = datos.estado || '';
            
            document.getElementById('nombre-usuario').textContent = datos.nombreCompleto;
        }
    }
    
    // ===== EVENT LISTENERS =====
    
    if (btnActualizarDatos) {
        btnActualizarDatos.addEventListener('click', function() {
            if (!modoEdicion) {
                activarModoEdicion();
            }
        });
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            abrirModal(modalCancelar);
        });
    }
    
    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            cerrarModal(modalCancelar);
        });
    }
    
    if (btnConfirmarCancelar) {
        btnConfirmarCancelar.addEventListener('click', function() {
            restaurarDatosOriginales();
            desactivarModoEdicion();
            cerrarModal(modalCancelar);
        });
    }
    
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function() {
            if (validarCampos()) {
                abrirModal(modalGuardar);
            }
        });
    }
    
    if (btnRegresar) {
        btnRegresar.addEventListener('click', function() {
            cerrarModal(modalGuardar);
        });
    }
    
    if (btnConfirmarGuardar) {
        btnConfirmarGuardar.addEventListener('click', function() {
            guardarDatosEnStorage();
            desactivarModoEdicion();
            cerrarModal(modalGuardar);
            
            setTimeout(() => {
                abrirModal(modalExito);
            }, 300);
        });
    }
    
    if (btnCerrarExito) {
        btnCerrarExito.addEventListener('click', function() {
            cerrarModal(modalExito);
        });
    }
    
    // ===== CERRAR MODALES AL HACER CLIC FUERA =====
    [modalCancelar, modalGuardar, modalExito].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    cerrarModal(modal);
                }
            });
        }
    });
    
    // ===== INICIALIZACIÓN =====
    cargarDatosDeStorage();
    
    console.log('✅ Perfil de cliente AFGCORPORACIÓN cargado correctamente');
});