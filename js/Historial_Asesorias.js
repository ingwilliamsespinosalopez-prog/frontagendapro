document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMENTOS DEL DOM ---
    // (Se eliminaron: botonMenu, menuLateral, overlayMenu, itemsMenu)
    
    const pestanas = document.querySelectorAll('.pestana-historial');
    const indicador = document.getElementById('indicador-historial');
    const contenedorPestanas = document.querySelector('.contenedor-pestanas-historial');
    const tbody = document.getElementById('tbody-historial');
    
    // Controles de tabla
    const inputBuscar = document.getElementById('input-buscar');
    const filtroTipo = document.getElementById('filtro-tipo-asesoria');
    const btnOrdenarFecha = document.getElementById('btn-ordenar-fecha');
    const btnExportarHistorial = document.getElementById('btn-exportar-historial');
    
    // Modal Exportar
    const modalConfirmarExportarHistorial = document.getElementById('modal-confirmar-exportar-historial');
    const btnCancelarExportarHistorial = document.getElementById('btn-cancelar-exportar-historial');
    const btnConfirmarExportarHistorial = document.getElementById('btn-confirmar-exportar-historial');

    // --- ESTADO DE LA APLICACIÓN ---
    let ordenAscendente = true;

    // --- INICIALIZACIÓN ---
    // (Se eliminó la lógica del menú)
    inicializarEventListeners();
    actualizarEstadisticas();
    posicionarIndicador();
    if (contenedorPestanas) {
        contenedorPestanas.setAttribute('data-activa', 'todas');
    }
    console.log('Historial de Asesorías inicializado correctamente');


    // ===== PESTAÑAS TIPO SLIDER =====
    
    // Posicionar el indicador en la pestaña activa
    function posicionarIndicador() {
        const pestanaActiva = document.querySelector('.pestana-historial.activa');
        if (pestanaActiva && indicador && window.innerWidth > 768) { // Corregido esMobile()
            const rect = pestanaActiva.getBoundingClientRect();
            const contenedorRect = contenedorPestanas.getBoundingClientRect();
            
            indicador.style.width = rect.width + 'px';
            indicador.style.left = (rect.left - contenedorRect.left) + 'px';
        }
    }

    // Cambiar de pestaña
    function cambiarPestana(pestana) {
        const filtro = pestana.getAttribute('data-filtro');
        
        // Remover clase activa de todas las pestañas
        pestanas.forEach(p => p.classList.remove('activa'));
        
        // Agregar clase activa a la pestaña clickeada
        pestana.classList.add('activa');
        
        // Actualizar el atributo data-activa del contenedor
        contenedorPestanas.setAttribute('data-activa', filtro);
        
        // Posicionar el indicador
        posicionarIndicador();
        
        // Filtrar tabla
        filtrarTabla(filtro);
        
        // Actualizar estadísticas (pero no la tasa de éxito)
        actualizarEstadisticas();
    }

    // Event listeners para las pestañas
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
                fila.classList.remove('oculta');
                fila.style.display = '';
                filasVisibles++;
            } else if (estado === filtro) {
                fila.classList.remove('oculta');
                fila.style.display = '';
                filasVisibles++;
            } else {
                fila.classList.add('oculta');
                fila.style.display = 'none';
            }
        });
        
        actualizarInfoPaginacion(filasVisibles, filas.length);
    }

    // ===== ACTUALIZAR ESTADÍSTICAS =====
    function actualizarEstadisticas() {
        const todasFilas = tbody.querySelectorAll('tr');
        
        let totalAsesorias = 0;
        let completadas = 0;
        let canceladas = 0;
        
        todasFilas.forEach(fila => {
            const estado = fila.getAttribute('data-estado');
            totalAsesorias++;
            
            if (estado === 'completada') {
                completadas++;
            } else if (estado === 'cancelada') {
                canceladas++;
            }
        });
        
        // Calcular tasa de éxito: (completadas / total) * 100
        // La tasa de éxito se calcula sobre TODAS las asesorías, no las filtradas
        const tasaExito = totalAsesorias > 0 ? Math.round((completadas / totalAsesorias) * 100) : 0;
        
        document.getElementById('total-asesorias').textContent = totalAsesorias;
        document.getElementById('completadas').textContent = completadas;
        document.getElementById('canceladas').textContent = canceladas;
        document.getElementById('tasa-exito').textContent = tasaExito + '%';
        
        console.log(`Tasa de Éxito: ${completadas}/${totalAsesorias} = ${tasaExito}%`);
    }

    // ===== BUSCADOR =====
    if (inputBuscar) {
        inputBuscar.addEventListener('input', function() {
            const termino = this.value.toLowerCase();
            const filas = tbody.querySelectorAll('tr');
            let filasVisibles = 0;
            
            filas.forEach(fila => {
                const texto = fila.textContent.toLowerCase();
                const pestanaActiva = document.querySelector('.pestana-historial.activa');
                const filtroActivo = pestanaActiva ? pestanaActiva.getAttribute('data-filtro') : 'todas';
                const estado = fila.getAttribute('data-estado');
                
                // Verificar si cumple con el filtro de pestaña Y con la búsqueda
                const cumpleFiltro = filtroActivo === 'todas' || estado === filtroActivo;
                const cumpleBusqueda = texto.includes(termino);
                
                if (cumpleFiltro && cumpleBusqueda) {
                    fila.style.display = '';
                    filasVisibles++;
                } else {
                    fila.style.display = 'none';
                }
            });
            
            actualizarInfoPaginacion(filasVisibles, filas.length);
        });
    }

    // ===== FILTRO POR TIPO DE ASESORÍA =====
    if (filtroTipo) {
        filtroTipo.addEventListener('change', function() {
            const tipoSeleccionado = this.value;
            const filas = tbody.querySelectorAll('tr');
            let filasVisibles = 0;
            
            filas.forEach(fila => {
                const tipo = fila.getAttribute('data-tipo');
                const pestanaActiva = document.querySelector('.pestana-historial.activa');
                const filtroActivo = pestanaActiva ? pestanaActiva.getAttribute('data-filtro') : 'todas';
                const estado = fila.getAttribute('data-estado');
                const terminoBusqueda = inputBuscar.value.toLowerCase();
                const texto = fila.textContent.toLowerCase();
                
                // Verificar todos los filtros
                const cumplePestana = filtroActivo === 'todas' || estado === filtroActivo;
                const cumpleTipo = tipoSeleccionado === 'todos' || tipo === tipoSeleccionado;
                const cumpleBusqueda = !terminoBusqueda || texto.includes(terminoBusqueda);
                
                if (cumplePestana && cumpleTipo && cumpleBusqueda) {
                    fila.style.display = '';
                    filasVisibles++;
                } else {
                    fila.style.display = 'none';
                }
            });
            
            actualizarInfoPaginacion(filasVisibles, filas.length);
        });
    }

    // ===== ORDENAR POR FECHA =====
    if (btnOrdenarFecha) {
        btnOrdenarFecha.addEventListener('click', function() {
            const filas = Array.from(tbody.querySelectorAll('tr'));
            
            filas.sort((a, b) => {
                const fechaA = a.cells[4].textContent.trim();
                const fechaB = b.cells[4].textContent.trim();
                const horaA = a.cells[5].textContent.trim();
                const horaB = b.cells[5].textContent.trim();
                
                // Convertir fecha de DD/MM/YYYY a Date
                const [diaA, mesA, anioA] = fechaA.split('/');
                const [diaB, mesB, anioB] = fechaB.split('/');
                
                const fechaCompletaA = new Date(`${anioA}-${mesA}-${diaA} ${horaA}`);
                const fechaCompletaB = new Date(`${anioB}-${mesB}-${diaB} ${horaB}`);
                
                if (ordenAscendente) {
                    return fechaCompletaA - fechaCompletaB;
                } else {
                    return fechaCompletaB - fechaCompletaA;
                }
            });
            
            // Reordenar en el DOM
            filas.forEach(fila => tbody.appendChild(fila));
            
            ordenAscendente = !ordenAscendente;
            
            // Cambiar icono visual
            this.style.transform = ordenAscendente ? 'rotate(0deg)' : 'rotate(180deg)';
            
            console.log('Ordenado por fecha:', ordenAscendente ? 'Más antiguo primero' : 'Más reciente primero');
        });
    }

    // ===== EXPORTAR HISTORIAL A EXCEL =====

    // Función para abrir modal
    function abrirModal(modal) {
        if (modal) {
            modal.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }

    // Función para cerrar modal
    function cerrarModal(modal) {
        if (modal) {
            modal.classList.remove('activo');
            if (document.querySelectorAll('.modal-overlay.activo').length === 0) {
                document.body.style.overflow = '';
            }
        }
    }

    if (btnExportarHistorial) {
        btnExportarHistorial.addEventListener('click', function() {
            // Verificar si hay datos para exportar
            const filasVisibles = tbody.querySelectorAll('tr:not([style*="display: none"])');
            
            if (filasVisibles.length === 0) {
                alert('No hay datos para exportar');
                return;
            }
            
            // Mostrar modal de confirmación
            abrirModal(modalConfirmarExportarHistorial);
        });
    }

    // Cancelar exportación
    if (btnCancelarExportarHistorial) {
        btnCancelarExportarHistorial.addEventListener('click', function() {
            cerrarModal(modalConfirmarExportarHistorial);
        });
    }

    // Confirmar exportación
    if (btnConfirmarExportarHistorial) {
        btnConfirmarExportarHistorial.addEventListener('click', function() {
            cerrarModal(modalConfirmarExportarHistorial);
            exportarHistorialAExcel();
        });
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        // (La lógica del menú la maneja Perfil_Administrador.js)
        if (e.key === 'Escape' && modalConfirmarExportarHistorial && modalConfirmarExportarHistorial.classList.contains('activo')) {
            cerrarModal(modalConfirmarExportarHistorial);
        }
    });

    // Cerrar modal al hacer clic fuera
    if (modalConfirmarExportarHistorial) {
        modalConfirmarExportarHistorial.addEventListener('click', function(e) {
            if (e.target === modalConfirmarExportarHistorial) {
                cerrarModal(modalConfirmarExportarHistorial);
            }
        });
    }

    // Función para exportar a Excel
    function exportarHistorialAExcel() {
        // Verificar si la librería XLSX está disponible
        if (typeof XLSX === 'undefined') {
            alert('Error: La librería de exportación no está disponible');
            return;
        }

        // Obtener todas las filas visibles
        const filasVisibles = tbody.querySelectorAll('tr:not([style*="display: none"])');
        
        if (filasVisibles.length === 0) {
            alert('No hay datos para exportar');
            return;
        }

        // Crear array de datos
        const datos = [];
        
        // Agregar encabezados
        datos.push(['ID', 'Nombre de Cliente', 'Modalidad', 'Tipo de asesoría', 'Fecha', 'Hora', 'Duración', 'Estado']);
        
        // Agregar datos de cada fila
        filasVisibles.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            const fila_datos = [
                celdas[0].textContent.trim(), // ID
                celdas[1].textContent.trim(), // Nombre
                celdas[2].textContent.trim(), // Modalidad
                celdas[3].textContent.trim(), // Tipo
                celdas[4].textContent.trim(), // Fecha
                celdas[5].textContent.trim(), // Hora
                celdas[6].textContent.trim(), // Duración
                celdas[7].textContent.trim()  // Estado
            ];
            datos.push(fila_datos);
        });

        // Crear libro de trabajo
        const libro = XLSX.utils.book_new();
        const hoja = XLSX.utils.aoa_to_sheet(datos);

        // Ajustar ancho de columnas
        const anchos = [
            { wch: 10 }, // ID
            { wch: 30 }, // Nombre
            { wch: 12 }, // Modalidad
            { wch: 20 }, // Tipo
            { wch: 12 }, // Fecha
            { wch: 10 }, // Hora
            { wch: 12 }, // Duración
            { wch: 12 }  // Estado
        ];
        hoja['!cols'] = anchos;

        // Agregar hoja al libro
        XLSX.utils.book_append_sheet(libro, hoja, 'Historial');

        // Generar nombre del archivo con fecha actual
        const fecha = new Date();
        const nombreArchivo = `Historial_Asesorias_${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}.xlsx`;

        // Descargar archivo
        XLSX.writeFile(libro, nombreArchivo);

        console.log('Archivo Excel exportado:', nombreArchivo);
        console.log('Total de registros exportados:', filasVisibles.length);
    }

    // ===== PAGINACIÓN =====
    function actualizarInfoPaginacion(visibles, total) {
        const infoPaginacion = document.getElementById('info-paginacion');
        if (infoPaginacion) {
            infoPaginacion.textContent = `Mostrando ${visibles} de ${total} registros`;
        }
    }

    // ===== DETALLES =====
    const botonesDetalles = document.querySelectorAll('.btn-detalles-historial');
    
    botonesDetalles.forEach(boton => {
        boton.addEventListener('click', function() {
            const fila = this.closest('tr');
            const id = fila.cells[0].textContent;
            const nombre = fila.cells[1].textContent;
            const modalidad = fila.cells[2].textContent;
            const tipo = fila.cells[3].textContent;
            const fecha = fila.cells[4].textContent;
            const hora = fila.cells[5].textContent;
            const duracion = fila.cells[6].textContent;
            const estado = fila.cells[7].textContent.trim();
            
            console.log('Detalles de la asesoría:');
            console.log('ID:', id);
            console.log('Cliente:', nombre);
            console.log('Modalidad:', modalidad);
            console.log('Tipo:', tipo);
            console.log('Fecha:', fecha);
            console.log('Hora:', hora);
            console.log('Duración:', duracion);
            console.log('Estado:', estado);
            
            // Aquí podrías abrir un modal con los detalles completos
            alert(`Detalles de la asesoría:\n\nID: ${id}\nCliente: ${nombre}\nModalidad: ${modalidad}\nTipo: ${tipo}\nFecha: ${fecha}\nHora: ${hora}\nDuración: ${duracion}\nEstado: ${estado}`);
        });
    });

    // ===== ANIMACIONES DE ENTRADA =====
    const tarjetasEstadistica = document.querySelectorAll('.tarjeta-estadistica-historial');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    tarjetasEstadistica.forEach(tarjeta => {
        tarjeta.style.opacity = '0';
        tarjeta.style.transform = 'translateY(20px)';
        tarjeta.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(tarjeta);
    });

    // --- EVENT LISTENERS ---
    
    function inicializarEventListeners() {
        // (La lógica del menú y logout se maneja en Perfil_Administrador.js)

        // Ajustar indicador de pestañas al cambiar tamaño
        window.addEventListener('resize', posicionarIndicador);

        // (El resto de listeners ya están aplicados arriba)
    }

}); // Fin de DOMContentLoaded