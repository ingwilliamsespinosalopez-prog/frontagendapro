document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    const botonHamburguesa = document.getElementById('boton-hamburguesa');
    const menuLateral = document.getElementById('menu-lateral');
    const overlayMenu = document.getElementById('overlay-menu');
    const enlacesMenu = document.querySelectorAll('.item-menu');
    
    // Estadísticas
    const totalClientes = document.getElementById('total-clientes');
    const citasHoy = document.getElementById('citas-hoy');
    const documentos = document.getElementById('documentos');
    const ingresos = document.getElementById('ingresos');
    
    // Listas
    const listaActividad = document.getElementById('lista-actividad');
    const listaCitas = document.getElementById('lista-citas');
    
    // Logout
    const btnLogout = document.getElementById('logout-button');
    const modalLogout = document.getElementById('modal-logout');
    const btnLogoutVolver = document.getElementById('btn-logout-volver');
    const btnLogoutConfirmar = document.getElementById('btn-logout-confirmar');
    
    // ===== DATOS DE EJEMPLO =====
    const datosEstadisticas = {
        clientes: 24,
        citasHoy: 2,
        documentos: 4,
        ingresos: 28
    };
    
    const actividadReciente = [
        {
            tipo: 'registro',
            titulo: 'Cliente nuevo registrado',
            subtitulo: 'María González',
            tiempo: 'Hace 2 horas',
            color: 'verde'
        },
        {
            tipo: 'cita',
            titulo: 'Cita programada',
            subtitulo: 'Carlos Ramírez',
            tiempo: 'Hace 3 horas',
            color: 'naranja'
        },
        {
            tipo: 'documento',
            titulo: 'Documento subido',
            subtitulo: 'Ana López',
            tiempo: 'Hace 5 horas',
            color: 'azul'
        },
        {
            tipo: 'completado',
            titulo: 'Solicitud completada',
            subtitulo: 'Pedro Martínez',
            tiempo: 'Hace 1 día',
            color: 'morado'
        }
    ];
    
    const proximasCitas = [
        {
            nombre: 'Roberto Sánchez',
            tipo: 'Asesoría Fiscal',
            hora: '10:00 AM',
            etiqueta: 'hoy'
        },
        {
            nombre: 'Laura Hernández',
            tipo: 'Revisión de documentos',
            hora: '2:30 PM',
            etiqueta: 'hoy'
        },
        {
            nombre: 'Miguel Torres',
            tipo: 'Declaración anual',
            hora: '11:00 AM',
            etiqueta: 'manana'
        }
    ];
    
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
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
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
            localStorage.removeItem('afgcorporacion_asesor_perfil');
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
    
    // ===== CARGAR ESTADÍSTICAS =====
    function cargarEstadisticas() {
        const datosGuardados = localStorage.getItem('afgcorporacion_estadisticas_asesor');
        
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            animarNumero(totalClientes, datos.clientes);
            animarNumero(citasHoy, datos.citasHoy);
            animarNumero(documentos, datos.documentos);
            animarNumero(ingresos, datos.ingresos);
        } else {
            animarNumero(totalClientes, datosEstadisticas.clientes);
            animarNumero(citasHoy, datosEstadisticas.citasHoy);
            animarNumero(documentos, datosEstadisticas.documentos);
            animarNumero(ingresos, datosEstadisticas.ingresos);
        }
    }
    
    // ===== ANIMAR NÚMEROS =====
    function animarNumero(elemento, valorFinal) {
        if (!elemento) return;
        
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
    
    // ===== RENDERIZAR ACTIVIDAD RECIENTE =====
    function renderizarActividad() {
        if (!listaActividad) return;
        
        listaActividad.innerHTML = '';
        
        actividadReciente.forEach((actividad, index) => {
            const item = crearItemActividad(actividad);
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            listaActividad.appendChild(item);
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    function crearItemActividad(actividad) {
        const div = document.createElement('div');
        div.className = 'item-actividad';
        
        div.innerHTML = `
            <div class="indicador-actividad indicador-${actividad.color}"></div>
            <div class="contenido-actividad">
                <p class="titulo-actividad">${actividad.titulo}</p>
                <p class="subtitulo-actividad">${actividad.subtitulo}</p>
            </div>
            <span class="tiempo-actividad">${actividad.tiempo}</span>
        `;
        
        return div;
    }
    
    // ===== RENDERIZAR PRÓXIMAS CITAS =====
    function renderizarCitas() {
        if (!listaCitas) return;
        
        listaCitas.innerHTML = '';
        
        proximasCitas.forEach((cita, index) => {
            const item = crearItemCita(cita);
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            listaCitas.appendChild(item);
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    function crearItemCita(cita) {
        const div = document.createElement('div');
        div.className = 'item-cita';
        
        const textoEtiqueta = cita.etiqueta === 'hoy' ? 'Hoy' : 'Mañana';
        const claseEtiqueta = cita.etiqueta === 'hoy' ? 'etiqueta-hoy' : 'etiqueta-manana';
        
        div.innerHTML = `
            <div class="info-cita">
                <p class="nombre-cliente">${cita.nombre}</p>
                <p class="tipo-cita">${cita.tipo}</p>
                <p class="hora-cita">${cita.hora}</p>
            </div>
            <span class="etiqueta-cita ${claseEtiqueta}">${textoEtiqueta}</span>
        `;
        
        return div;
    }
    
    // ===== ANIMACIONES DE TARJETAS =====
    function animarTarjetas() {
        const tarjetas = document.querySelectorAll('.tarjeta-estadistica');
        tarjetas.forEach((tarjeta, index) => {
            tarjeta.style.opacity = '0';
            tarjeta.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                tarjeta.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                tarjeta.style.opacity = '1';
                tarjeta.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    // ===== ACTUALIZAR DATOS PERIÓDICAMENTE =====
    function actualizarDashboard() {
        console.log('Dashboard actualizado');
    }
    
    setInterval(actualizarDashboard, 300000);
    
    // ===== GUARDAR DATOS DE EJEMPLO =====
    function guardarDatosEjemplo() {
        if (!localStorage.getItem('afgcorporacion_estadisticas_asesor')) {
            localStorage.setItem('afgcorporacion_estadisticas_asesor', JSON.stringify(datosEstadisticas));
        }
    }
    
    // ===== INICIALIZAR =====
    guardarDatosEjemplo();
    cargarEstadisticas();
    renderizarActividad();
    renderizarCitas();
    setTimeout(animarTarjetas, 100);
    
    console.log('✅ Dashboard Asesor AFGCORPORACIÓN cargado correctamente');
});