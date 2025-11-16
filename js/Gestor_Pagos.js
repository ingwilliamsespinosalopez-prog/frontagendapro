document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    // (Se eliminaron: botonMenu, menuLateral, overlayMenu, btnLogout)
    const tbodyPagos = document.getElementById('tbody-pagos');
    
    // Controles de tabla
    const inputBuscar = document.getElementById('input-buscar');
    const filtroEstadoPago = document.getElementById('filtro-estado-pago');
    const filtroServicio = document.getElementById('filtro-servicio');
    const btnExportar = document.getElementById('btn-exportar');

    // Tarjetas de estadísticas
    const totalCobradoEl = document.getElementById('total-cobrado');
    const pagadasEl = document.getElementById('pagadas');
    const pendientesEl = document.getElementById('pendientes');
    const totalCitasEl = document.getElementById('total-citas');

    // Paginación
    const infoPaginacionEl = document.getElementById('info-paginacion');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const numerosPaginaEl = document.getElementById('numeros-pagina');
    
    // Modal Exportar
    const modalExportar = document.getElementById('modal-confirmar-exportar');
    const btnCancelarExportar = document.getElementById('btn-cancelar-exportar');
    const btnConfirmarExportar = document.getElementById('btn-confirmar-exportar');

    // --- ESTADO DE LA APLICACIÓN ---
    let todasLasCitas = [];
    let citasFiltradas = [];
    let clienteNombre = "Cliente"; // Nombre por defecto, se cargará desde localStorage
    let paginaActual = 1;
    const filasPorPagina = 5; // Define cuántas filas mostrar por página

    // --- INICIALIZACIÓN ---
    cargarDatos();
    aplicarFiltrosYRenderizar();
    inicializarEventListeners();

    // --- LÓGICA DE DATOS ---
    function cargarDatos() {
        // Cargar el nombre del cliente (asumiendo que solo hay un perfil de cliente en esta simulación)
        const perfilGuardado = localStorage.getItem('afgcorporacion_cliente_perfil');
        if (perfilGuardado) {
            try {
                const perfil = JSON.parse(perfilGuardado);
                clienteNombre = perfil.nombreCompleto || "Cliente (Perfil Incompleto)";
            } catch (e) {
                console.error("Error al parsear perfil de cliente:", e);
            }
        }

        // Cargar todas las asesorías
        const asesoriasGuardadas = localStorage.getItem('afgcorporacion_asesorias_cliente');
        if (asesoriasGuardadas) {
            try {
                todasLasCitas = JSON.parse(asesoriasGuardadas);
                if (!Array.isArray(todasLasCitas)) {
                    todasLasCitas = [];
                }
            } catch (e) {
                console.error("Error al parsear asesorías:", e);
                todasLasCitas = [];
            }
        }
    }
    
    function guardarDatos() {
        // Guarda el array completo de citas de vuelta en localStorage
        localStorage.setItem('afgcorporacion_asesorias_cliente', JSON.stringify(todasLasCitas));
    }

    // --- LÓGICA DE RENDERIZADO Y FILTROS ---
    
    function aplicarFiltrosYRenderizar() {
        // 1. Aplicar filtros
        const terminoBusqueda = inputBuscar.value.toLowerCase();
        const estadoPago = filtroEstadoPago.value;
        const servicio = filtroServicio.value;

        citasFiltradas = todasLasCitas.filter(cita => {
            // Asegurarse que la cita tenga las propiedades
            const citaId = cita.id || '';
            const citaTipo = cita.tipo || '';

            // Comprobar estado
            const filtroEstadoPasa = (estadoPago === 'todos') || (cita.estadoPago === estadoPago);
            // Comprobar servicio
            const filtroServicioPasa = (servicio === 'todos') || (citaTipo === servicio);
            // Comprobar búsqueda
            const filtroBusquedaPasa = (terminoBusqueda === '') ||
                (clienteNombre.toLowerCase().includes(terminoBusqueda)) ||
                (citaTipo.toLowerCase().includes(terminoBusqueda)) ||
                (citaId.toLowerCase().includes(terminoBusqueda));
            
            return filtroEstadoPasa && filtroServicioPasa && filtroBusquedaPasa;
        });

        // 2. Actualizar estadísticas (con los datos filtrados)
        actualizarEstadisticas(citasFiltradas);

        // 3. Renderizar paginación (calcula el total de páginas)
        renderizarPaginacion(citasFiltradas.length);
        
        // 4. Renderizar la tabla (solo la página actual)
        renderizarTabla();
    }

    function renderizarTabla() {
        tbodyPagos.innerHTML = ''; // Limpiar tabla

        // Calcular qué citas mostrar en la página actual
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const citasPaginadas = citasFiltradas.slice(inicio, fin);

        if (citasPaginadas.length === 0) {
            tbodyPagos.innerHTML = `<tr><td colspan="9" style="text-align: center;">No se encontraron registros.</td></tr>`;
            return;
        }

        citasPaginadas.forEach(cita => {
            const tr = document.createElement('tr');
            
            // Asignar valores por defecto si no existen
            const estadoPago = cita.estadoPago || 'Pendiente';
            const metodoPago = cita.metodoPago || 'N/A';
            const precio = cita.precio || '$0.00';
            const idCita = cita.id || 'N/A';

            const estadoPagoClass = estadoPago.toLowerCase();
            const esPagado = estadoPago === 'Pagado';

            tr.innerHTML = `
                <td>${clienteNombre}</td>
                <td>${idCita}</td>
                <td>${cita.tipo}</td>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td>${precio}</td>
                <td>${metodoPago}</td>
                <td>
                    <span class="badge-estado ${estadoPagoClass}">${estadoPago}</span>
                </td>
                <td>
                    <button class="btn-accion-pagar" data-id="${idCita}" ${esPagado ? 'disabled' : ''}>
                        ${esPagado ? 'Pagado' : 'Marcar Pagado'}
                    </button>
                </td>
            `;
            tbodyPagos.appendChild(tr);
        });
    }

    function actualizarEstadisticas(citas) {
        let totalCobrado = 0;
        let pagadas = 0;
        let pendientes = 0;

        citas.forEach(cita => {
            // Limpiar el precio de '$' y ',' para sumarlo
            const precioNumerico = parseFloat(String(cita.precio).replace(/[$,]/g, '')) || 0;

            if (cita.estadoPago === 'Pagado') {
                pagadas++;
                totalCobrado += precioNumerico;
            } else { // Asumir 'Pendiente' si no es 'Pagado'
                pendientes++;
            }
        });

        // Formatear el total cobrado como moneda
        totalCobradoEl.textContent = totalCobrado.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
        pagadasEl.textContent = pagadas;
        pendientesEl.textContent = pendientes;
        totalCitasEl.textContent = citas.length; // Total de citas (filtradas)
    }

    // --- LÓGICA DE PAGINACIÓN ---
    
    function renderizarPaginacion(totalFilas) {
        const totalPaginas = Math.ceil(totalFilas / filasPorPagina);
        numerosPaginaEl.innerHTML = ''; // Limpiar números de página

        // Botón Anterior
        btnAnterior.disabled = (paginaActual === 1);
        // Botón Siguiente
        btnSiguiente.disabled = (paginaActual === totalPaginas) || (totalPaginas === 0);

        // Números de página
        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement('button');
            btn.className = 'btn-pagina';
            btn.textContent = i;
            if (i === paginaActual) {
                btn.classList.add('activo');
            }
            btn.addEventListener('click', () => {
                paginaActual = i;
                aplicarFiltrosYRenderizar();
            });
            numerosPaginaEl.appendChild(btn);
        }
        
        // Info de paginación
        const inicio = totalFilas > 0 ? (paginaActual - 1) * filasPorPagina + 1 : 0;
        const fin = Math.min(paginaActual * filasPorPagina, totalFilas);
        infoPaginacionEl.textContent = `Mostrando ${inicio} - ${fin} de ${totalFilas} registros`;
    }

    // --- EVENT LISTENERS ---
    
    function inicializarEventListeners() {
        // (Se eliminó la lógica del Menú y Logout, ahora la maneja Perfil_Administrador.js)

        // Filtros
        inputBuscar.addEventListener('keyup', () => {
            paginaActual = 1; // Resetear a página 1 al buscar
            aplicarFiltrosYRenderizar();
        });
        filtroEstadoPago.addEventListener('change', () => {
            paginaActual = 1; // Resetear a página 1 al filtrar
            aplicarFiltrosYRenderizar();
        });
        filtroServicio.addEventListener('change', () => {
            paginaActual = 1; // Resetear a página 1 al filtrar
            aplicarFiltrosYRenderizar();
        });
        
        // Paginación (Anterior/Siguiente)
        btnAnterior.addEventListener('click', () => {
            if (paginaActual > 1) {
                paginaActual--;
                aplicarFiltrosYRenderizar();
            }
        });
        btnSiguiente.addEventListener('click', () => {
            const totalPaginas = Math.ceil(citasFiltradas.length / filasPorPagina);
            if (paginaActual < totalPaginas) {
                paginaActual++;
                aplicarFiltrosYRenderizar();
            }
        });

        // Acciones de la tabla (Marcar como Pagado) - USANDO DELEGACIÓN DE EVENTOS
        tbodyPagos.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-accion-pagar')) {
                const idCita = e.target.getAttribute('data-id');
                marcarComoPagado(idCita);
            }
        });
        
        // Exportar
        btnExportar.addEventListener('click', () => {
            if (citasFiltradas.length === 0) {
                alert("No hay datos para exportar.");
                return;
            }
            modalExportar.classList.add('activo');
        });
        btnCancelarExportar.addEventListener('click', () => {
            modalExportar.classList.remove('activo');
        });
        btnConfirmarExportar.addEventListener('click', () => {
            exportarAExcel();
            modalExportar.classList.remove('activo');
        });
    }

    // --- ACCIONES ---

    function marcarComoPagado(idCita) {
        // 1. Encontrar la cita en el array *maestro*
        const citaIndex = todasLasCitas.findIndex(cita => cita.id === idCita);
        
        if (citaIndex > -1) {
            // 2. Actualizar el estado en el array maestro
            todasLasCitas[citaIndex].estadoPago = 'Pagado';
            
            // 3. Guardar los cambios en localStorage
            guardarDatos();
            
            // 4. Volver a renderizar todo
            aplicarFiltrosYRenderizar();
        } else {
            console.error("No se encontró la cita con ID:", idCita);
        }
    }

    function exportarAExcel() {
        // Exportar solo las filas *filtradas*, no solo las paginadas
        const datosParaExportar = citasFiltradas.map(cita => ({
            "Cliente": clienteNombre,
            "ID Cita": cita.id || 'N/A',
            "Servicio": cita.tipo || 'N/A',
            "Fecha Cita": cita.fecha || 'N/A',
            "Hora": cita.hora || 'N/A',
            "Monto": cita.precio || '$0.00',
            "Método Pago": cita.metodoPago || 'N/A',
            "Estado Pago": cita.estadoPago || 'Pendiente'
        }));

        const ws = XLSX.utils.json_to_sheet(datosParaExportar);
        // Ajustar anchos de columna
        ws['!cols'] = [
            { wch: 25 }, // Cliente
            { wch: 20 }, // ID Cita
            { wch: 25 }, // Servicio
            { wch: 12 }, // Fecha Cita
            { wch: 10 }, // Hora
            { wch: 12 }, // Monto
            { wch: 15 }, // Método Pago
            { wch: 12 }  // Estado Pago
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pagos");
        
        // Generar el archivo
        XLSX.writeFile(wb, "Reporte_Pagos_AFGCORPORACION.xlsx");
    }

}); // Fin de DOMContentLoaded