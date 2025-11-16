// ===== CONSTANTES Y CONFIGURACIÓN =====
const RUTA_DASHBOARD = '../paginas/Dashboard_Asesor.html';
const MIN_PASSWORD_LENGTH = 8;

// Variable para prevenir envíos múltiples
let enviandoFormulario = false;

// ===== FUNCIONES AUXILIARES =====

/**
 * Función segura para guardar en localStorage
 * @param {string} key - Clave del localStorage
 * @param {string} value - Valor a guardar
 * @returns {boolean} - true si se guardó exitosamente
 */
function guardarEnLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.error('Error al guardar en localStorage:', e);
        
        if (e.name === 'QuotaExceededError') {
            mostrarErrorGeneral('El almacenamiento está lleno. Por favor, limpia algunos datos.');
        } else if (e.name === 'SecurityError') {
            mostrarErrorGeneral('El almacenamiento no está disponible en modo incógnito.');
        } else {
            mostrarErrorGeneral('No se pudo guardar la información. Intenta de nuevo.');
        }
        return false;
    }
}

/**
 * Validar email con regex robusto
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el email es válido
 */
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(String(email).toLowerCase());
}

/**
 * Mostrar mensaje de error en el input específico
 * @param {string} inputId - ID del input
 * @param {string} mensaje - Mensaje de error a mostrar
 */
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

/**
 * Limpiar mensaje de error del input específico
 * @param {string} inputId - ID del input
 */
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

/**
 * Mostrar mensaje de error general
 * @param {string} mensaje - Mensaje de error general
 */
function mostrarErrorGeneral(mensaje) {
    const mensajeErrorDiv = document.getElementById('mensaje-error-general');
    
    if (mensajeErrorDiv) {
        mensajeErrorDiv.textContent = mensaje;
        mensajeErrorDiv.classList.add('show');
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            mensajeErrorDiv.classList.remove('show');
        }, 5000);
    }
}

/**
 * Limpiar mensaje de error general
 */
function limpiarErrorGeneral() {
    const mensajeErrorDiv = document.getElementById('mensaje-error-general');
    
    if (mensajeErrorDiv) {
        mensajeErrorDiv.textContent = '';
        mensajeErrorDiv.classList.remove('show');
    }
}

/**
 * Deshabilitar botón de envío
 * @param {HTMLElement} boton - Botón a deshabilitar
 */
function deshabilitarBoton(boton) {
    if (boton) {
        boton.disabled = true;
        boton.textContent = 'Iniciando sesión...';
        boton.setAttribute('aria-busy', 'true');
    }
}

/**
 * Habilitar botón de envío
 * @param {HTMLElement} boton - Botón a habilitar
 */
function habilitarBoton(boton) {
    if (boton) {
        boton.disabled = false;
        boton.textContent = 'Iniciar Sesión';
        boton.setAttribute('aria-busy', 'false');
    }
}

/**
 * Función para mostrar/ocultar contraseña
 */
function togglePassword() {
    try {
        const inputPassword = document.getElementById('password');
        const iconoOjo = document.getElementById('icono-ojo');
        
        // Validar que los elementos existan
        if (!inputPassword) {
            console.error('Input de contraseña no encontrado');
            return;
        }
        
        if (!iconoOjo) {
            console.error('Ícono de ojo no encontrado');
            return;
        }
        
        if (inputPassword.type === 'password') {
            inputPassword.type = 'text';
            iconoOjo.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            inputPassword.type = 'password';
            iconoOjo.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    } catch (error) {
        console.error('Error en togglePassword:', error);
    }
}

// ===== INICIALIZACIÓN AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('✅ Iniciando sistema de login para asesores...');
        
        // ===== BOTÓN TOGGLE PASSWORD =====
        const btnTogglePassword = document.getElementById('btnTogglePassword');
        if (btnTogglePassword) {
            btnTogglePassword.addEventListener('click', togglePassword);
        }
        
        // ===== BLOQUE DE ENLACE RECUPERAR ELIMINADO =====
        // Al borrar el bloque, el enlace HTML (href) funcionará
        // de forma nativa, llevándote a la página correcta.
        
        // ===== FORMULARIO DE LOGIN =====
        const formulario = document.getElementById('formLogin');
        
        if (!formulario) {
            console.error('Formulario no encontrado');
            return;
        }
        
        formulario.addEventListener('submit', function(evento) {
            evento.preventDefault();
            
            // Prevenir envíos múltiples
            if (enviandoFormulario) {
                console.log('Formulario ya está siendo procesado');
                return;
            }
            
            // Limpiar errores previos
            limpiarError('email');
            limpiarError('password');
            limpiarErrorGeneral();
            
            // Obtener valores (con validación de existencia)
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            if (!emailInput || !passwordInput) {
                mostrarErrorGeneral('Error: Campos del formulario no encontrados');
                return;
            }
            
            const email = emailInput.value?.trim() || '';
            const password = passwordInput.value || '';
            
            let hayErrores = false;
            
            // ===== VALIDACIONES =====
            
            // Validación de email
            if (!email) {
                mostrarError('email', 'El email es requerido');
                hayErrores = true;
            } else if (!validarEmail(email)) {
                mostrarError('email', 'Por favor ingresa un email válido');
                hayErrores = true;
            }
            
            // Validación de contraseña
            if (!password) {
                mostrarError('password', 'La contraseña es requerida');
                hayErrores = true;
            } else if (password.length < MIN_PASSWORD_LENGTH) {
                mostrarError('password', `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
                hayErrores = true;
            }
            
            // Si hay errores, detener
            if (hayErrores) {
                return;
            }
            
            // Marcar como enviando
            enviandoFormulario = true;
            
            // Deshabilitar botón
            const botonEnviar = document.getElementById('btn-submit');
            deshabilitarBoton(botonEnviar);
            
            try {
                // Guardar datos en localStorage (SIN la contraseña)
                const datosAsesor = {
                    email: email,
                    rol: 'asesor',
                    metodoAuth: 'email',
                    fechaLogin: new Date().toISOString()
                };
                
                const guardadoExitoso = guardarEnLocalStorage(
                    'afgcorporacion_asesor_perfil', 
                    JSON.stringify(datosAsesor)
                );
                
                if (!guardadoExitoso) {
                    throw new Error('No se pudo guardar la información');
                }
                
                guardarEnLocalStorage('afgcorporacion_auth_method', 'email');
                guardarEnLocalStorage('afgcorporacion_authenticated', 'true');
                guardarEnLocalStorage('afgcorporacion_user_role', 'asesor');
                
                // Log seguro (SIN contraseña)
                console.log('✅ Asesor autenticado:', email);
                console.log('✅ Redirigiendo al dashboard...');
                
                // Aquí iría tu lógica de verificación con el servidor
                // fetch('/api/login/asesor', { method: 'POST', body: JSON.stringify({ email, password }) })
                
                // Redirección con delay
                setTimeout(() => {
                    window.location.href = RUTA_DASHBOARD;
                }, 500);
                
            } catch (error) {
                console.error('❌ Error al iniciar sesión:', error);
                mostrarErrorGeneral('Hubo un error al iniciar sesión. Por favor, intenta de nuevo.');
                
                // Rehabilitar botón
                habilitarBoton(botonEnviar);
                enviandoFormulario = false;
            }
        });
        
        // ===== VALIDACIÓN EN TIEMPO REAL =====
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        // Limpiar error al escribir en email
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    limpiarError('email');
                }
            });
            
            // Validar al salir del campo
            emailInput.addEventListener('blur', function() {
                const email = this.value.trim();
                if (email && !validarEmail(email)) {
                    mostrarError('email', 'Email inválido');
                }
            });
        }
        
        // Limpiar error al escribir en password
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    limpiarError('password');
                }
                
                // Validar longitud en tiempo real
                if (this.value.length > 0 && this.value.length < MIN_PASSWORD_LENGTH) {
                    mostrarError('password', `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`);
                }
            });
        }
        
        console.log('✅ Formulario de inicio de sesión inicializado correctamente');
        
    } catch (error) {
        console.error('❌ Error crítico al inicializar:', error);
        alert('Error al cargar la página. Por favor, recarga.');
    }
});

// ===== CLEANUP AL SALIR =====
window.addEventListener('beforeunload', function() {
    enviandoFormulario = false;
});

// ===== MANEJO DE TECLA ESC =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Limpiar errores si se presiona ESC
        limpiarError('email');
        limpiarError('password');
        limpiarErrorGeneral();
    }
});

// ===== PREVENIR ESPACIOS AL INICIO EN EMAIL =====
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('keydown', function(e) {
            // Prevenir espacio al inicio
            if (e.key === ' ' && this.value.length === 0) {
                e.preventDefault();
            }
        });
    }
});