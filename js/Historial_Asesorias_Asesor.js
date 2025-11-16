document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    const botonHamburguesa = document.getElementById('boton-hamburguesa');
    const menuLateral = document.getElementById('menu-lateral');
    const overlayMenu = document.getElementById('overlay-menu');
    const enlacesMenu = document.querySelectorAll('.item-menu');
    const listaAsesorias = document.getElementById('lista-asesorias');
    const totalRealizadas = document.getElementById('total-realizadas');
    const totalClientes = document.getElementById('total-clientes');
    const btnLogout = document.getElementById('logout-button');
    const modalLogout = document.getElementById('modal-logout');
    const btnLogoutVolver = document.getElementById('btn-logout-volver');
    const btnLogoutConfirmar = document.getElementById('btn-logout-confirmar');
    
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
    
    if (modalLogout) {
        modalLogout.addEventListener('click', function(e) {
            if (e.target === modalLogout) {
                cerrarModal(modalLogout);
            }
        });
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
    
    // ===== CARGAR ASESORÍAS =====
    function cargarAsesorias() {
        const asesorias = localStorage.getItem('afgcorporacion_asesorias_cliente');
        
        if (asesorias) {
            const todasAsesorias = JSON.parse(asesorias);
            const completadas = todasAsesorias.filter(a => a.estado === 'Completada');
            renderizarAsesorias(completadas);
            calcularEstadisticas(completadas);
        } else {
            renderizarAsesorias([]);
            calcularEstadisticas([]);
        }
    }
    
    // ===== RENDERIZAR ASESORÍAS =====
    function renderizarAsesorias(asesorias) {
        if (!listaAsesorias) return;
        
        listaAsesorias.innerHTML = '';
        
        if (asesorias.length === 0) {
            listaAsesorias.innerHTML = `
                <div class="mensaje-vacio">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <p>📋 No hay asesorías realizadas</p>
                    <p class="texto-secundario">Las asesorías completadas aparecerán aquí</p>
                </div>
            `;
            return;
        }
        
        asesorias.forEach((asesoria, index) => {
            const tarjeta = crearTarjetaAsesoria(asesoria);
            tarjeta.style.opacity = '0';
            tarjeta.style.transform = 'translateY(20px)';
            listaAsesorias.appendChild(tarjeta);
            
            setTimeout(() => {
                tarjeta.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                tarjeta.style.opacity = '1';
                tarjeta.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // ===== CREAR TARJETA DE ASESORÍA =====
    function crearTarjetaAsesoria(asesoria) {
        const div = document.createElement('div');
        div.className = 'tarjeta-asesoria';
        
        const nombreCliente = obtenerNombreCliente(asesoria);
        
        div.innerHTML = `
            <div class="encabezado-tarjeta">
                <h3 class="titulo-asesoria">${asesoria.tipo}</h3>
                <p class="descripcion-asesoria">${asesoria.notas || 'Sin notas adicionales'}</p>
            </div>
            <div class="detalles-asesoria">
                <div class="detalle-item">
                    <svg class="icono-detalle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <div class="info-detalle">
                        <span class="label-detalle">Cliente</span>
                        <span class="valor-detalle">${nombreCliente}</span>
                    </div>
                </div>
                <div class="detalle-item">
                    <svg class="icono-detalle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <div class="info-detalle">
                        <span class="label-detalle">Fecha</span>
                        <span class="valor-detalle">${asesoria.fecha}</span>
                    </div>
                </div>
                <div class="detalle-item">
                    <svg class="icono-detalle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <div class="info-detalle">
                        <span class="label-detalle">Duración</span>
                        <span class="valor-detalle">${calcularDuracion(asesoria.hora)}</span>
                    </div>
                </div>
            </div>
        `;
        
        return div;
    }
    
    // ===== OBTENER NOMBRE CLIENTE =====
    function obtenerNombreCliente(asesoria) {
        const perfilCliente = localStorage.getItem('afgcorporacion_cliente_perfil');
        if (perfilCliente) {
            const datos = JSON.parse(perfilCliente);
            if (datos.nombreCompleto) {
                return datos.nombreCompleto;
            }
        }
        return asesoria.asesor || 'Cliente';
    }
    
    // ===== CALCULAR DURACIÓN =====
    function calcularDuracion(hora) {
        return '1.5 horas';
    }
    
    // ===== CALCULAR ESTADÍSTICAS =====
    function calcularEstadisticas(asesorias) {
        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();
        
        const asesoriasMes = asesorias.filter(a => {
            const partes = a.fecha.split('/');
            if (partes.length === 3) {
                const mes = parseInt(partes[1]) - 1;
                const anio = parseInt(partes[2]);
                return mes === mesActual && anio === anioActual;
            }
            return false;
        });
        
        const totalRealizadasMes = asesoriasMes.length;
        
        const clientesUnicos = new Set();
        asesoriasMes.forEach(a => {
            const nombreCliente = obtenerNombreCliente(a);
            clientesUnicos.add(nombreCliente);
        });
        const totalClientesMes = clientesUnicos.size;
        
        if (totalRealizadas) {
            animarNumero(totalRealizadas, totalRealizadasMes);
        }
        
        if (totalClientes) {
            animarNumero(totalClientes, totalClientesMes);
        }
    }
    
    // ===== ANIMAR NÚMERO =====
    function animarNumero(elemento, valorFinal) {
        const duracion = 1000;
        const pasos = 30;
        const intervalo = duracion / pasos;
        const incremento = valorFinal / pasos;
        let valorActual = 0;
        
        const timer = setInterval(() => {
            valorActual += incremento;
            if (valorActual >= valorFinal) {
                elemento.textContent = valorFinal;
                clearInterval(timer);
            } else {
                elemento.textContent = Math.floor(valorActual);
            }
        }, intervalo);
    }
    
    // ===== SINCRONIZACIÓN AUTOMÁTICA =====
    window.addEventListener('storage', function(e) {
        if (e.key === 'afgcorporacion_asesorias_cliente') {
            cargarAsesorias();
        }
    });
    
    // ===== INICIALIZAR =====
    cargarAsesorias();
    
    console.log('✅ Historial de Asesorías Asesor AFGCORPORACIÓN cargado correctamente');
});