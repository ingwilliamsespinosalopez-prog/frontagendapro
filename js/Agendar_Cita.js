document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DEL DOM =====
    const botonHamburguesa = document.getElementById('boton-hamburguesa');
    const menuLateral = document.getElementById('menu-lateral');
    const overlayMenu = document.getElementById('overlay-menu');
    const enlacesMenu = document.querySelectorAll('.item-menu');
    
    // Calendario
    const calendarioDias = document.getElementById('calendario-dias');
    const mesAnio = document.getElementById('mes-anio');
    const btnMesAnterior = document.getElementById('mes-anterior');
    const btnMesSiguiente = document.getElementById('mes-siguiente');
    
    // Formulario
    const formularioCita = document.getElementById('formulario-cita');
    const tipoAsesoria = document.getElementById('tipo-asesoria');
    const horario = document.getElementById('horario');
    const notas = document.getElementById('notas');
    const btnAgendar = document.getElementById('btn-agendar');
    
    // Modal confirmación
    const modalConfirmar = document.getElementById('modal-confirmar');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal');
    const btnAceptarModal = document.getElementById('btn-aceptar-modal');
    
    // Notificación
    const notificacion = document.getElementById('notificacion');
    const cerrarNotificacion = document.getElementById('cerrar-notificacion');
    
    // Pago
    const seccionTotal = document.getElementById('seccion-total');
    const precioTotalEl = document.getElementById('precio-total');
    const seccionPago = document.getElementById('seccion-pago');
    const modalResumen = document.getElementById('modal-resumen');
    
    // Logout
    const btnLogout = document.getElementById('logout-button');
    const modalLogout = document.getElementById('modal-logout');
    const btnLogoutVolver = document.getElementById('btn-logout-volver');
    const btnLogoutConfirmar = document.getElementById('btn-logout-confirmar');
    
    // Variables
    let fechaActual = new Date();
    let fechaSeleccionada = null;
    let datosFormulario = null;
    
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
            if (modalConfirmar && modalConfirmar.classList.contains('activo')) {
                cerrarModalConfirmacion();
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
    
    // ===== CALENDARIO =====
    function renderizarCalendario() {
        if (!calendarioDias) return;
        
        calendarioDias.innerHTML = '';
        
        const anio = fechaActual.getFullYear();
        const mes = fechaActual.getMonth();
        
        const nombresMeses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        if (mesAnio) {
            mesAnio.textContent = `${nombresMeses[mes]} ${anio}`;
        }
        
        const primerDia = new Date(anio, mes, 1);
        const diaSemana = primerDia.getDay();
        const ultimoDia = new Date(anio, mes + 1, 0);
        const diasEnMes = ultimoDia.getDate();
        const ultimoDiaMesAnterior = new Date(anio, mes, 0).getDate();
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        for (let i = diaSemana - 1; i >= 0; i--) {
            calendarioDias.appendChild(crearDia(ultimoDiaMesAnterior - i, true, null));
        }
        
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaDia = new Date(anio, mes, dia);
            fechaDia.setHours(0, 0, 0, 0);
            const esHoy = fechaDia.getTime() === hoy.getTime();
            const esSeleccionado = fechaSeleccionada && fechaDia.getTime() === fechaSeleccionada.getTime();
            const esPasado = fechaDia < hoy;
            calendarioDias.appendChild(crearDia(dia, false, fechaDia, esHoy, esSeleccionado, esPasado));
        }
        
        const diasTotalesGrid = calendarioDias.children.length;
        const diasRestantes = (diasTotalesGrid > 35) ? 42 - diasTotalesGrid : 35 - diasTotalesGrid;
        
        for (let dia = 1; dia <= diasRestantes; dia++) {
            calendarioDias.appendChild(crearDia(dia, true, null));
        }
    }
    
    function crearDia(numero, otroMes, fecha, esHoy = false, esSeleccionado = false, esPasado = false) {
        const div = document.createElement('div');
        div.className = 'dia';
        div.textContent = numero;
        
        if (otroMes) {
            div.classList.add('otro-mes');
        } else {
            if (esHoy) div.classList.add('hoy');
            if (esSeleccionado) div.classList.add('seleccionado');
            if (esPasado) div.classList.add('deshabilitado');
            
            if (!esPasado) {
                div.addEventListener('click', function() {
                    fechaSeleccionada = fecha;
                    renderizarCalendario();
                });
            }
        }
        
        return div;
    }
    
    if (btnMesAnterior) {
        btnMesAnterior.addEventListener('click', function() {
            fechaActual.setMonth(fechaActual.getMonth() - 1);
            renderizarCalendario();
        });
    }
    
    if (btnMesSiguiente) {
        btnMesSiguiente.addEventListener('click', function() {
            fechaActual.setMonth(fechaActual.getMonth() + 1);
            renderizarCalendario();
        });
    }
    
    // ===== LÓGICA DE PAGO Y PRECIOS =====
    if (tipoAsesoria) {
        tipoAsesoria.addEventListener('change', () => {
            const selectedOption = tipoAsesoria.options[tipoAsesoria.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            
            if (price) {
                const formattedPrice = parseFloat(price).toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                });
                precioTotalEl.textContent = formattedPrice;
                seccionTotal.style.display = 'block';
                seccionPago.style.display = 'block';
            } else {
                seccionTotal.style.display = 'none';
                seccionPago.style.display = 'none';
                precioTotalEl.textContent = '$0.00 MXN';
            }
        });
    }
    
    // ===== VALIDAR FORMULARIO =====
    function validarFormulario() {
        if (!fechaSeleccionada) {
            alert('Por favor selecciona una fecha del calendario');
            return false;
        }
        
        if (!tipoAsesoria || !tipoAsesoria.value) {
            alert('Por favor selecciona un tipo de asesoría');
            tipoAsesoria.focus();
            return false;
        }
        
        if (!horario || !horario.value) {
            alert('Por favor selecciona un horario');
            horario.focus();
            return false;
        }
        
        const modalidadInput = document.querySelector('input[name="modalidad"]:checked');
        if (!modalidadInput) {
            alert('Por favor selecciona una modalidad (Presencial o Google Meet)');
            return false;
        }
        
        const seccionPagoVisible = seccionPago && window.getComputedStyle(seccionPago).display === 'block';
        const metodoPagoInput = document.querySelector('input[name="metodo-pago"]:checked');
        if (seccionPagoVisible && !metodoPagoInput) {
            alert('Por favor selecciona un método de pago');
            return false;
        }
        
        return true;
    }
    
    // ===== FORMULARIO =====
    if (formularioCita) {
        formularioCita.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validarFormulario()) {
                return;
            }
            
            const precio = precioTotalEl.textContent;
            const metodoPagoInput = document.querySelector('input[name="metodo-pago"]:checked');
            const metodoPago = metodoPagoInput ? metodoPagoInput.value : 'N/A';
            const modalidadInput = document.querySelector('input[name="modalidad"]:checked');
            const modalidad = modalidadInput.value;
            
            datosFormulario = {
                fecha: fechaSeleccionada,
                tipo: tipoAsesoria.value,
                horario: horario.value,
                notas: notas.value,
                estado: 'Pendiente',
                precio: precio,
                metodoPago: metodoPago,
                modalidad: modalidad
            };
            
            const tipoAsesoriaTexto = tipoAsesoria.options[tipoAsesoria.selectedIndex].text;
            const fechaFormateadaModal = datosFormulario.fecha.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
            
            if (modalResumen) {
                modalResumen.innerHTML = `
                    <p><strong>Servicio:</strong> <span>${tipoAsesoriaTexto}</span></p>
                    <p><strong>Fecha:</strong> <span>${fechaFormateadaModal}</span></p>
                    <p><strong>Horario:</strong> <span>${datosFormulario.horario}</span></p>
                    <p><strong>Modalidad:</strong> <span>${datosFormulario.modalidad}</span></p>
                    <p><strong>Método:</strong> <span>${datosFormulario.metodoPago}</span></p>
                    <p style="border-top: 1px solid #ddd; padding-top: 8px;">
                        <strong>Total:</strong> 
                        <span style="font-weight: 700; font-size: 1.1rem; color: #0e5d6b;">${datosFormulario.precio}</span>
                    </p>
                `;
            }
            
            abrirModal();
        });
    }
    
    // ===== MODAL DE CONFIRMACIÓN =====
    function abrirModal() {
        if (modalConfirmar) {
            modalConfirmar.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function cerrarModalConfirmacion() {
        if (modalConfirmar) {
            modalConfirmar.classList.remove('activo');
            document.body.style.overflow = '';
        }
    }
    
    if (btnCancelarModal) {
        btnCancelarModal.addEventListener('click', cerrarModalConfirmacion);
    }
    
    if (btnAceptarModal) {
        btnAceptarModal.addEventListener('click', function() {
            cerrarModalConfirmacion();
            agendarCita();
        });
    }
    
    if (modalConfirmar) {
        modalConfirmar.addEventListener('click', function(e) {
            if (e.target === modalConfirmar) {
                cerrarModalConfirmacion();
            }
        });
    }
    
    // ===== AGENDAR CITA =====
    function agendarCita() {
        if (!datosFormulario) return;
        
        const dia = String(datosFormulario.fecha.getDate()).padStart(2, '0');
        const mes = String(datosFormulario.fecha.getMonth() + 1).padStart(2, '0');
        const anio = datosFormulario.fecha.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${anio}`;
        
        const cita = {
            id: 'cita_' + Date.now(),
            fecha: fechaFormateada,
            hora: datosFormulario.horario,
            tipo: datosFormulario.tipo,
            asesor: 'Por Asignar',
            estado: 'Pendiente',
            notas: datosFormulario.notas || 'Sin notas adicionales',
            precio: datosFormulario.precio,
            metodoPago: datosFormulario.metodoPago,
            estadoPago: 'Pendiente',
            modalidad: datosFormulario.modalidad
        };
        
        let asesorias = [];
        const asesoríasGuardadas = localStorage.getItem('afgcorporacion_asesorias_cliente');
        if (asesoríasGuardadas) {
            try {
                asesorias = JSON.parse(asesoríasGuardadas);
                if (!Array.isArray(asesorias)) {
                    asesorias = [];
                }
            } catch(e) {
                console.error("Error al parsear asesorias guardadas:", e);
                asesorias = [];
            }
        }
        
        asesorias.unshift(cita);
        localStorage.setItem('afgcorporacion_asesorias_cliente', JSON.stringify(asesorias));
        
        mostrarNotificacion();
        
        if (formularioCita) {
            formularioCita.reset();
        }
        fechaSeleccionada = null;
        renderizarCalendario();
        
        if (seccionTotal) seccionTotal.style.display = 'none';
        if (seccionPago) seccionPago.style.display = 'none';
        if (precioTotalEl) precioTotalEl.textContent = '$0.00 MXN';
    }
    
    // ===== NOTIFICACIÓN =====
    function mostrarNotificacion() {
        if (notificacion) {
            notificacion.classList.add('mostrar');
            setTimeout(() => {
                ocultarNotificacion();
            }, 4000);
        }
    }
    
    function ocultarNotificacion() {
        if (notificacion) {
            notificacion.classList.remove('mostrar');
        }
    }
    
    if (cerrarNotificacion) {
        cerrarNotificacion.addEventListener('click', ocultarNotificacion);
    }
    
    // ===== INICIALIZAR =====
    if (calendarioDias) {
        renderizarCalendario();
    }
    
    console.log('✅ Agendar Cita AFGCORPORACIÓN cargado correctamente');
});
async function agendarCita() {
    if (!datosFormulario) return;

    try {
        // ======= 1. FORMATEAR FECHA A MYSQL =======
        const year = datosFormulario.fecha.getFullYear();
        const month = String(datosFormulario.fecha.getMonth() + 1).padStart(2, "0");
        const day = String(datosFormulario.fecha.getDate()).padStart(2, "0");
        const fechaMySQL = `${year}-${month}-${day}`;

        // ======= 2. DATOS DEL DOM =======
        const idCliente = document.getElementById("idCliente").value;
        const idAsesor = document.getElementById("idAsesor").value;
        const idServicio = datosFormulario.tipo;
        const horaCita = datosFormulario.horario + ":00";
        const idModalidad = datosFormulario.modalidad;
        const notasText = datosFormulario.notas || "";
        const idMetodoPago = datosFormulario.metodoPago;
        const monto = datosFormulario.precio.replace("$", "").replace("MXN", "").trim();

        // ======= 3. PAYLOAD CITA =======
        const citaPayload = {
            idCliente: parseInt(idCliente),
            idAsesor: parseInt(idAsesor),
            idServicio: parseInt(idServicio),
            idEstado: 1,
            idModalidad: parseInt(idModalidad),
            fechaCita: fechaMySQL,
            horaCita: horaCita,
            pagado: false,
            notas: notasText
        };

        // ======= 4. GUARDAR CITA EN BACKEND =======
        const respuestaCita = await fetch("https://3.231.210.28:7000/cita", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(citaPayload)
        });

        if (!respuestaCita.ok) throw new Error("Error al registrar la cita");

        const citaCreada = await respuestaCita.json();
        const idCita = citaCreada.idCita;

        // ======= 5. PAYLOAD PAGO =======
        const pagoPayload = {
            idCita: idCita,
            monto: parseFloat(monto),
            idTransaccion: "TX-" + Date.now(),
            idEstadoPago: 1, // Pendiente
            idMetodoPago: parseInt(idMetodoPago)
        };

        // ======= 6. REGISTRAR PAGO =======
        const respuestaPago = await fetch("https://3.231.210.28:7000/pagos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pagoPayload)
        });

        if (!respuestaPago.ok) throw new Error("Error al registrar el pago");

        mostrarNotificacion();

        // ======= 7. LIMPIAR FORMULARIO =======
        formularioCita?.reset();
        fechaSeleccionada = null;
        renderizarCalendario();
        seccionTotal && (seccionTotal.style.display = "none");
        seccionPago && (seccionPago.style.display = "none");
        precioTotalEl.textContent = "$0.00 MXN";

    } catch (error) {
        console.error("❌ ERROR en agendar cita:", error);
        alert("Ocurrió un error al guardar la cita");
    }
}
