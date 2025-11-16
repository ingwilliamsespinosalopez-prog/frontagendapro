// Ruta de redirección al perfil del cliente
const RUTA_PERFIL_CLIENTE = '../paginas/Perfil_Cliente.html';

// Función para mostrar/ocultar contraseña
function togglePassword(inputId) {
    // Obtiene el elemento input de contraseña por su ID
    const inputContraseña = document.getElementById(inputId);
    
    // Determina qué ícono usar según el input
    const iconoId = inputId === 'contraseña' ? 'icono-ojo' : 'icono-ojo-confirmar';
    const iconoOjo = document.getElementById(iconoId);
    
    // Verifica si el input está en modo 'password' (oculto)
    if (inputContraseña.type === 'password') {
        // Cambiar a tipo 'text' para mostrar la contraseña
        inputContraseña.type = 'text';
        
        // Cambiar el ícono a "ojo tachado" (indica que está visible)
        iconoOjo.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        // Cambiar a tipo 'password' para ocultar la contraseña
        inputContraseña.type = 'password';
        
        // Cambiar el ícono a "ojo normal" (indica que está oculto)
        iconoOjo.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// Función para crear cuenta con Google
function crearCuentaConGoogle() {
    console.log('Creando cuenta con Google...');
    
    // Simular autenticación con Google
    // En producción, aquí se implementaría Google OAuth
    
    // Guardar datos de autenticación
    localStorage.setItem('afgcorporacion_auth_method', 'google');
    localStorage.setItem('afgcorporacion_authenticated', 'true');
    
    // Simular datos del perfil de Google
    const perfilGoogle = {
        nombreCompleto: 'Usuario de Google',
        email: 'usuario@gmail.com',
        metodoAuth: 'google',
        fechaRegistro: new Date().toISOString()
    };
    
    localStorage.setItem('afgcorporacion_cliente_perfil', JSON.stringify(perfilGoogle));
    
    // Mostrar mensaje y redirigir
    alert('¡Cuenta creada con Google exitosamente!');
    window.location.href = RUTA_PERFIL_CLIENTE;
}

// Función para mostrar mensajes de error visuales
function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    input.classList.add('error');
    
    // Opcional: Mostrar mensaje debajo del input
    const mensajeError = document.createElement('small');
    mensajeError.style.color = '#ef4444';
    mensajeError.style.fontSize = '12px';
    mensajeError.style.marginTop = '5px';
    mensajeError.textContent = mensaje;
    
    // Verificar si ya existe un mensaje de error
    const grupoContenedor = input.closest('.grupo-campo');
    const errorExistente = grupoContenedor.querySelector('small');
    
    if (errorExistente) {
        errorExistente.remove();
    }
    
    grupoContenedor.appendChild(mensajeError);
}

// Función para limpiar errores
function limpiarError(inputId) {
    const input = document.getElementById(inputId);
    input.classList.remove('error');
    
    const grupoContenedor = input.closest('.grupo-campo');
    const mensajeError = grupoContenedor.querySelector('small');
    
    if (mensajeError) {
        mensajeError.remove();
    }
}

// Validación del formulario al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== BOTÓN DE GOOGLE =====
    const btnGoogle = document.getElementById('btn-google');
    
    if (btnGoogle) {
        btnGoogle.addEventListener('click', function(evento) {
            evento.preventDefault();
            crearCuentaConGoogle();
        });
    }
    
    // ===== FORMULARIO DE REGISTRO =====
    const formulario = document.querySelector('.formulario-registro');
    
    if (formulario) {
        formulario.addEventListener('submit', function(evento) {
            evento.preventDefault(); // Evita el envío por defecto
            
            // Limpiar todos los errores previos
            limpiarError('email');
            limpiarError('nombre');
            limpiarError('contraseña');
            limpiarError('confirmar-contraseña');
            
            // Obtener valores de los campos
            const email = document.getElementById('email').value.trim();
            const nombre = document.getElementById('nombre').value.trim();
            const contraseña = document.getElementById('contraseña').value;
            const confirmarContraseña = document.getElementById('confirmar-contraseña').value;
            
            let hayErrores = false;
            
            // Validación de email
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                mostrarError('email', 'Por favor ingresa un email válido');
                hayErrores = true;
            }
            
            // Validación de nombre
            if (nombre.length < 3) {
                mostrarError('nombre', 'El nombre debe tener al menos 3 caracteres');
                hayErrores = true;
            }
            
            // Validación de contraseña
            if (contraseña.length < 6) {
                mostrarError('contraseña', 'La contraseña debe tener al menos 6 caracteres');
                hayErrores = true;
            }
            
            // Validación de confirmar contraseña
            if (contraseña !== confirmarContraseña) {
                mostrarError('confirmar-contraseña', 'Las contraseñas no coinciden');
                hayErrores = true;
            }
            
            // Si hay errores, detener el proceso
            if (hayErrores) {
                return;
            }
            
            // Si todo está bien, guardar datos
            const datosCliente = {
                nombreCompleto: nombre,
                email: email,
                metodoAuth: 'email',
                fechaRegistro: new Date().toISOString()
            };
            
            // Guardar en localStorage
            localStorage.setItem('afgcorporacion_cliente_perfil', JSON.stringify(datosCliente));
            localStorage.setItem('afgcorporacion_auth_method', 'email');
            localStorage.setItem('afgcorporacion_authenticated', 'true');
            
            // Aquí puedes agregar la lógica para enviar datos al servidor
            console.log('Datos del formulario:', {
                email: email,
                nombre: nombre,
                contraseña: contraseña
            });
            
            // Mostrar mensaje de éxito y redirigir
            alert('¡Registro exitoso!');
            window.location.href = RUTA_PERFIL_CLIENTE;
        });
    }
    
    // ===== VALIDACIÓN EN TIEMPO REAL =====
    const inputConfirmar = document.getElementById('confirmar-contraseña');
    const inputContraseña = document.getElementById('contraseña');
    
    // Validar mientras escribe en confirmar contraseña
    if (inputConfirmar && inputContraseña) {
        inputConfirmar.addEventListener('input', function() {
            if (this.value && this.value !== inputContraseña.value) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                limpiarError('confirmar-contraseña');
            }
        });
        
        // También validar cuando cambia la contraseña principal
        inputContraseña.addEventListener('input', function() {
            if (inputConfirmar.value && this.value !== inputConfirmar.value) {
                inputConfirmar.classList.add('error');
            } else {
                inputConfirmar.classList.remove('error');
                limpiarError('confirmar-contraseña');
            }
        });
    }
});

/* 
=====================================
NOTAS DE IMPLEMENTACIÓN:
=====================================

1. BOTÓN DE GOOGLE:
   - Actualmente simula la autenticación
   - Para implementación real, usar Google OAuth 2.0
   - Documentación: https://developers.google.com/identity/protocols/oauth2

2. VALIDACIONES IMPLEMENTADAS:
   ✅ Email: Formato válido con regex
   ✅ Nombre: Mínimo 3 caracteres
   ✅ Contraseña: Mínimo 6 caracteres
   ✅ Confirmar contraseña: Debe coincidir
   ✅ Validación en tiempo real
   ✅ Mensajes de error visuales

3. DATOS GUARDADOS EN LOCALSTORAGE:
   - afgcorporacion_cliente_perfil: {nombreCompleto, email, metodoAuth, fechaRegistro}
   - afgcorporacion_auth_method: 'email' o 'google'
   - afgcorporacion_authenticated: 'true'

4. MEJORAS SUGERIDAS PARA PRODUCCIÓN:
   - Implementar hash de contraseñas (bcrypt)
   - Verificar email único en backend
   - Enviar email de verificación
   - Agregar reCAPTCHA
   - Implementar rate limiting
   - Usar HTTPS

=====================================
*/
