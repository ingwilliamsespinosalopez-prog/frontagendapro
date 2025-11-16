document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    const botonHamburguesa = document.getElementById('boton-hamburguesa');
    const menuLateral = document.getElementById('menu-lateral');
    const overlayMenu = document.getElementById('overlay-menu');
    const enlacesMenu = document.querySelectorAll('.item-menu');
    const tbodyAsesorias = document.getElementById('tbody-asesorias');
    const filtroBuscar = document.getElementById('filtro-buscar');
    const filtroEstado = document.getElementById('filtro-estado');
    const logoutButton = document.getElementById('logout-button');
    const modalLogout = document.getElementById('modal-logout');
    const btnLogoutVolver = document.getElementById('btn-logout-volver');
    const btnLogoutConfirmar = document.getElementById('btn-logout-confirmar');
    
    // Elementos del modal reagendar
    const modalReagendar = document.getElementById('modal-reagendar');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCancelarReagendar = document.getElementById('btn-cancelar-reagendar');
    const formReagendar = document.getElementById('form-reagendar');
    const infoCitaActual = document.getElementById('info-cita-actual');
    const inputNuevaFecha = document.getElementById('nueva-fecha');
    const inputNuevaHora = document.getElementById('nueva-hora');
    const inputMotivoReagendar = document.getElementById('motivo-reagendar');
    
    // ===== DATOS =====
    let asesorias = [];
    let asesoriasOriginales = [];
    let asesoriaSeleccionada = null;
    
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
            if (modalReagendar && modalReagendar.classList.contains('activo')) {
                cerrarModalReagendar();
            }
            if (modalLogout && modalLogout.classList.contains('activo')) {
                cerrarModalLogout();
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
            abrirModalLogout();
        });
    }
    
    if (btnLogoutVolver) {
        btnLogoutVolver.addEventListener('click', function() {
            cerrarModalLogout();
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
                cerrarModalLogout();
            }
        });
    }
    
    function abrirModalLogout() {
        if (modalLogout) {
            modalLogout.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function cerrarModalLogout() {
        if (modalLogout) {
            modalLogout.classList.remove('activo');
            document.body.style.overflow = '';
        }
    }
    
    // ===== FUNCIONES DE MODAL REAGENDAR =====
    function abrirModalReagendar(index) {
        asesoriaSeleccionada = index;
        const asesoria = asesorias[index];
        
        infoCitaActual.innerHTML = `
            <strong>Fecha:</strong> ${asesoria.fecha}<br>
            <strong>Hora:</strong> ${asesoria.hora}<br>
            <strong>Tipo:</strong> ${asesoria.tipo}<br>
            <strong>Asesor:</strong> ${asesoria.asesor || 'Por asignar'}
        `;
        
        const hoy = new Date();
        const fechaMin = hoy.toISOString().split('T')[0];
        inputNuevaFecha.min = fechaMin;
        
        formReagendar.reset();
        
        modalReagendar.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarModalReagendar() {
        modalReagendar.classList.remove('activo');
        document.body.style.overflow = '';
        asesoriaSeleccionada = null;
        formReagendar.reset();
    }
    
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', cerrarModalReagendar);
    }
    
    if (btnCancelarReagendar) {
        btnCancelarReagendar.addEventListener('click', cerrarModalReagendar);
    }
    
    modalReagendar?.addEventListener('click', function(e) {
        if (e.target === modalReagendar) {
            cerrarModalReagendar();
        }
    });
    
    // ===== FUNCIONES DE ASESORÍAS =====
    function cancelarCita(index) {
        const asesoria = asesorias[index];
        
        const confirmar = confirm(
            `¿Estás seguro de que deseas cancelar la asesoría?\n\n` +
            `Fecha: ${asesoria.fecha}\n` +
            `Hora: ${asesoria.hora}\n` +
            `Tipo: ${asesoria.tipo}\n` +
            `Asesor: ${asesoria.asesor || 'Por asignar'}`
        );
        
        if (confirmar) {
            const indexOriginal = asesoriasOriginales.findIndex(a => 
                a.fecha === asesoria.fecha && 
                a.hora === asesoria.hora && 
                a.tipo === asesoria.tipo &&
                a.asesor === asesoria.asesor
            );
            
            if (indexOriginal !== -1) {
                asesoriasOriginales[indexOriginal].estado = 'Cancelada';
                asesoriasOriginales[indexOriginal].notas = 'Cancelada por el cliente';
                
                if (!asesoriasOriginales[indexOriginal].historialCambios) {
                    asesoriasOriginales[indexOriginal].historialCambios = [];
                }
                
                asesoriasOriginales[indexOriginal].historialCambios.push({
                    tipo: 'cancelacion',
                    fecha: new Date().toLocaleString('es-MX', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    motivo: 'Cancelada por el cliente'
                });
                
                guardarAsesorias();
                filtrarAsesorias();
                mostrarNotificacion('✅ Asesoría cancelada exitosamente', 'exito');
            }
        }
    }
    
    function reagendarCita(e) {
        e.preventDefault();
        
        if (asesoriaSeleccionada === null) return;
        
        const asesoria = asesorias[asesoriaSeleccionada];
        const nuevaFecha = inputNuevaFecha.value;
        const nuevaHora = inputNuevaHora.value;
        const motivo = inputMotivoReagendar.value;
        
        const fechaFormateada = formatearFecha(nuevaFecha);
        if (fechaFormateada === asesoria.fecha && nuevaHora === asesoria.hora) {
            alert('⚠️ La nueva fecha y hora deben ser diferentes a la cita actual');
            return;
        }
        
        const indexOriginal = asesoriasOriginales.findIndex(a => 
            a.fecha === asesoria.fecha && 
            a.hora === asesoria.hora && 
            a.tipo === asesoria.tipo &&
            a.asesor === asesoria.asesor
        );
        
        if (indexOriginal !== -1) {
            const fechaAnterior = asesoriasOriginales[indexOriginal].fecha;
            const horaAnterior = asesoriasOriginales[indexOriginal].hora;
            
            asesoriasOriginales[indexOriginal].fecha = fechaFormateada;
            asesoriasOriginales[indexOriginal].hora = nuevaHora;
            
            const notaReagendacion = motivo 
                ? `Reagendada - Motivo: ${motivo}` 
                : 'Reagendada por el cliente';
            asesoriasOriginales[indexOriginal].notas = notaReagendacion;
            
            if (asesoriasOriginales[indexOriginal].estado === 'Cancelada') {
                asesoriasOriginales[indexOriginal].estado = 'Pendiente';
            }
            
            if (!asesoriasOriginales[indexOriginal].historialCambios) {
                asesoriasOriginales[indexOriginal].historialCambios = [];
            }
            
            asesoriasOriginales[indexOriginal].historialCambios.push({
                tipo: 'reagendacion',
                fecha: new Date().toLocaleString('es-MX', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                fechaAnterior: fechaAnterior,
                horaAnterior: horaAnterior,
                fechaNueva: fechaFormateada,
                horaNueva: nuevaHora,
                motivo: motivo || 'Reagendada por el cliente'
            });
            
            guardarAsesorias();
            filtrarAsesorias();
            cerrarModalReagendar();
            mostrarNotificacion('✅ Asesoría reagendada exitosamente', 'exito');
        }
    }
    
    if (formReagendar) {
        formReagendar.addEventListener('submit', reagendarCita);
    }
    
    // ===== UTILIDADES =====
    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO + 'T00:00:00');
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    }
    
    function guardarAsesorias() {
        localStorage.setItem('afgcorporacion_asesorias_cliente', JSON.stringify(asesoriasOriginales));
        window.dispatchEvent(new Event('solicitudesActualizadas'));
    }
    
    function mostrarNotificacion(mensaje, tipo) {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.textContent = mensaje;
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${tipo === 'exito' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ===== RENDERIZAR ASESORÍAS =====
    function renderizarAsesorias() {
        if (!tbodyAsesorias) return;
        
        tbodyAsesorias.innerHTML = '';
        
        if (asesorias.length === 0) {
            if (asesoriasOriginales.length === 0) {
                tbodyAsesorias.innerHTML = `
                    <tr class="fila-vacia">
                        <td colspan="7">
                            <div class="mensaje-vacio">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <p>📅 No hay asesorías en tu historial</p>
                                <p class="texto-secundario">Las asesorías que realices aparecerán aquí</p>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                tbodyAsesorias.innerHTML = `
                    <tr class="fila-vacia">
                        <td colspan="7">
                            <div class="mensaje-vacio">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <p>No se encontraron resultados</p>
                                <p class="texto-secundario">Intenta con otros filtros de búsqueda</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
            return;
        }
        
        asesorias.forEach((asesoria, index) => {
            const fila = crearFilaAsesoria(asesoria, index);
            tbodyAsesorias.appendChild(fila);
        });
    }
    
    // ===== CREAR FILA DE ASESORÍA =====
    function crearFilaAsesoria(asesoria, index) {
        const tr = document.createElement('tr');
        const estadoClase = asesoria.estado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        const puedeModificar = asesoria.estado === 'Pendiente';
        
        const asesorInfo = asesoria.asesor 
            ? `<div style="margin-top: 6px; font-size: 12px; color: #059669;">
                <strong>Asesor:</strong> ${asesoria.asesor}
               </div>` 
            : '';
        
        tr.innerHTML = `
            <td><strong>${asesoria.fecha}</strong></td>
            <td><strong>${asesoria.hora}</strong></td>
            <td><strong>${asesoria.tipo}</strong></td>
            <td>${asesoria.asesor || 'Por asignar'}</td>
            <td>
                <span class="badge-estado ${estadoClase}">${asesoria.estado}</span>
                ${asesorInfo}
            </td>
            <td>${asesoria.notas}</td>
            <td>
                <div class="acciones-celda">
                    <button class="btn-accion btn-reagendar" 
                            data-index="${index}" 
                            ${!puedeModificar ? 'disabled' : ''}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Reagendar
                    </button>
                    <button class="btn-accion btn-cancelar" 
                            data-index="${index}"
                            ${!puedeModificar ? 'disabled' : ''}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        Cancelar
                    </button>
                </div>
            </td>
        `;
        
        const btnReagendar = tr.querySelector('.btn-reagendar');
        const btnCancelar = tr.querySelector('.btn-cancelar');
        
        if (btnReagendar && puedeModificar) {
            btnReagendar.addEventListener('click', () => abrirModalReagendar(index));
        }
        
        if (btnCancelar && puedeModificar) {
            btnCancelar.addEventListener('click', () => cancelarCita(index));
        }
        
        return tr;
    }
    
    // ===== FILTRAR ASESORÍAS =====
    function filtrarAsesorias() {
        if (!filtroBuscar || !filtroEstado) return;

        const textoBusqueda = filtroBuscar.value.toLowerCase().trim();
        const estadoSeleccionado = filtroEstado.value;
        
        asesorias = asesoriasOriginales.filter(asesoria => {
            const cumpleBusqueda = textoBusqueda === '' || 
                (asesoria.tipo && asesoria.tipo.toLowerCase().includes(textoBusqueda)) ||
                (asesoria.asesor && asesoria.asesor.toLowerCase().includes(textoBusqueda)) ||
                (asesoria.notas && asesoria.notas.toLowerCase().includes(textoBusqueda));
            
            const cumpleEstado = estadoSeleccionado === '' || 
                (asesoria.estado && asesoria.estado === estadoSeleccionado);
            
            return cumpleBusqueda && cumpleEstado;
        });
        
        renderizarAsesorias();
    }
    
    if (filtroBuscar) {
        filtroBuscar.addEventListener('input', filtrarAsesorias);
    }
    
    if (filtroEstado) {
        filtroEstado.addEventListener('change', filtrarAsesorias);
    }
    
    // ===== ANIMACIONES DE ENTRADA =====
    function animarFilas() {
        const filas = document.querySelectorAll('.tabla-asesorias tbody tr:not(.fila-vacia)');
        filas.forEach((fila, index) => {
            fila.style.opacity = '0';
            fila.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                fila.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                fila.style.opacity = '1';
                fila.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }
    
    // ===== CARGAR DESDE LOCALSTORAGE =====
    function cargarAsesorias() {
        const asesoríasGuardadas = localStorage.getItem('afgcorporacion_asesorias_cliente');
        if (asesoríasGuardadas) {
            try {
                const datos = JSON.parse(asesoríasGuardadas);
                if (Array.isArray(datos) && datos.length > 0) {
                    asesorias = datos;
                    asesoriasOriginales = [...datos];
                }
            } catch (e) {
                console.error('Error al cargar asesorías:', e);
            }
        }
    }
    
    // ===== SINCRONIZACIÓN AUTOMÁTICA =====
    window.addEventListener('storage', function(e) {
        if (e.key === 'afgcorporacion_asesorias_cliente') {
            cargarAsesorias();
            filtrarAsesorias();
        }
    });
    
    window.addEventListener('solicitudesActualizadas', function() {
        cargarAsesorias();
        filtrarAsesorias();
    });

    // ===== INICIALIZAR =====
    cargarAsesorias();
    renderizarAsesorias();
    
    if (asesorias.length > 0) {
        setTimeout(animarFilas, 100);
    }
    
    console.log('✅ Historial de Asesorías AFGCORPORACIÓN cargado correctamente');
    console.log('📊 Asesorías cargadas desde localStorage:', asesoriasOriginales.length);
});