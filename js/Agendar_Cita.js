// ===== AGENDAR CITA EN BACKEND =====
async function agendarCita() {
    if (!datosFormulario) return;

    try {
        // Convertir fecha a formato MySQL YYYY-MM-DD
        const year = datosFormulario.fecha.getFullYear();
        const month = String(datosFormulario.fecha.getMonth() + 1).padStart(2, "0");
        const day = String(datosFormulario.fecha.getDate()).padStart(2, "0");
        const fechaMySQL = `${year}-${month}-${day}`;

        // Obtener valores del DOM
        const idCliente = document.getElementById("idCliente").value;
        const idAsesor = document.getElementById("idAsesor").value; 
        const idServicio = datosFormulario.tipo;
        const horaCita = datosFormulario.horario + ":00";
        const idModalidad = datosFormulario.modalidad;
        const notasText = datosFormulario.notas || "";
        const idMetodoPago = datosFormulario.metodoPago;
        const monto = datosFormulario.precio.replace("$", "").replace("MXN", "").trim();

        // ============================
        // 1. REGISTRAR CITA
        // ============================
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

        const respuestaCita = await fetch("https://TU_DOMINIO/api/citas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(citaPayload)
        });

        if (!respuestaCita.ok) throw new Error("Error al registrar la cita");

        const citaCreada = await respuestaCita.json();
        const idCitaCreada = citaCreada.idCita;

        // ============================
        // 2. REGISTRAR PAGO
        // ============================
        const pagoPayload = {
            idCita: idCitaCreada,
            monto: parseFloat(monto),
            idTransaccion: "TX-" + Date.now(),
            idEstadoPago: 1, // 1 = Pendiente
            idMetodoPago: parseInt(idMetodoPago)
        };

        const respuestaPago = await fetch("https://TU_DOMINIO/api/pagos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pagoPayload)
        });

        if (!respuestaPago.ok) throw new Error("Error al registrar el pago");

        mostrarNotificacion();

        // Limpiar todo
        if (formularioCita) formularioCita.reset();
        fechaSeleccionada = null;
        renderizarCalendario();

        if (seccionTotal) seccionTotal.style.display = "none";
        if (seccionPago) seccionPago.style.display = "none";
        precioTotalEl.textContent = "$0.00 MXN";

    } catch (error) {
        console.error("❌ ERROR en agendar cita:", error);
        alert("Ocurrió un error al guardar la cita");
    }
}
