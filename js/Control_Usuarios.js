// ===== CONTROL DE USUARIOS - JAVASCRIPT ESPECÍFICO =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== VARIABLES GLOBALES =====
    let usuarioActualEditar = null;
    let filaActualEliminar = null;
    
    // ===== DATOS DE EJEMPLO =====
    const datosIniciales = {
        asesores: [
            { id: 'A-01', nombre: 'Juan Diego Ramos Altamirano', email: 'juan.ramos@afgcorp.com', rol: 'asesor', estado: 'activo' },
            { id: 'A-02', nombre: 'María González Pérez', email: 'maria.gonzalez@afgcorp.com', rol: 'asesor', estado: 'activo' },
            { id: 'A-03', nombre: 'Carlos Hernández López', email: 'carlos.hernandez@afgcorp.com', rol: 'asesor', estado: 'activo' },
            { id: 'A-04', nombre: 'Ana Martínez Ruiz', email: 'ana.martinez@afgcorp.com', rol: 'asesor', estado: 'inactivo' }
        ],
        clientes: [
            { id: 'C-01', nombre: 'Roberto Sánchez Castro', email: 'roberto.sanchez@cliente.com', rol: 'cliente', estado: 'activo' },
            { id: 'C-02', nombre: 'Laura Jiménez Morales', email: 'laura.jimenez@cliente.com', rol: 'cliente', estado: 'activo' },
            { id: 'C-03', nombre: 'Fernando Torres Vega', email: 'fernando.torres@cliente.com', rol: 'cliente', estado: 'activo' }
        ]
    };

    // ===== FUNCIÓN PARA GENERAR CONTRASEÑA ALEATORIA =====
    function generarPasswordAleatoria() {
        const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const minusculas = 'abcdefghijklmnopqrstuvwxyz';
        const numeros = '0123456789';
        const especiales = '!@#$%&*';
        const todos = mayusculas + minusculas + numeros + especiales;
        
        let password = '';
        password += mayusculas[Math.floor(Math.random() * mayusculas.length)];
        password += minusculas[Math.floor(Math.random() * minusculas.length)];
        password += numeros[Math.floor(Math.random() * numeros.length)];
        password += especiales[Math.floor(Math.random() * especiales.length)];
        
        for (let i = 4; i < 12; i++) {
            password += todos[Math.floor(Math.random() * todos.length)];
        }
        
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    }

    // ===== FUNCIÓN PARA VALIDAR EMAIL =====
    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    // ===== FUNCIÓN PARA MOSTRAR ERROR =====
    function mostrarError(inputId, mensaje) {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(`error-${inputId.replace('input-', '').replace('detalle-', '')}`);
        
        if (input) input.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = mensaje;
            errorSpan.classList.add('show');
        }
    }

    // ===== FUNCIÓN PARA LIMPIAR ERROR =====
    function limpiarError(inputId) {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(`error-${inputId.replace('input-', '').replace('detalle-', '')}`);
        
        if (input) input.classList.remove('error');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.remove('show');
        }
    }

    // ===== CARGAR DATOS INICIALES =====
    function cargarDatosIniciales() {
        const tbodyAsesores = document.getElementById('tbody-asesores');
        const tbodyClientes = document.getElementById('tbody-clientes');
        
        if (tbodyAsesores) {
            datosIniciales.asesores.forEach(usuario => {
                agregarFilaTabla(usuario, tbodyAsesores);
            });
        }
        
        if (tbodyClientes) {
            datosIniciales.clientes.forEach(usuario => {
                agregarFilaTabla(usuario, tbodyClientes);
            });
        }
        
        actualizarEstadisticas();
    }

    // ===== FUNCIÓN PARA AGREGAR FILA A TABLA =====
    function agregarFilaTabla(usuario, tbody) {
        const iniciales = usuario.nombre.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
        const colores = ['#1a6b8a', '#0891b2', '#0e7490', '#155e75', '#059669', '#10b981', '#34d399'];
        const color = colores[Math.floor(Math.random() * colores.length)];
        
        const fila = document.createElement('tr');
        fila.setAttribute('data-id', usuario.id);
        fila.setAttribute('data-nombre', usuario.nombre);
        fila.setAttribute('data-email', usuario.email);
        fila.setAttribute('data-rol', usuario.rol);
        fila.setAttribute('data-estado', usuario.estado);
        fila.setAttribute('data-color', color);
        
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>
                <div class="celda-usuario">
                    <div class="avatar-usuario" style="background-color: ${color};">${iniciales}</div>
                    <span>${usuario.nombre}</span>
                </div>
            </td>
            <td><span class="badge-rol ${usuario.rol === 'cliente' ? 'badge-cliente' : ''}">${usuario.rol === 'asesor' ? 'Asesor' : 'Cliente'}</span></td>
            <td><span class="badge-estado ${usuario.estado}">${usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <div class="acciones">
                    <button class="btn-accion btn-ver" title="Ver detalles">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="btn-accion btn-eliminar" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(fila);
        agregarEventListenersBotones(fila);
    }

    // ===== TABS =====
    const tabsBotones = document.querySelectorAll('.tab-boton');
    
    tabsBotones.forEach(boton => {
        boton.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabsBotones.forEach(btn => btn.classList.remove('activo'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('activo'));
            
            this.classList.add('activo');
            document.getElementById('panel-' + tabId).classList.add('activo');
        });
    });

    // ===== NOTIFICACIÓN =====
    const notificacionBanner = document.getElementById('notificacion-banner');
    let timeoutNotificacion = null;

    function mostrarNotificacion(mensaje) {
        if (!notificacionBanner) return;
        
        const mensajeSpan = document.getElementById('notificacion-mensaje');
        if (mensajeSpan) mensajeSpan.textContent = mensaje;
        
        if (timeoutNotificacion) clearTimeout(timeoutNotificacion);
        
        notificacionBanner.classList.add('mostrar');
        
        timeoutNotificacion = setTimeout(() => {
            notificacionBanner.classList.remove('mostrar');
        }, 5000);
    }

    const cerrarNotificacion = document.getElementById('cerrar-notificacion');
    if (cerrarNotificacion) {
        cerrarNotificacion.addEventListener('click', function() {
            notificacionBanner.classList.remove('mostrar');
        });
    }

    // ===== MODALES =====
    const modalCrearUsuario = document.getElementById('modal-crear-usuario');
    const modalConfirmarCancelar = document.getElementById('modal-confirmar-cancelar');
    const modalDatosCorrectos = document.getElementById('modal-datos-correctos');
    const modalConfirmarEliminar = document.getElementById('modal-confirmar-eliminar');
    const modalVerDetalles = document.getElementById('modal-ver-detalles');
    
    function abrirModal(modal) {
        if (modal) {
            modal.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }

    function cerrarModal(modal) {
        if (modal) {
            modal.classList.remove('activo');
            // Solo quita el overflow si no hay otros modales activos
            if (document.querySelectorAll('.modal-overlay.activo').length === 0) {
                document.body.style.overflow = '';
            }
        }
    }

    // ===== BOTÓN GENERAR CONTRASEÑA (CREAR) =====
    const btnGenerarPassword = document.getElementById('btn-generar-password');
    const inputPassword = document.getElementById('input-password');
    
    if (btnGenerarPassword && inputPassword) {
        btnGenerarPassword.addEventListener('click', function() {
            inputPassword.value = generarPasswordAleatoria();
        });
    }

    // ===== BOTÓN COPIAR CONTRASEÑA (CREAR) =====
    const btnCopiarPassword = document.getElementById('btn-copiar-password');
    
    if (btnCopiarPassword && inputPassword) {
        btnCopiarPassword.addEventListener('click', function() {
            const password = inputPassword.value;
            if (!password) {
                alert('Primero genera una contraseña');
                return;
            }
            
            navigator.clipboard.writeText(password).then(() => {
                btnCopiarPassword.classList.add('copiado');
                setTimeout(() => btnCopiarPassword.classList.remove('copiado'), 2000);
            });
        });
    }

    // ===== BOTONES GENERAR/COPIAR CONTRASEÑA (EDITAR) =====
    const btnGenerarPasswordDetalle = document.getElementById('btn-generar-password-detalle');
    const inputPasswordDetalle = document.getElementById('detalle-password');
    const btnCopiarPasswordDetalle = document.getElementById('btn-copiar-password-detalle');
    
    if (btnGenerarPasswordDetalle && inputPasswordDetalle) {
        btnGenerarPasswordDetalle.addEventListener('click', function() {
            inputPasswordDetalle.value = generarPasswordAleatoria();
        });
    }
    
    if (btnCopiarPasswordDetalle && inputPasswordDetalle) {
        btnCopiarPasswordDetalle.addEventListener('click', function() {
            const password = inputPasswordDetalle.value;
            if (!password) {
                alert('No hay contraseña para copiar');
                return;
            }
            
            navigator.clipboard.writeText(password).then(() => {
                btnCopiarPasswordDetalle.classList.add('copiado');
                setTimeout(() => btnCopiarPasswordDetalle.classList.remove('copiado'), 2000);
            });
        });
    }

    // ===== ABRIR MODAL CREAR USUARIO =====
    const btnAgregarUsuario = document.getElementById('btn-agregar-usuario');
    
    if (btnAgregarUsuario) {
        btnAgregarUsuario.addEventListener('click', function() {
            if (inputPassword) inputPassword.value = generarPasswordAleatoria();
            
            const rolSelect = document.getElementById('input-rol');
            actualizarIdAutogenerado(rolSelect ? rolSelect.value : 'asesor');
            
            abrirModal(modalCrearUsuario);
        });
    }

    // ===== ACTUALIZAR ID AUTOGENERADO =====
    function actualizarIdAutogenerado(rol) {
        const inputId = document.getElementById('input-id-auto');
        if (!inputId) return;
        
        const tbody = document.getElementById(rol === 'asesor' ? 'tbody-asesores' : 'tbody-clientes');
        const filas = tbody ? tbody.querySelectorAll('tr').length : 0;
        const prefijo = rol === 'asesor' ? 'A' : 'C';
        const nuevoId = prefijo + '-' + String(filas + 1).padStart(2, '0');
        
        inputId.value = nuevoId;
    }

    const inputRol = document.getElementById('input-rol');
    if (inputRol) {
        inputRol.addEventListener('change', function() {
            actualizarIdAutogenerado(this.value);
        });
    }

    // ===== CERRAR MODAL CREAR =====
    const cerrarModalCrear = document.getElementById('cerrar-modal-crear');
    const btnCancelarCrear = document.getElementById('btn-cancelar-crear');
    
    if (cerrarModalCrear) {
        cerrarModalCrear.addEventListener('click', () => abrirModal(modalConfirmarCancelar));
    }
    
    if (btnCancelarCrear) {
        btnCancelarCrear.addEventListener('click', () => abrirModal(modalConfirmarCancelar));
    }

    // ===== CONFIRMAR CANCELAR =====
    const btnVolver = document.getElementById('btn-volver');
    const btnConfirmarCancelar = document.getElementById('btn-confirmar-cancelar');
    
    if (btnVolver) {
        btnVolver.addEventListener('click', () => cerrarModal(modalConfirmarCancelar));
    }
    
    if (btnConfirmarCancelar) {
        btnConfirmarCancelar.addEventListener('click', function() {
            cerrarModal(modalConfirmarCancelar);
            cerrarModal(modalCrearUsuario);
            limpiarFormulario();
        });
    }

    // ===== SUBMIT FORMULARIO CREAR =====
    const formCrearUsuario = document.getElementById('form-crear-usuario');
    
    if (formCrearUsuario) {
        formCrearUsuario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            limpiarError('input-usuario');
            limpiarError('input-email');
            
            const usuario = document.getElementById('input-usuario').value.trim();
            const email = document.getElementById('input-email').value.trim();
            const rol = document.getElementById('input-rol').value;
            const password = document.getElementById('input-password').value;
            
            let hayErrores = false;
            
            if (!usuario) {
                mostrarError('input-usuario', 'El nombre es requerido');
                hayErrores = true;
            } else if (usuario.length < 3) {
                mostrarError('input-usuario', 'El nombre debe tener al menos 3 caracteres');
                hayErrores = true;
            }
            
            if (!email) {
                mostrarError('input-email', 'El email es requerido');
                hayErrores = true;
            } else if (!validarEmail(email)) {
                mostrarError('input-email', 'Ingresa un email válido');
                hayErrores = true;
            }
            
            if (!password) {
                alert('Por favor genera una contraseña');
                return;
            }
            
            if (hayErrores) return;
            
            const emailConfirmacion = document.getElementById('email-confirmacion');
            if (emailConfirmacion) emailConfirmacion.textContent = email;
            
            abrirModal(modalDatosCorrectos);
        });
    }

    // ===== CONFIRMAR CREAR =====
    const btnRevisar = document.getElementById('btn-revisar');
    const btnConfirmarCrear = document.getElementById('btn-confirmar-crear');
    
    if (btnRevisar) {
        btnRevisar.addEventListener('click', () => cerrarModal(modalDatosCorrectos));
    }
    
    if (btnConfirmarCrear) {
        btnConfirmarCrear.addEventListener('click', function() {
            cerrarModal(modalDatosCorrectos);
            cerrarModal(modalCrearUsuario);
            
            const usuario = document.getElementById('input-usuario').value.trim();
            const email = document.getElementById('input-email').value.trim();
            const rol = document.getElementById('input-rol').value;
            const password = document.getElementById('input-password').value;
            const id = document.getElementById('input-id-auto').value;
            
            const nuevoUsuario = {
                id: id,
                nombre: usuario,
                email: email,
                rol: rol,
                estado: 'activo'
            };
            
            const tbody = document.getElementById(rol === 'asesor' ? 'tbody-asesores' : 'tbody-clientes');
            if (tbody) agregarFilaTabla(nuevoUsuario, tbody);
            
            console.log('📧 SIMULAR ENVÍO DE EMAIL:');
            console.log('Para:', email);
            console.log('Asunto: Tu cuenta en AFGCORPORACIÓN ha sido creada');
            console.log('Contraseña temporal:', password);
            
            const tipoUsuario = rol === 'asesor' ? 'asesor' : 'cliente';
            mostrarNotificacion(`✅ ${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)} creado. Email enviado a ${email}`);
            
            limpiarFormulario();
            actualizarEstadisticas();
        });
    }

    // ===== LIMPIAR FORMULARIO =====
    function limpiarFormulario() {
        if (formCrearUsuario) {
            document.getElementById('input-usuario').value = '';
            document.getElementById('input-email').value = '';
            document.getElementById('input-rol').value = 'asesor';
            document.getElementById('input-password').value = '';
            limpiarError('input-usuario');
            limpiarError('input-email');
        }
    }

    // ===== MODAL VER DETALLES =====
    function abrirModalDetalles(fila) {
        const id = fila.getAttribute('data-id');
        const nombre = fila.getAttribute('data-nombre');
        const email = fila.getAttribute('data-email');
        const rol = fila.getAttribute('data-rol');
        const estado = fila.getAttribute('data-estado');
        const color = fila.getAttribute('data-color');
        
        usuarioActualEditar = { fila, id, nombre, email, rol, estado, color };
        
        // Llenar datos
        document.getElementById('detalle-id').value = id;
        document.getElementById('detalle-nombre').value = nombre;
        document.getElementById('detalle-email').value = email;
        document.getElementById('detalle-rol').value = rol;
        document.getElementById('detalle-estado').value = estado;
        document.getElementById('detalle-password').value = '';
        
        // Avatar
        const iniciales = nombre.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
        const avatarDetalle = document.getElementById('avatar-detalle');
        const inicialesDetalle = document.getElementById('iniciales-detalle');
        
        if (avatarDetalle) avatarDetalle.style.backgroundColor = color;
        if (inicialesDetalle) inicialesDetalle.textContent = iniciales;
        
        // Badges
        const badgeRol = document.getElementById('badge-rol-detalle');
        const badgeEstado = document.getElementById('badge-estado-detalle');
        
        if (badgeRol) {
            badgeRol.textContent = rol === 'asesor' ? 'Asesor' : 'Cliente';
            badgeRol.classList.toggle('badge-cliente', rol === 'cliente');
        }
        
        if (badgeEstado) {
            badgeEstado.textContent = estado === 'activo' ? 'Activo' : 'Inactivo';
            badgeEstado.className = `badge-estado-detalle ${estado}`;
        }
        
        abrirModal(modalVerDetalles);
    }

    // ===== CERRAR MODAL DETALLES =====
    const cerrarModalDetalles = document.getElementById('cerrar-modal-detalles');
    const btnCancelarEditar = document.getElementById('btn-cancelar-editar');
    
    if (cerrarModalDetalles) {
        cerrarModalDetalles.addEventListener('click', () => cerrarModal(modalVerDetalles));
    }
    
    if (btnCancelarEditar) {
        btnCancelarEditar.addEventListener('click', () => cerrarModal(modalVerDetalles));
    }

    // ===== SUBMIT FORMULARIO EDITAR =====
    const formEditarUsuario = document.getElementById('form-editar-usuario');
    
    if (formEditarUsuario) {
        formEditarUsuario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!usuarioActualEditar) return;
            
            limpiarError('detalle-nombre');
            limpiarError('detalle-email');
            
            const nombre = document.getElementById('detalle-nombre').value.trim();
            const email = document.getElementById('detalle-email').value.trim();
            const rol = document.getElementById('detalle-rol').value;
            const estado = document.getElementById('detalle-estado').value;
            const password = document.getElementById('detalle-password').value;
            
            let hayErrores = false;
            
            if (!nombre || nombre.length < 3) {
                mostrarError('detalle-nombre', 'El nombre debe tener al menos 3 caracteres');
                hayErrores = true;
            }
            
            if (!email || !validarEmail(email)) {
                mostrarError('detalle-email', 'Ingresa un email válido');
                hayErrores = true;
            }
            
            if (hayErrores) return;
            
            // Actualizar fila
            const fila = usuarioActualEditar.fila;
            fila.setAttribute('data-nombre', nombre);
            fila.setAttribute('data-email', email);
            fila.setAttribute('data-rol', rol);
            fila.setAttribute('data-estado', estado);
            
            const iniciales = nombre.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
            
            fila.querySelector('.avatar-usuario').textContent = iniciales;
            fila.querySelector('.celda-usuario span').textContent = nombre;
            fila.querySelector('.badge-rol').textContent = rol === 'asesor' ? 'Asesor' : 'Cliente';
            fila.querySelector('.badge-rol').className = `badge-rol ${rol === 'cliente' ? 'badge-cliente' : ''}`;
            fila.querySelector('.badge-estado').textContent = estado === 'activo' ? 'Activo' : 'Inactivo';
            fila.querySelector('.badge-estado').className = `badge-estado ${estado}`;
            
            cerrarModal(modalVerDetalles);
            
            let mensaje = `✅ Usuario actualizado correctamente`;
            
            if (password) {
                console.log('📧 SIMULAR ENVÍO DE EMAIL (Nueva contraseña):');
                console.log('Para:', email);
                console.log('Nueva contraseña:', password);
                mensaje = `✅ Usuario actualizado y nueva contraseña enviada a ${email}`;
            }
            
            mostrarNotificacion(mensaje);
            actualizarEstadisticas();
        });
    }

    // ===== MODAL CONFIRMAR ELIMINAR =====
    function abrirModalEliminar(fila) {
        const nombre = fila.getAttribute('data-nombre');
        filaActualEliminar = fila;
        
        const nombreEliminar = document.getElementById('nombre-eliminar');
        if (nombreEliminar) nombreEliminar.textContent = nombre;
        
        abrirModal(modalConfirmarEliminar);
    }

    const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    
    if (btnCancelarEliminar) {
        btnCancelarEliminar.addEventListener('click', () => cerrarModal(modalConfirmarEliminar));
    }
    
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function() {
            if (filaActualEliminar) {
                const nombre = filaActualEliminar.getAttribute('data-nombre');
                filaActualEliminar.remove();
                actualizarEstadisticas();
                mostrarNotificacion(`❌ ${nombre} ha sido eliminado`);
            }
            cerrarModal(modalConfirmarEliminar);
            filaActualEliminar = null;
        });
    }

    // ===== ACTUALIZAR ESTADÍSTICAS =====
    function actualizarEstadisticas() {
        const totalAsesores = document.querySelectorAll('#tbody-asesores tr').length;
        const totalClientes = document.querySelectorAll('#tbody-clientes tr').length;
        const totalUsuarios = totalAsesores + totalClientes;
        
        const activosAsesores = document.querySelectorAll('#tbody-asesores .badge-estado.activo').length;
        const activosClientes = document.querySelectorAll('#tbody-clientes .badge-estado.activo').length;
        const totalActivos = activosAsesores + activosClientes;
        
        const totalInactivos = totalUsuarios - totalActivos;
        
        const elemTotal = document.getElementById('total-usuarios');
        const elemActivos = document.getElementById('usuarios-activos');
        const elemInactivos = document.getElementById('usuarios-inactivos');
        
        if (elemTotal) elemTotal.textContent = totalUsuarios;
        if (elemActivos) elemActivos.textContent = totalActivos;
        if (elemInactivos) elemInactivos.textContent = totalInactivos;
        
        const countAsesores = document.getElementById('count-asesores');
        const totalAsesoresElem = document.getElementById('total-asesores');
        const countClientes = document.getElementById('count-clientes');
        const totalClientesElem = document.getElementById('total-clientes');
        
        if (countAsesores) countAsesores.textContent = totalAsesores;
        if (totalAsesoresElem) totalAsesoresElem.textContent = totalAsesores;
        if (countClientes) countClientes.textContent = totalClientes;
        if (totalClientesElem) totalClientesElem.textContent = totalClientes;
    }

    // ===== EVENT LISTENERS BOTONES =====
    function agregarEventListenersBotones(fila) {
        const btnVer = fila.querySelector('.btn-ver');
        const btnEliminar = fila.querySelector('.btn-eliminar');
        
        if (btnVer) {
            btnVer.addEventListener('click', () => abrirModalDetalles(fila));
        }
        
        if (btnEliminar) {
            btnEliminar.addEventListener('click', () => abrirModalEliminar(fila));
        }
    }

    // ===== BUSCADOR =====
    const inputsBuscar = document.querySelectorAll('.input-buscar');
    
    inputsBuscar.forEach(input => {
        input.addEventListener('input', function() {
            const termino = this.value.toLowerCase();
            const panel = this.closest('.tab-panel');
            const filas = panel.querySelectorAll('tbody tr');
            
            filas.forEach(fila => {
                const texto = fila.textContent.toLowerCase();
                fila.style.display = texto.includes(termino) ? '' : 'none';
            });
        });
    });

    // ===== FILTRO ESTADO =====
    const filtrosEstado = document.querySelectorAll('.filtro-estado');
    
    filtrosEstado.forEach(select => {
        select.addEventListener('change', function() {
            const estado = this.value;
            const panel = this.closest('.tab-panel');
            const filas = panel.querySelectorAll('tbody tr');
            
            filas.forEach(fila => {
                if (estado === 'todos') {
                    fila.style.display = '';
                } else {
                    const badge = fila.querySelector('.badge-estado');
                    fila.style.display = badge && badge.classList.contains(estado) ? '' : 'none';
                }
            });
        });
    });

    // ===== TECLA ESC =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (modalVerDetalles && modalVerDetalles.classList.contains('activo')) {
                cerrarModal(modalVerDetalles);
            } else if (modalConfirmarEliminar && modalConfirmarEliminar.classList.contains('activo')) {
                cerrarModal(modalConfirmarEliminar);
            } else if (modalDatosCorrectos && modalDatosCorrectos.classList.contains('activo')) {
                cerrarModal(modalDatosCorrectos);
            } else if (modalConfirmarCancelar && modalConfirmarCancelar.classList.contains('activo')) {
                cerrarModal(modalConfirmarCancelar);
            } else if (modalCrearUsuario && modalCrearUsuario.classList.contains('activo')) {
                abrirModal(modalConfirmarCancelar);
            }
        }
    });

    // ===== VALIDACIÓN EN TIEMPO REAL =====
    const inputUsuario = document.getElementById('input-usuario');
    const inputEmail = document.getElementById('input-email');
    const detalleNombre = document.getElementById('detalle-nombre');
    const detalleEmail = document.getElementById('detalle-email');
    
    [inputUsuario, detalleNombre].forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    limpiarError(this.id);
                }
            });
        }
    });
    
    [inputEmail, detalleEmail].forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    limpiarError(this.id);
                }
            });
            
            input.addEventListener('blur', function() {
                const email = this.value.trim();
                if (email && !validarEmail(email)) {
                    mostrarError(this.id, 'Email inválido');
                }
            });
        }
    });

    // ===== INICIALIZAR =====
    cargarDatosIniciales();
    console.log('✅ Control de Usuarios inicializado correctamente');
    console.log('💡 Sistema completo: Crear, Ver/Editar, Eliminar');
});