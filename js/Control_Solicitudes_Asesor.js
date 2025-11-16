document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    const botonHamburguesa = document.getElementById('boton-hamburguesa');
    const menuLateral = document.getElementById('menu-lateral');
    const overlayMenu = document.getElementById('overlay-menu');
    const enlacesMenu = document.querySelectorAll('.item-menu');
    const tbodySolicitudes = document.getElementById('tbody-solicitudes');
    const btnLogout = document.getElementById('logout-button');
    
    // Modales
    const modalConfirmar = document.getElementById('modal-confirmar');
    const modalRechazar = document.getElementById('modal-rechazar');
    const modalDetalles = document.getElementById('modal-detalles');
    const modalLogout = document.getElementById('modal-logout');
    const btnCancelarConfirmar = document.getElementById('btn-cancelar-confirmar');
    const btnAceptarConfirmar = document.getElementById('btn-aceptar-confirmar');
    const btnVolverRechazar = document.getElementById('btn-volver-rechazar');
    const btnSiRechazar = document.getElementById('btn-si-rechazar');
    const cerrarModalDetalles = document.getElementById('cerrar-modal-detalles');
    const contenidoDetalles = document.getElementById('contenido-detalles');
    const badgeEstadoModal = document.getElementById('badge-estado-modal');
    const btnLogoutVolver = document.getElementById('btn-logout-volver');
    const btnLogoutConfirmar = document.getElementById('btn-logout-confirmar');
    
    // Alertas
    const alertaConfirmar = document.getElementById('alerta-confirmar');
    const alertaRechazar = document.getElementById('alerta-rechazar');
    const cerrarAlertaConfirmar = document.getElementById('cerrar-alerta-confirmar');
    const cerrarAlertaRechazar = document.getElementById('cerrar-alerta-rechazar');
    
    // Variables de estado
    let solicitudActual = null;
    let accionActual = null;
    
    // ===== MENÚ HAMBURGUESA =====
    function esMobile() {
        return window.innerWidth <= 768;
    }
    
    function abrirMenu() {
        menuLateral.classList.add('abierto');
        overlayMenu.classList.add('activo');
        botonHamburguesa.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarMenu() {
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
            if (menuLateral.classList.contains('abierto') && esMobile()) {
                cerrarMenu();
            }
            if (modalConfirmar.classList.contains('activo')) {
                cerrarModal(modalConfirmar);
            }
            if (modalRechazar.classList.contains('activo')) {
                cerrarModal(modalRechazar);
            }
            if (modalDetalles.classList.contains('activo')) {
                cerrarModal(modalDetalles);
            }
            if (modalLogout.classList.contains('activo')) {
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
    
    // Cerrar modal logout con click fuera
    if (modalLogout) {
        modalLogout.addEventListener('click', function(e) {
            if (e.target === modalLogout) {
                cerrarModal(modalLogout);
            }
        });
    }
    
    // ===== CARGAR SOLICITUDES =====
    function cargarSolicitudes() {
        const asesorias = localStorage.getItem('afgcorporacion_asesorias_cliente');
        
        if (asesorias) {
            const solicitudes = JSON.parse(asesorias);
            const solicitudesRelevantes = solicitudes.filter(s => 
                s.estado === 'Pendiente' || s.estado === 'Completada'
            );
            renderizarSolicitudes(solicitudesRelevantes);
        } else {
            renderizarSolicitudes([]);
        }
    }
    
    // ===== RENDERIZAR SOLICITUDES =====
    function renderizarSolicitudes(solicitudes) {
        if (!tbodySolicitudes) return;
        
        tbodySolicitudes.innerHTML = '';
        
        if (solicitudes.length === 0) {
            tbodySolicitudes.innerHTML = `
                <tr class="fila-vacia">
                    <td colspan="7">
                        <div class="mensaje-vacio">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            </svg>
                            <p>📋 No hay solicitudes</p>
                            <p class="texto-secundario">Las solicitudes aparecerán aquí</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        solicitudes.forEach((solicitud, index) => {
            const fila = crearFilaSolicitud(solicitud, index);
            tbodySolicitudes.appendChild(fila);
        });
        
        setTimeout(animarFilas, 100);
    }
    
    // ===== CREAR FILA DE SOLICITUD =====
    function crearFilaSolicitud(solicitud, index) {
        const tr = document.createElement('tr');
        tr.dataset.index = index;
        
        const nombreCliente = obtenerNombreCliente(solicitud);
        
        const esReagendada = solicitud.historialCambios && solicitud.historialCambios.length > 0;
        const badgeReagendada = esReagendada ? '<span class="badge-reagendada">Reagendada</span>' : '';
        
        const asesorAsignado = solicitud.asesor || 'Sin asignar';
        
        const mostrarAcciones = solicitud.estado === 'Pendiente';

        const modalidad = solicitud.modalidad || 'N/A';
        const modalidadClass = String(modalidad).toLowerCase().replace('/', '');
        const modalidadIcono = modalidad === 'Presencial'
            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10-7 10"></path><path d="m13 14-4-4 4-4"></path><path d="M4 14a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2"></path><path d="M20 14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2"></path></svg>`;

        tr.innerHTML = `
            <td>
                <span class="nombre-cliente">${nombreCliente}</span>
            </td>
            <td>
                <span class="tema-tratar">${solicitud.tipo}</span>
            </td>
            <td>
                <div class="fecha-hora-celda">
                    <span class="fecha-texto">${solicitud.fecha}</span>
                    <span class="hora-texto">${solicitud.hora}</span>
                    ${badgeReagendada}
                </div>
            </td>
            <td>
                <span class="badge-modalidad ${modalidadClass}">
                    ${modalidadIcono}
                    ${modalidad}
                </span>
            </td>
            <td>
                <span class="badge-estado ${solicitud.estado.toLowerCase()}">${solicitud.estado}</span>
                ${solicitud.estado === 'Completada' && asesorAsignado !== 'Sin asignar' ? 
                    `<div style="margin-top: 6px; font-size: 12px; color: #059669;">
                        <strong>Asesor:</strong> ${asesorAsignado}
                    </div>` : ''}
            </td>
            <td class="celda-acciones">
                ${mostrarAcciones ? `
                    <div class="contenedor-botones-accion">
                        <button class="boton-accion btn-confirmar" data-accion="confirmar" data-index="${index}">
                            Confirmar
                        </button>
                        <button class="boton-accion btn-rechazar" data-accion="rechazar" data-index="${index}">
                            Cancelar
                        </button>
                    </div>
                ` : `
                    <span style="font-size: 12px; color: #999;">Sin acciones</span>
                `}
            </td>
            <td style="text-align: center;">
                <button class="btn-detalles" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </td>
        `;
        
        return tr;
    }
    
    // ===== OBTENER NOMBRE CLIENTE =====
    function obtenerNombreCliente(solicitud) {
        const perfilCliente = localStorage.getItem('afgcorporacion_cliente_perfil');
        if (perfilCliente) {
            const datos = JSON.parse(perfilCliente);
            if (datos.nombreCompleto) {
                return datos.nombreCompleto;
            }
        }
        return solicitud.asesor || 'Cliente';
    }
    
    // ===== MOSTRAR DETALLES =====
    function mostrarDetalles(index) {
        const asesorias = localStorage.getItem('afgcorporacion_asesorias_cliente');
        if (!asesorias) return;
        
        const solicitudes = JSON.parse(asesorias);
        const solicitudesRelevantes = solicitudes.filter(s => 
            s.estado === 'Pendiente' || s.estado === 'Completada'
        );
        const solicitud = solicitudesRelevantes[index];
        
        if (!solicitud) return;
        
        const nombreCliente = obtenerNombreCliente(solicitud);
        
        badgeEstadoModal.className = `badge-estado-modal ${solicitud.estado.toLowerCase()}`;
        badgeEstadoModal.textContent = solicitud.estado;
        
        const modalidad = solicitud.modalidad || 'N/A';
        const modalidadClass = modalidad === 'Meet' ? 'modalidad-meet' : 'modalidad-presencial';

        let contenido = `
            <div class="grupo-info">
                <span class="label-info">Cliente</span>
                <span class="valor-info">${nombreCliente}</span>
            </div>
            
            <div class="grupo-info">
                <span class="label-info">Tipo de Asesoría</span>
                <span class="valor-info">${solicitud.tipo}</span>
            </div>
            
            <div class="grupo-info">
                <span class="label-info">Fecha y Hora</span>
                <span class="valor-info">${solicitud.fecha} a las ${solicitud.hora}</span>
            </div>

            <div class="grupo-info ${modalidadClass}">
                <span class="label-info">Modalidad</span>
                <span class="valor-info" style="font-weight: 600;">${modalidad}</span>
            </div>
            
            <div class="grupo-info">
                <span class="label-info">Estado</span>
                <span class="valor-info">${solicitud.estado}</span>
            </div>
        `;
        
        if (solicitud.asesor) {
            contenido += `
                <div class="grupo-info">
                    <span class="label-info">Asesor Asignado</span>
                    <span class="valor-info" style="color: #059669; font-weight: 600;">${solicitud.asesor}</span>
                </div>
            `;
        }
        
        if (solicitud.notas && solicitud.notas !== 'Sin notas adicionales') {
            contenido += `
                <div class="comentario-destacado">
                    <span class="label-info">💬 Comentarios del Cliente</span>
                    <span class="valor-info">${solicitud.notas}</span>
                </div>
            `;
        }
        
        if (solicitud.notasAdmin) {
            contenido += `
                <div class="grupo-info" style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <span class="label-info" style="color: #92400e;">📝 Notas del Administrador</span>
                    <span class="valor-info" style="color: #1a1a1a;">${solicitud.notasAdmin}</span>
                </div>
            `;
        }
        
        if (solicitud.historialCambios && solicitud.historialCambios.length > 0) {
            contenido += `
                <div class="seccion-historial">
                    <div class="titulo-seccion">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Historial de Cambios
                    </div>
            `;
            
            solicitud.historialCambios.forEach((cambio, idx) => {
                let claseTipo = '';
                let tipoTexto = '';
                
                if (cambio.tipo === 'reagendacion') {
                    claseTipo = 'reagendacion';
                    tipoTexto = '🔄 Reagendación';
                } else if (cambio.tipo === 'cancelacion') {
                    claseTipo = 'cancelacion';
                    tipoTexto = '❌ Cancelación';
                } else if (cambio.tipo === 'confirmacion') {
                    claseTipo = 'confirmacion';
                    tipoTexto = '✅ Confirmación por Administrador';
                } else if (cambio.tipo === 'rechazo') {
                    claseTipo = 'rechazo';
                    tipoTexto = '🚫 Rechazo por Administrador';
                } else {
                    tipoTexto = '📝 Cambio';
                }
                
                contenido += `
                    <div class="evento-historial ${claseTipo}">
                        <div class="evento-header">
                            <span class="evento-tipo">${tipoTexto}</span>
                            <span class="evento-fecha">${cambio.fecha || 'Fecha no disponible'}</span>
                        </div>
                        <div class="evento-detalles">
                            ${cambio.fechaAnterior ? `<strong>Fecha anterior:</strong> ${cambio.fechaAnterior} a las ${cambio.horaAnterior}<br>` : ''}
                            ${cambio.fechaNueva ? `<strong>Nueva fecha:</strong> ${cambio.fechaNueva} a las ${cambio.horaNueva}<br>` : ''}
                            ${cambio.asesorAsignado ? `<strong>Asesor asignado:</strong> ${cambio.asesorAsignado}<br>` : ''}
                            ${cambio.motivo ? `<strong>Motivo:</strong> ${cambio.motivo}<br>` : ''}
                            ${cambio.notasAdmin ? `<strong>Notas:</strong> ${cambio.notasAdmin}` : ''}
                        </div>
                    </div>
                `;
            });
            
            contenido += `</div>`;
        }
        
        contenidoDetalles.innerHTML = contenido;
        
        modalDetalles.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }
    
    // ===== MANEJAR ACCIONES =====
    document.addEventListener('click', function(e) {
        const btnDetalles = e.target.closest('.btn-detalles');
        if (btnDetalles) {
            const index = parseInt(btnDetalles.dataset.index);
            mostrarDetalles(index);
            return;
        }
        
        const boton = e.target.closest('.boton-accion');
        if (!boton) return;
        
        const accion = boton.dataset.accion;
        const index = parseInt(boton.dataset.index);
        
        const asesorias = localStorage.getItem('afgcorporacion_asesorias_cliente');
        if (asesorias) {
            const solicitudes = JSON.parse(asesorias);
            const solicitudesRelevantes = solicitudes.filter(s => 
                s.estado === 'Pendiente' || s.estado === 'Completada'
            );
            solicitudActual = solicitudesRelevantes[index];
            accionActual = accion;
            
            const indiceReal = solicitudes.findIndex(s => 
                s.id === solicitudActual.id
            );
            solicitudActual.indiceReal = indiceReal;
        }
        
        if (accion === 'confirmar') {
            abrirModal(modalConfirmar);
        } else if (accion === 'rechazar') {
            abrirModal(modalRechazar);
        }
    });
    
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
    
    // ===== CONFIRMAR SOLICITUD =====
    if (btnAceptarConfirmar) {
        btnAceptarConfirmar.addEventListener('click', function() {
            cerrarModal(modalConfirmar);
            confirmarSolicitud();
        });
    }
    
    if (btnCancelarConfirmar) {
        btnCancelarConfirmar.addEventListener('click', function() {
            cerrarModal(modalConfirmar);
        });
    }
    
    function confirmarSolicitud() {
        if (!solicitudActual || solicitudActual.indiceReal === -1) return;
        
        const asesorias = localStorage.getItem('afgcorporacion_asesorias_cliente');
        if (asesorias) {
            const solicitudes = JSON.parse(asesorias);
            solicitudes[solicitudActual.indiceReal].estado = 'Completada';
            
            if (!solicitudes[solicitudActual.indiceReal].historialCambios) {
                solicitudes[solicitudActual.indiceReal].historialCambios = [];
            }
            
            solicitudes[solicitudActual.indiceReal].historialCambios.push({
                tipo: 'confirmacion_asesor',
                fecha: new Date().toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                motivo: 'Confirmada por el asesor'
            });
            
            localStorage.setItem('afgcorporacion_asesorias_cliente', JSON.stringify(solicitudes));
        }
        
        cargarSolicitudes();
        mostrarAlerta(alertaConfirmar);
        
        solicitudActual = null;
        accionActual = null;
    }
    
    // ===== RECHAZAR SOLICITUD =====
    if (btnSiRechazar) {
        btnSiRechazar.addEventListener('click', function() {
            cerrarModal(modalRechazar);
            rechazarSolicitud();
        });
    }
    
    if (btnVolverRechazar) {
        btnVolverRechazar.addEventListener('click', function() {
            cerrarModal(modalRechazar);
        });
    }
    
    function rechazarSolicitud() {
        if (!solicitudActual || solicitudActual.indiceReal === -1) return;
        
        const asesorias = localStorage.getItem('afgcorporacion_asesorias_cliente');
        if (asesorias) {
            const solicitudes = JSON.parse(asesorias);
            solicitudes[solicitudActual.indiceReal].estado = 'Cancelada';
            
            if (!solicitudes[solicitudActual.indiceReal].historialCambios) {
                solicitudes[solicitudActual.indiceReal].historialCambios = [];
            }
            
            solicitudes[solicitudActual.indiceReal].historialCambios.push({
                tipo: 'rechazo_asesor',
                fecha: new Date().toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                motivo: 'Cancelada por el asesor'
            });
            
            localStorage.setItem('afgcorporacion_asesorias_cliente', JSON.stringify(solicitudes));
        }
        
        cargarSolicitudes();
        mostrarAlerta(alertaRechazar);
        
        solicitudActual = null;
        accionActual = null;
    }
    
    // ===== CERRAR MODAL DETALLES =====
    if (cerrarModalDetalles) {
        cerrarModalDetalles.addEventListener('click', function() {
            cerrarModal(modalDetalles);
        });
    }
    
    // ===== ALERTAS =====
    function mostrarAlerta(alerta) {
        if (alerta) {
            alerta.classList.add('mostrar');
            setTimeout(() => {
                ocultarAlerta(alerta);
            }, 4000);
        }
    }
    
    function ocultarAlerta(alerta) {
        if (alerta) {
            alerta.classList.remove('mostrar');
        }
    }
    
    if (cerrarAlertaConfirmar) {
        cerrarAlertaConfirmar.addEventListener('click', function() {
            ocultarAlerta(alertaConfirmar);
        });
    }
    
    if (cerrarAlertaRechazar) {
        cerrarAlertaRechazar.addEventListener('click', function() {
            ocultarAlerta(alertaRechazar);
        });
    }
    
    // ===== CERRAR MODALES AL HACER CLICK FUERA =====
    [modalConfirmar, modalRechazar, modalDetalles].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    cerrarModal(modal);
                }
            });
        }
    });
    
    // ===== ANIMACIONES =====
    function animarFilas() {
        const filas = document.querySelectorAll('.tabla-solicitudes tbody tr:not(.fila-vacia)');
        filas.forEach((fila, index) => {
            fila.style.opacity = '0';
            fila.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                fila.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                fila.style.opacity = '1';
                fila.style.transform = 'translateX(0)';
            }, index * 80);
        });
    }
    
    // ===== SINCRONIZACIÓN AUTOMÁTICA =====
    window.addEventListener('storage', function(e) {
        if (e.key === 'afgcorporacion_asesorias_cliente') {
            cargarSolicitudes();
        }
    });
    
    window.addEventListener('solicitudesActualizadas', function() {
        cargarSolicitudes();
    });
    
    // ===== INICIALIZAR =====
    cargarDatos();
    
    console.log('✅ Control de Solicitudes del Asesor AFGCORPORACIÓN cargado correctamente');
});