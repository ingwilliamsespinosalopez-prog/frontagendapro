document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    const botonHamburguesa = document.getElementById('boton-hamburguesa');
    const menuLateral = document.getElementById('menu-lateral');
    const overlayMenu = document.getElementById('overlay-menu');
    const enlacesMenu = document.querySelectorAll('.item-menu');
    
    // Logout
    const logoutButton = document.getElementById('logout-button');
    const modalLogout = document.getElementById('modal-logout');
    const btnLogoutVolver = document.getElementById('btn-logout-volver');
    const btnLogoutConfirmar = document.getElementById('btn-logout-confirmar');
    
    // Avatar y nombre
    const inicialesAvatar = document.getElementById('iniciales-avatar');
    const fotoPerfil = document.getElementById('foto-perfil');
    const nombreCompleto = document.getElementById('nombre-completo');
    const botonCambiarFoto = document.getElementById('boton-cambiar-foto');
    const inputFoto = document.getElementById('input-foto');
    
    // Botones principales
    const btnEditar = document.getElementById('btn-editar');
    const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');
    const btnGuardarCambios = document.getElementById('btn-guardar-cambios');
    const contenedorBotones = document.getElementById('contenedor-botones');
    const contenedorBotonesEdicion = document.getElementById('contenedor-botones-edicion');
    
    // Modales
    const modalCancelar = document.getElementById('modal-cancelar');
    const modalConfirmarGuardar = document.getElementById('modal-confirmar-guardar');
    const btnVolver = document.getElementById('btn-volver');
    const btnSiCancelar = document.getElementById('btn-si-cancelar');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal');
    const btnAceptarModal = document.getElementById('btn-aceptar-modal');
    
    // Alerta
    const alertaExito = document.getElementById('alerta-exito');
    const cerrarAlerta = document.getElementById('cerrar-alerta');
    
    // Campos del formulario
    const campos = {
        nombre: {
            display: document.getElementById('display-nombre'),
            input: document.getElementById('input-nombre')
        },
        curp: {
            display: document.getElementById('display-curp'),
            input: document.getElementById('input-curp')
        },
        telefonoAlt: {
            display: document.getElementById('display-telefono-alt'),
            input: document.getElementById('input-telefono-alt')
        },
        telefonoPrin: {
            display: document.getElementById('display-telefono-prin'),
            input: document.getElementById('input-telefono-prin')
        },
        rfc: {
            display: document.getElementById('display-rfc'),
            input: document.getElementById('input-rfc')
        },
        cedula: {
            display: document.getElementById('display-cedula'),
            input: document.getElementById('input-cedula')
        },
        genero: {
            display: document.getElementById('display-genero'),
            input: document.getElementById('input-genero')
        },
        certificaciones: {
            display: document.getElementById('display-certificaciones'),
            input: document.getElementById('input-certificaciones')
        },
        titulo: {
            display: document.getElementById('display-titulo'),
            input: document.getElementById('input-titulo')
        },
        experiencia: {
            display: document.getElementById('display-experiencia'),
            input: document.getElementById('input-experiencia')
        },
        especializacion: {
            display: document.getElementById('display-especializacion'),
            input: document.getElementById('input-especializacion')
        }
    };
    
    // Variables de estado
    let modoEdicion = false;
    let datosOriginales = {};
    
    // ===== MENÚ HAMBURGUESA =====
    function esMobile() {
        return window.innerWidth <= 768;
    }
    
    function abrirMenu() {
        if (!menuLateral || !overlayMenu || !botonHamburguesa) return;
        menuLateral.classList.add('abierto');
        overlayMenu.classList.add('activo');
        botonHamburguesa.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarMenu() {
        if (!menuLateral || !overlayMenu || !botonHamburguesa) return;
        menuLateral.classList.remove('abierto');
        overlayMenu.classList.remove('activo');
        botonHamburguesa.classList.remove('activo');
        document.body.style.overflow = '';
    }
    
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
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (menuLateral && menuLateral.classList.contains('abierto') && esMobile()) {
                cerrarMenu();
            }
            if (modalCancelar && modalCancelar.classList.contains('activo')) {
                cerrarModal(modalCancelar);
            }
            if (modalConfirmarGuardar && modalConfirmarGuardar.classList.contains('activo')) {
                cerrarModal(modalConfirmarGuardar);
            }
            if (modalLogout && modalLogout.classList.contains('activo')) {
                cerrarModal(modalLogout);
            }
        }
    });
    
    window.addEventListener('resize', function() {
        if (!esMobile()) {
            cerrarMenu();
        }
    });
    
    // ===== LOGOUT =====
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
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
            localStorage.removeItem('afgcorporacion_perfil_asesor');
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
    
    // ===== CARGAR DATOS GUARDADOS =====
    function cargarDatos() {
        const datosGuardados = localStorage.getItem('afgcorporacion_perfil_asesor');
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            
            Object.keys(campos).forEach(key => {
                if (datos[key] && campos[key].display && campos[key].input) {
                    campos[key].display.textContent = datos[key];
                    campos[key].input.value = datos[key];
                }
            });
            
            if (datos.nombre) {
                nombreCompleto.textContent = datos.nombre;
                actualizarIniciales(datos.nombre);
            }
            
            if (datos.fotoPerfil) {
                cargarFotoPerfil(datos.fotoPerfil);
            }
        }
    }
    
    // ===== ACTUALIZAR INICIALES DEL AVATAR =====
    function actualizarIniciales(nombre) {
        const palabras = nombre.trim().split(' ');
        let iniciales = '';
        
        if (palabras.length >= 2) {
            iniciales = palabras[0][0] + palabras[palabras.length - 1][0];
        } else if (palabras.length === 1) {
            iniciales = palabras[0][0] + (palabras[0][1] || '');
        }
        
        if (inicialesAvatar) {
            inicialesAvatar.textContent = iniciales.toUpperCase();
        }
    }
    
    // ===== CARGAR FOTO DE PERFIL =====
    function cargarFotoPerfil(fotoBase64) {
        if (fotoPerfil && fotoBase64) {
            fotoPerfil.src = fotoBase64;
            fotoPerfil.style.display = 'block';
            if (inicialesAvatar) {
                inicialesAvatar.style.display = 'none';
            }
        }
    }
    
    // ===== CAMBIAR FOTO DE PERFIL =====
    function cambiarFotoPerfil(event) {
        const archivo = event.target.files[0];
        
        if (archivo) {
            if (!archivo.type.match('image.*')) {
                alert('Por favor selecciona una imagen válida');
                return;
            }
            
            if (archivo.size > 5 * 1024 * 1024) {
                alert('La imagen es muy grande. Tamaño máximo: 5MB');
                return;
            }
            
            const lector = new FileReader();
            
            lector.onload = function(e) {
                const fotoBase64 = e.target.result;
                cargarFotoPerfil(fotoBase64);
                
                const datosGuardados = localStorage.getItem('afgcorporacion_perfil_asesor');
                let datos = datosGuardados ? JSON.parse(datosGuardados) : {};
                datos.fotoPerfil = fotoBase64;
                localStorage.setItem('afgcorporacion_perfil_asesor', JSON.stringify(datos));
                
                mostrarAlerta('Foto de perfil actualizada');
            };
            
            lector.onerror = function() {
                alert('Error al cargar la imagen. Por favor intenta de nuevo.');
            };
            
            lector.readAsDataURL(archivo);
        }
    }
    
    // ===== ACTIVAR MODO EDICIÓN =====
    function activarModoEdicion() {
        modoEdicion = true;
        
        Object.keys(campos).forEach(key => {
            if (campos[key].display) {
                datosOriginales[key] = campos[key].display.textContent;
            }
        });
        
        Object.keys(campos).forEach(key => {
            if (campos[key].display && campos[key].input) {
                campos[key].display.style.display = 'none';
                campos[key].input.style.display = 'block';
            }
        });
        
        if (contenedorBotones) contenedorBotones.style.display = 'none';
        if (contenedorBotonesEdicion) contenedorBotonesEdicion.style.display = 'flex';
    }
    
    // ===== DESACTIVAR MODO EDICIÓN =====
    function desactivarModoEdicion() {
        modoEdicion = false;
        
        Object.keys(campos).forEach(key => {
            if (campos[key].display && campos[key].input) {
                campos[key].display.style.display = 'block';
                campos[key].input.style.display = 'none';
            }
        });
        
        if (contenedorBotones) contenedorBotones.style.display = 'flex';
        if (contenedorBotonesEdicion) contenedorBotonesEdicion.style.display = 'none';
    }
    
    // ===== RESTAURAR DATOS ORIGINALES =====
    function restaurarDatos() {
        Object.keys(campos).forEach(key => {
            if (campos[key].display && campos[key].input && datosOriginales[key]) {
                campos[key].input.value = datosOriginales[key];
            }
        });
    }
    
    // ===== GUARDAR CAMBIOS =====
    function guardarCambios() {
        const datos = {};
        
        Object.keys(campos).forEach(key => {
            if (campos[key].input) {
                let valor = campos[key].input.value;
                
                if (key === 'experiencia') {
                    valor = valor + ' años';
                }
                
                datos[key] = valor;
                
                if (campos[key].display) {
                    campos[key].display.textContent = valor;
                }
            }
        });
        
        if (datos.nombre && nombreCompleto) {
            nombreCompleto.textContent = datos.nombre;
            actualizarIniciales(datos.nombre);
        }
        
        const datosAnteriores = localStorage.getItem('afgcorporacion_perfil_asesor');
        if (datosAnteriores) {
            const datosParseados = JSON.parse(datosAnteriores);
            if (datosParseados.fotoPerfil) {
                datos.fotoPerfil = datosParseados.fotoPerfil;
            }
        }
        
        localStorage.setItem('afgcorporacion_perfil_asesor', JSON.stringify(datos));
        desactivarModoEdicion();
        mostrarAlerta();
    }
    
    // ===== MODALES =====
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
    
    // ===== ALERTA DE ÉXITO =====
    function mostrarAlerta(mensaje = 'Se Actualizaron tus datos') {
        if (alertaExito) {
            const textoAlerta = alertaExito.querySelector('.alerta-titulo');
            if (textoAlerta) {
                textoAlerta.textContent = mensaje;
            }
            
            alertaExito.classList.add('mostrar');
            
            setTimeout(() => {
                ocultarAlerta();
            }, 4000);
        }
    }
    
    function ocultarAlerta() {
        if (alertaExito) {
            alertaExito.classList.remove('mostrar');
        }
    }
    
    // ===== EVENT LISTENERS =====
    
    if (botonCambiarFoto) {
        botonCambiarFoto.addEventListener('click', function() {
            if (inputFoto) inputFoto.click();
        });
    }
    
    if (inputFoto) {
        inputFoto.addEventListener('change', cambiarFotoPerfil);
    }
    
    if (btnEditar) {
        btnEditar.addEventListener('click', activarModoEdicion);
    }
    
    if (btnCancelarEdicion) {
        btnCancelarEdicion.addEventListener('click', function() {
            abrirModal(modalCancelar);
        });
    }
    
    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            cerrarModal(modalCancelar);
        });
    }
    
    if (btnSiCancelar) {
        btnSiCancelar.addEventListener('click', function() {
            restaurarDatos();
            desactivarModoEdicion();
            cerrarModal(modalCancelar);
        });
    }
    
    if (btnGuardarCambios) {
        btnGuardarCambios.addEventListener('click', function() {
            abrirModal(modalConfirmarGuardar);
        });
    }
    
    if (btnCancelarModal) {
        btnCancelarModal.addEventListener('click', function() {
            cerrarModal(modalConfirmarGuardar);
        });
    }
    
    if (btnAceptarModal) {
        btnAceptarModal.addEventListener('click', function() {
            cerrarModal(modalConfirmarGuardar);
            guardarCambios();
        });
    }
    
    if (cerrarAlerta) {
        cerrarAlerta.addEventListener('click', ocultarAlerta);
    }
    
    [modalCancelar, modalConfirmarGuardar].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    cerrarModal(modal);
                }
            });
        }
    });
    
    // ===== INICIALIZAR =====
    cargarDatos();
    
    console.log('✅ Perfil Asesor AFGCORPORACIÓN cargado correctamente');
});