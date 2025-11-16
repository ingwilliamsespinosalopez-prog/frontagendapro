// =============================================
// CONFIG
// =============================================
const RUTA_PERFIL_CLIENTE = '../paginas/Perfil_Cliente.html';
let enviandoFormulario = false;

// =============================================
// FUNCIONES DE UTILIDAD
// =============================================
function guardarEnLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.error('Error al guardar en localStorage:', e);
        return false;
    }
}

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(String(email).toLowerCase());
}

function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}-error`);

    if (input) {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
    }

    if (errorSpan) {
        errorSpan.textContent = mensaje;
        errorSpan.classList.add('show');
    }
}

function limpiarError(inputId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}-error`);

    if (input) {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
    }

    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.classList.remove('show');
    }
}

function deshabilitarBoton(boton) {
    boton.disabled = true;
    boton.textContent = 'Iniciando sesión...';
}

function habilitarBoton(boton) {
    boton.disabled = false;
    boton.textContent = 'Iniciar Sesión';
}

function togglePassword() {
    const input = document.getElementById('password');
    const icono = document.getElementById('icono-ojo');

    if (input.type === 'password') {
        input.type = 'text';
        icono.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        input.type = 'password';
        icono.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// =============================================
// LOGIN REAL HACIA TU BACKEND
// =============================================
async function enviarLoginAlServidor(email, password) {
    const params = new URLSearchParams();
    params.append("correo", email);
    params.append("contrasena", password);

    const respuesta = await fetch("http://3.231.210.28:7000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    });

    if (!respuesta.ok) {
        throw new Error("Error en servidor");
    }

    return await respuesta.json();
}

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', () => {

    const toggleBtn = document.getElementById('toggle-password-btn');
    if (toggleBtn) toggleBtn.addEventListener('click', togglePassword);

    const formulario = document.querySelector('.login-form');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (enviandoFormulario) return;

        limpiarError('email');
        limpiarError('password');

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        let hayErrores = false;

        if (!email) {
            mostrarError('email', 'El email es requerido');
            hayErrores = true;
        } else if (!validarEmail(email)) {
            mostrarError('email', 'Correo inválido');
            hayErrores = true;
        }

        if (!password) {
            mostrarError('password', 'La contraseña es requerida');
            hayErrores = true;
        }

        if (hayErrores) return;

        const btn = document.getElementById('btn-submit');
        enviandoFormulario = true;
        deshabilitarBoton(btn);

        try {
            // ========= LOGIN REAL ============
            const data = await enviarLoginAlServidor(email, password);

            // Guardar datos seguros
            guardarEnLocalStorage("token", data.token);
            guardarEnLocalStorage("rol", data.rol);
            guardarEnLocalStorage("id", data.id);

            // Redirección
            window.location.href = RUTA_PERFIL_CLIENTE;

        } catch (error) {
            console.error(error);
            mostrarError('password', 'Error de conexión con el servidor');
            habilitarBoton(btn);
            enviandoFormulario = false;
        }
    });

    document.getElementById('email').addEventListener('input', () => limpiarError('email'));
    document.getElementById('password').addEventListener('input', () => limpiarError('password'));
});
