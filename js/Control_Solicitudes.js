// ===== CONTROL DE SOLICITUDES - JAVASCRIPT ESPECÍFICO =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    // Se eliminaron: botonMenu, menuLateral, overlayMenu, itemsMenu, btnLogout
    
    const pestanas = document.querySelectorAll('.pestana');
    const indicador = document.getElementById('indicador');
    const contenedorPestanas = document.querySelector('.contenedor-pestanas');
    const tbody = document.getElementById('tbody-citas');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    
    // Modal de detalles
    const modalDetalles = document.getElementById('modal-detalles');
    const cerrarModal = document.getElementById('cerrar-modal');
    const contenidoModalDetalles = document.getElementById('contenido-modal-detalles');
    const modalFooterAcciones = document.getElementById('modal-footer-acciones');
    const badgeEstadoModal = document.getElementById('badge-estado-modal');
    
    // Modal de asignación
    const modalAsignarAsesor = document.getElementById('modal-asignar-asesor');
    const cerrarModalAsignacion = document.getElementById('cerrar-modal-asignacion');
    const btnCancelarAsignacion = document.getElementById('btn-cancelar-asignacion');
    const btnConfirmarAsignacion = document.getElementById('btn-confirmar-asignacion');
    const selectAsesor = document.getElementById('select-asesor');
    const textareaNotasConfirmar = document.getElementById('textarea-notas-confirmar');
    const infoClienteAsignacion = document.getElementById('info-cliente-asignacion');
    
    // Modal de rechazo
    const modalRechazar = document.getElementById('modal-rechazar');
    const cerrarModalRechazar = document.getElementById('cerrar-modal-rechazar');
    const btnCancelarRechazar = document.getElementById('btn-cancelar-rechazar');
    const btnConfirmarRechazo = document.getElementById('btn-confirmar-rechazo');
    const textareaNotasRechazar = document.getElementById('textarea-notas-rechazar');
    const infoClienteRechazar = document.getElementById('info-cliente-rechazar');
    
    let solicitudActual = null;
    let nombreClienteGlobal = 'Cliente'; // Variable global para el nombre del cliente
    
    
    // ===== GESTIÓN DE SOLICITUDES =====
    
    function cargarSolicitudes() {
        const solicitudesGuardadas = localStorage.getItem('afgcorporacion_asesorias_cliente');
        return solicitudesGuardadas ? JSON.parse(solicitudesGuardadas) : [];
    }

    function guardarSolicitudes(solicitudes) {
        localStorage.setItem('afgcorporacion_asesorias_cliente', JSON.stringify(solicitudes));
        // Disparar evento personalizado para sincronización
        window.dispatchEvent(new Event('solicitudesActualizadas'));
    }

    function obtenerNombreCliente() {
        // Usamos la variable global que se carga al inicio
        return nombreClienteGlobal;
    }
    
    function cargarNombreClienteGlobal() {
        const perfilCliente = localStorage.getItem('afgcorporacion_cliente_perfil');
        if (perfilCliente) {
            try {
                const datos = JSON.parse(perfilCliente);
                if (datos.nombreCompleto) {
                    nombreClienteGlobal = datos.nombreCompleto;
                }
            } catch (e) {
                console.error("Error al parsear perfil del cliente:", e);
                nombreClienteGlobal = "Cliente";
            }
        } else {
            nombreClienteGlobal = "Cliente";
        }
    }


    // ===== RENDERIZAR TABLA (MODIFICADO) =====
    function renderizarSolicitudes() {
        const solicitudes = cargarSolicitudes();
        tbody.innerHTML = '';
        
        if (solicitudes.length === 0) {
            tbody.style.display = 'none';
            mensajeVacio.style.display = 'block';
            actualizarEstadisticas();
            return;
        }
        
        tbody.style.display = '';
        mensajeVacio.style.display = 'none';
        
        // --- ORDENAR POR MÁS RECIENTE PRIMERO ---
        solicitudes.sort((a, b) => {
             // Asumimos que el id 'cita_TIMESTAMP' es comparable
             // Un ID mayor (timestamp más grande) es más reciente
             return (b.id || 0) > (a.id || 0) ? 1 : -1;
        });
        
        solicitudes.forEach((solicitud) => {
            // Pasamos el ID real de la solicitud
            const fila = crearFilaSolicitud(solicitud, solicitud.id);
            tbody.appendChild(fila);
        });
        
        actualizarEstadisticas();
        // Aplicar el filtro actual después de renderizar
        const filtroActivo = document.querySelector('.pestana.activa').dataset.filtro || 'todas';
        filtrarTabla(filtroActivo);
    }

    function crearFilaSolicitud(solicitud, id) { // Usamos id en lugar de index
        const tr = document.createElement('tr');
        tr.setAttribute('data-estado', solicitud.estado.toLowerCase());
        tr.setAttribute('data-id', id); // Usar el ID real
        
        const nombreCliente = obtenerNombreCliente();
        const esReagendada = solicitud.historialCambios && solicitud.historialCambios.length > 0;
        const badgeReagendada = esReagendada ? '<span class="badge-reagendada">Reagendada</span>' : '';
        const asesorAsignado = solicitud.asesor || 'Sin asignar';
        const claseAsesor = solicitud.asesor ? '' : 'sin-asignar';
        
        const estadosClases = {
            'pendiente': 'pendiente',
            'completada': 'completada',
            'cancelada': 'cancelada'
        };

        // --- NUEVA LÓGICA DE MODALIDAD ---
        const modalidad = solicitud.modalidad || 'N/A';
        const modalidadClass = String(modalidad).toLowerCase().replace('/', '');
        const modalidadIcono = modalidad === 'Presencial'
            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10-7 10"></path><path d="m13 14-4-4 4-4"></path><path d="M4 14a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2"></path><path d="M20 14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2"></path></svg>`;
        // --- FIN DE NUEVA LÓGICA ---
        
        tr.innerHTML = `
            <td><span class="nombre-cliente">${nombreCliente}</span></td>
            <td>${solicitud.tipo}</td>
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
            <td><span class="badge-estado ${estadosClases[solicitud.estado.toLowerCase()]}">${solicitud.estado}</span></td>
            <td><span class="asesor-asignado ${claseAsesor}">${asesorAsignado}</span></td>
            <td>
                <div class="botones-accion-tabla">
                    ${solicitud.estado === 'Pendiente' ? `
                        <button class="btn-aceptar-tabla" data-id="${id}" title="Aceptar solicitud">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                        <button class="btn-rechazar-tabla" data-id="${id}" title="Rechazar solicitud">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    ` : `
                        <span style="font-size: 12px; color: #999;">Sin acciones</span>
                    `}
                </div>
            </td>
            <td style="text-align: center;">
                <button class="btn-detalles" data-id="${id}" title="Ver detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </td>
        `;
        
        return tr;
    }

    // ===== EVENT LISTENERS PARA BOTONES =====
    tbody.addEventListener('click', function(e) { // Delegación de eventos en Tbody
        const btnDetalles = e.target.closest('.btn-detalles');
        if (btnDetalles) {
            const id = btnDetalles.dataset.id;
            mostrarDetallesSolicitud(id);
            return;
        }
        
        const btnAceptar = e.target.closest('.btn-aceptar-tabla');
        if (btnAceptar) {
            const id = btnAceptar.dataset.id;
            mostrarModalAsignarAsesor(id);
            return;
        }
        
        const btnRechazar = e.target.closest('.btn-rechazar-tabla');
        if (btnRechazar) {
            const id = btnRechazar.dataset.id;
            mostrarModalRechazar(id);
            return;
        }
    });


    // ===== MODAL DE DETALLES (MODIFICADO) =====
    function mostrarDetallesSolicitud(id) {
        const solicitudes = cargarSolicitudes();
        const solicitud = solicitudes.find(s => s.id === id); // Encontrar por ID
        
        if (!solicitud) return;
        
        solicitudActual = { ...solicitud, id };
        
        const nombreCliente = obtenerNombreCliente();
        
        const estadosClases = {
            'pendiente': 'pendiente',
            'completada': 'completada',
            'cancelada': 'cancelada'
        };
        
        badgeEstadoModal.className = `badge-estado-modal ${estadosClases[solicitud.estado.toLowerCase()]}`;
        badgeEstadoModal.textContent = solicitud.estado;
        
        // --- NUEVA LÓGICA DE MODALIDAD ---
        const modalidad = solicitud.modalidad || 'N/A';
        const modalidadClass = modalidad === 'Meet' ? 'modalidad-meet' : (modalidad === 'Presencial' ? 'modalidad-presencial' : '');
        // --- FIN DE NUEVA LÓGICA ---

        let contenido = `
            <div class="grupo-info-modal">
                <div class="label-info-modal">Cliente</div>
                <div class="valor-info-modal">${nombreCliente}</div>
            </div>
            
            <div class="grupo-info-modal">
                <div class="label-info-modal">Tipo de Asesoría</div>
                <div class="valor-info-modal">${solicitud.tipo}</div>
            </div>
            
            <div class="grupo-info-modal">
                <div class="label-info-modal">Fecha y Hora</div>
                <div class="valor-info-modal">${solicitud.fecha} a las ${solicitud.hora}</div>
            </div>

            <div class="grupo-info-modal ${modalidadClass}">
                <div class="label-info-modal">Modalidad</div>
                <div class="valor-info-modal" style="font-weight: 600;">${modalidad}</div>
            </div>
            
            <div class="grupo-info-modal">
                <div class="label-info-modal">Estado</div>
                <div class="valor-info-modal">${solicitud.estado}</div>
            </div>
            
            <div class="grupo-info-modal">
                <div class="label-info-modal">Asesor Asignado</div>
                <div class="valor-info-modal">${solicitud.asesor || 'Sin asignar'}</div>
            </div>
        `;
        
        if (solicitud.notas && solicitud.notas !== 'Sin notas adicionales') {
            contenido += `
                <div class="grupo-mensaje-destacado">
                    <div class="label-info-modal">💬 Comentarios del Cliente</div>
                    <div class="mensaje-cliente-destacado">${solicitud.notas}</div>
                </div>
            `;
        }
        
        if (solicitud.notasAdmin) {
            contenido += `
                <div class="grupo-info-modal">
                    <div class="label-info-modal">📝 Notas del Administrador</div>
                    <div class="valor-info-modal" style="background-color: #fef3c7; padding: 12px; border-radius: 8px;">${solicitud.notasAdmin}</div>
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
            
            solicitud.historialCambios.forEach(cambio => {
                const claseTipo = cambio.tipo === 'reagendacion' ? 'reagendacion' : 
                                  cambio.tipo === 'cancelacion' ? 'cancelacion' : '';
                const tipoTexto = cambio.motivo || (cambio.tipo === 'reagendacion' ? '🔄 Reagendación' : 
                                  cambio.tipo === 'cancelacion' ? '❌ Cancelación' : '📝 Cambio');
                
                contenido += `
                    <div class="evento-historial ${claseTipo}">
                        <div class="evento-header">
                            <span class="evento-tipo">${tipoTexto}</span>
                            <span class="evento-fecha">${cambio.fecha || 'Fecha no disponible'}</span>
                        </div>
                        <div class="evento-detalles">
                            ${cambio.fechaAnterior ? `<strong>Fecha anterior:</strong> ${cambio.fechaAnterior} a las ${cambio.horaAnterior}<br>` : ''}
                            ${cambio.fechaNueva ? `<strong>Nueva fecha:</strong> ${cambio.fechaNueva} a las ${cambio.horaNueva}<br>` : ''}
                            ${cambio.asesorAsignado ? `<strong>Asesor:</strong> ${cambio.asesorAsignado}<br>` : ''}
                            ${cambio.notasAdmin ? `<strong>Notas:</strong> ${cambio.notasAdmin}` : ''}
                        </div>
                    </div>
                `;
            });
            
            contenido += `</div>`;
        }
        
        contenidoModalDetalles.innerHTML = contenido;
        
        modalFooterAcciones.innerHTML = ''; // Limpiar pie de modal
        if (solicitud.estado === 'Pendiente') {
            modalFooterAcciones.innerHTML = `
                <button class="boton-rechazar-modal" id="btn-rechazar-desde-detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    Rechazar
                </button>
                <button class="boton-aceptar-modal" id="btn-aceptar-desde-detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Aceptar
                </button>
            `;
            // Añadir event listeners a los nuevos botones
            document.getElementById('btn-aceptar-desde-detalles').addEventListener('click', cerrarModalDetallesYAbrirAsignacion);
            document.getElementById('btn-rechazar-desde-detalles').addEventListener('click', cerrarModalDetallesYAbrirRechazo);
        } else {
            modalFooterAcciones.innerHTML = `
                <button class="boton-cerrar-modal" id="btn-cerrar-desde-detalles">
                    Cerrar
                </button>
            `;
            document.getElementById('btn-cerrar-desde-detalles').addEventListener('click', cerrarModalDetallesFunc);
        }
        
        modalDetalles.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModalDetallesFunc() { // Renombrada
        modalDetalles.classList.remove('activo');
        if (document.querySelectorAll('.modal-overlay.activo').length === 0) {
            document.body.style.overflow = '';
        }
        solicitudActual = null;
    }

    // Funciones 'puente' para los botones del modal de detalles
    function cerrarModalDetallesYAbrirAsignacion() {
        if (solicitudActual) {
            const id = solicitudActual.id;
            cerrarModalDetallesFunc();
            setTimeout(() => mostrarModalAsignarAsesor(id), 300);
        }
    };

    function cerrarModalDetallesYAbrirRechazo() {
        if (solicitudActual) {
            const id = solicitudActual.id;
            cerrarModalDetallesFunc();
            setTimeout(() => mostrarModalRechazar(id), 300);
        }
    };

    if (cerrarModal) {
        cerrarModal.addEventListener('click', cerrarModalDetallesFunc);
    }

    if (modalDetalles) {
        modalDetalles.addEventListener('click', function(e) {
            if (e.target === modalDetalles) {
                cerrarModalDetallesFunc();
            }
        });
    }

    // ===== MODAL DE ASIGNACIÓN DE ASESOR (MODIFICADO) =====
    function mostrarModalAsignarAsesor(id) {
        const solicitudes = cargarSolicitudes();
        const solicitud = solicitudes.find(s => s.id === id); // Encontrar por ID
        
        if (!solicitud) return;
        
        solicitudActual = { ...solicitud, id };
        
        const nombreCliente = obtenerNombreCliente();
        
        // --- NUEVO CAMPO MODALIDAD ---
        const modalidad = solicitud.modalidad || 'N/A';

        infoClienteAsignacion.innerHTML = `
            <div class="info-item-confirmacion">
                <span class="label-info-confirmacion">Cliente:</span>
                <span class="valor-info-confirmacion">${nombreCliente}</span>
            </div>
            <div class="info-item-confirmacion">
                <span class="label-info-confirmacion">Tipo de Asesoría:</span>
                <span class="valor-info-confirmacion tipo-asesoria">${solicitud.tipo}</span>
            </div>
            <div class="info-item-confirmacion">
                <span class="label-info-confirmacion">Fecha:</span>
                <span class="valor-info-confirmacion">${solicitud.fecha}</span>
            </div>
            <div class="info-item-confirmacion">
                <span class="label-info-confirmacion">Hora:</span>
                <span class="valor-info-confirmacion">${solicitud.hora}</span>
            </div>
            <div class="info-item-confirmacion">
                <span class="label-info-confirmacion">Modalidad:</span>
                <span class="valor-info-confirmacion">${modalidad}</span>
            </div>
        `;
        
        selectAsesor.value = '';
        textareaNotasConfirmar.value = '';
        
        modalAsignarAsesor.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModalAsignacionFunc() {
        modalAsignarAsesor.classList.remove('activo');
        if (document.querySelectorAll('.modal-overlay.activo').length === 0) {
            document.body.style.overflow = '';
        }
        selectAsesor.value = '';
        textareaNotasConfirmar.value = '';
    }

    function confirmarAsignacion() {
        if (!solicitudActual) return;
        
        const asesorSeleccionado = selectAsesor.value;
        
        if (!asesorSeleccionado) {
            alert('⚠️ Por favor selecciona un asesor antes de confirmar');
            return;
        }
        
        const notas = textareaNotasConfirmar.value.trim();
        const solicitudes = cargarSolicitudes();
        
        // Encontrar la solicitud por ID
        const index = solicitudes.findIndex(s => s.id === solicitudActual.id);
        if (index === -1) return; // No se encontró

        // Actualizar la solicitud
        solicitudes[index].estado = 'Completada';
        solicitudes[index].asesor = asesorSeleccionado;
        solicitudes[index].fechaConfirmacion = new Date().toISOString();
        
        if (notas) {
            solicitudes[index].notasAdmin = notas;
        }
        
        if (!solicitudes[index].historialCambios) {
            solicitudes[index].historialCambios = [];
        }
        
        solicitudes[index].historialCambios.push({
            tipo: 'confirmacion',
            fecha: new Date().toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            asesorAsignado: asesorSeleccionado,
            notasAdmin: notas || 'Sin notas adicionales',
            motivo: 'Confirmada y Asignada por Admin' // Añadido para consistencia
        });
        
        guardarSolicitudes(solicitudes);
        cerrarModalAsignacionFunc();
        mostrarNotificacion(`✅ Solicitud confirmada y asignada a ${asesorSeleccionado}`, 'exito');
        solicitudActual = null;
    }

    if (btnCancelarAsignacion) {
        btnCancelarAsignacion.addEventListener('click', cerrarModalAsignacionFunc);
    }
    if (btnConfirmarAsignacion) {
        btnConfirmarAsignacion.addEventListener('click', confirmarAsignacion);
    }
    if (cerrarModalAsignacion) {
        cerrarModalAsignacion.addEventListener('click', cerrarModalAsignacionFunc);
    }
    if (modalAsignarAsesor) {
        modalAsignarAsesor.addEventListener('click', function(e) {
            if (e.target === modalAsignarAsesor) {
                cerrarModalAsignacionFunc();
            }
        });
    }

    // ===== MODAL DE RECHAZO =====
    function mostrarModalRechazar(id) {
        const solicitudes = cargarSolicitudes();
        const solicitud = solicitudes.find(s => s.id === id); // Encontrar por ID
        
        if (!solicitud) return;
        
        solicitudActual = { ...solicitud, id };
        
        const nombreCliente = obtenerNombreCliente();
        
        infoClienteRechazar.innerHTML = `
            <div class="info-item-confirmacion">
                <span class="label-info-confirmacion">Cliente:</span>
                <span class="valor-info-confirmacion">${nombreCliente}</span>
            </div>
            <div class="info-item-confirmacion">
                <span class="label-info-confirmacion">Tipo de Asesoría:</span>
                <span class="valor-info-confirmacion tipo-asesoria">${solicitud.tipo}</span>
            </div>
        `;
        
        textareaNotasRechazar.value = '';
        
        modalRechazar.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModalRechazoFunc() { // Renombrada
        modalRechazar.classList.remove('activo');
        if (document.querySelectorAll('.modal-overlay.activo').length === 0) {
            document.body.style.overflow = '';
        }
        textareaNotasRechazar.value = '';
    }

    function confirmarRechazo() {
        if (!solicitudActual) return;
        
        const notas = textareaNotasRechazar.value.trim();
        // Opcional: hacer que el motivo sea obligatorio
        // if (!notas) {
        //     alert('⚠️ Por favor ingrese un motivo de rechazo.');
        //     return;
        // }
        
        const solicitudes = cargarSolicitudes();
        const index = solicitudes.findIndex(s => s.id === solicitudActual.id);
        if (index === -1) return;

        solicitudes[index].estado = 'Cancelada';
        solicitudes[index].fechaRechazo = new Date().toISOString();
        
        if (notas) {
            solicitudes[index].notasAdmin = notas;
        }
        
        if (!solicitudes[index].historialCambios) {
            solicitudes[index].historialCambios = [];
        }
        
        solicitudes[index].historialCambios.push({
            tipo: 'cancelacion', // 'cancelacion' es más consistente
            fecha: new Date().toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            motivo: notas || 'Rechazada por Admin',
            notasAdmin: notas
        });
        
        guardarSolicitudes(solicitudes);
        cerrarModalRechazoFunc();
        mostrarNotificacion('❌ Solicitud rechazada correctamente', 'error');
        solicitudActual = null;
    }

    if (btnCancelarRechazar) {
        btnCancelarRechazar.addEventListener('click', cerrarModalRechazoFunc);
    }
    if (btnConfirmarRechazo) {
        btnConfirmarRechazo.addEventListener('click', confirmarRechazo);
    }
    if (cerrarModalRechazar) {
        cerrarModalRechazar.addEventListener('click', cerrarModalRechazoFunc);
    }
    if (modalRechazar) {
        modalRechazar.addEventListener('click', function(e) {
            if (e.target === modalRechazar) {
                cerrarModalRechazoFunc();
            }
        });
    }

    // ===== NOTIFICACIONES DINÁMICAS =====
    function mostrarNotificacion(mensaje, tipo = 'exito') {
        const colores = {
            'exito': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            'error': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            'info': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        };
        
        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colores[tipo]};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-size: 14px;
            font-weight: 500;
            max-width: 400px;
        `;
        
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (document.body.contains(notificacion)) {
                    document.body.removeChild(notificacion);
                }
            }, 300);
        }, 3000);
    }
    
    // Inyectar animaciones CSS para la notificación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(110%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(110%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);


    // ===== PESTAÑAS =====
    function posicionarIndicador() {
        const pestanaActiva = document.querySelector('.pestana.activa');
        if (pestanaActiva && indicador && window.innerWidth > 768) { // Añadida comprobación
            const rect = pestanaActiva.getBoundingClientRect();
            const contenedorRect = contenedorPestanas.getBoundingClientRect();
            
            indicador.style.width = rect.width + 'px';
            indicador.style.left = (rect.left - contenedorRect.left) + 'px';
        }
    }

    function cambiarPestana(pestana) {
        const filtro = pestana.getAttribute('data-filtro');
        
        pestanas.forEach(p => p.classList.remove('activa'));
        pestana.classList.add('activa');
        contenedorPestanas.setAttribute('data-activa', filtro);
        
        posicionarIndicador();
        filtrarTabla(filtro);
    }

    pestanas.forEach(pestana => {
        pestana.addEventListener('click', function() {
            cambiarPestana(this);
        });
    });

    // ===== FILTRAR TABLA =====
    function filtrarTabla(filtro) {
        const filas = tbody.querySelectorAll('tr');
        let filasVisibles = 0;
        
        filas.forEach(fila => {
            const estado = fila.getAttribute('data-estado');
            
            if (filtro === 'todas') {
                fila.style.display = '';
                filasVisibles++;
            } else if (estado === filtro) {
                fila.style.display = '';
                filasVisibles++;
            } else {
                fila.style.display = 'none';
            }
        });
        
        if (filasVisibles === 0 && filas.length > 0) {
            mensajeVacio.style.display = 'block';
        } else if (filas.length > 0) {
            mensajeVacio.style.display = 'none';
        }
        
        actualizarInfoPaginacion(filasVisibles, cargarSolicitudes().length);
    }

    function actualizarInfoPaginacion(visibles, total) {
        const infoPaginacion = document.getElementById('info-paginacion');
        if (infoPaginacion) {
            infoPaginacion.textContent = `Mostrando ${visibles} de ${total} registros`;
        }
    }

    // ===== ACTUALIZAR ESTADÍSTICAS =====
    function actualizarEstadisticas() {
        const solicitudes = cargarSolicitudes();
        
        let totalCitas = solicitudes.length;
        let pendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
        let confirmadas = solicitudes.filter(s => s.estado === 'Completada').length;
        let reagendadas = solicitudes.filter(s => s.estado === 'Cancelada').length;
        
        document.getElementById('total-citas').textContent = totalCitas;
        document.getElementById('pendientes').textContent = pendientes;
        document.getElementById('confirmadas').textContent = confirmadas;
        document.getElementById('reagendadas').textContent = reagendadas;
    }

    // ===== INICIALIZAR =====
    cargarNombreClienteGlobal(); // Cargar el nombre del cliente primero
    renderizarSolicitudes(); // Luego renderizar
    posicionarIndicador(); // Posicionar el indicador después de renderizar

    // Sincronizar esta pestaña si otra actualiza los datos
    window.addEventListener('solicitudesActualizadas', () => {
        console.log('Sincronizando solicitudes desde otra pestaña...');
        cargarNombreClienteGlobal();
        renderizarSolicitudes();
    });
    
    // Sincronizar al volver a enfocar la pestaña
    window.addEventListener('focus', () => {
        cargarNombreClienteGlobal();
        renderizarSolicitudes();
    });

    // Cierre de modales con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // (La lógica del menú ya la maneja Perfil_Administrador.js)
            if (modalDetalles.classList.contains('activo')) {
                cerrarModalDetallesFunc();
            }
            if (modalAsignarAsesor.classList.contains('activo')) {
                cerrarModalAsignacionFunc();
            }
            if (modalRechazar.classList.contains('activo')) {
                cerrarModalRechazoFunc();
            }
        }
    });

}); // Fin de DOMContentLoaded
async function obtenerCitasCliente(idCliente) {
    const res = await fetch(`https://3.231.210.28:7000/cita/cliente/${idCliente}`);

    if (!res.ok) {
        console.error("Error al obtener citas");
        return [];
    }

    return await res.json();
}
async function cambiarEstadoCita(idCita, accion) {
    const res = await fetch(`https://3.231.210.28:7000/cita/cambiarEstado/${idCita}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion })
    });

    return await res.json();
}
async function marcarPagada(idCita) {
    const res = await fetch(`https://3.231.210.28:7000/cita/pago/${idCita}`, {
        method: "PUT"
    });

    return await res.json();
}

