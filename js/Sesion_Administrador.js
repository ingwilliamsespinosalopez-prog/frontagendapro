document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");
    const errorDiv = document.getElementById("mensaje-error");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("email").value.trim();
        const contrasena = document.getElementById("password").value.trim();

        // ===== VALIDACIONES =====
        if (!correo || !contrasena) {
            mostrarError("Todos los campos son obligatorios");
            return;
        }

        // ===== ARMAMOS FORM-DATA =====
        const formData = new URLSearchParams();
        formData.append("correo", correo);
        formData.append("contrasena", contrasena);

        try {
            // ===== PETICIÓN AL BACKEND =====
            const resp = await fetch("http://3.231.210.28:7000/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString()
            });

            if (!resp.ok) {
                const errorTxt = await resp.text();
                mostrarError(errorTxt);
                return;
            }

            const data = await resp.json();

            // ===== GUARDAR DATOS EN LOCALSTORAGE =====
            localStorage.setItem("afg_token", data.token);
            localStorage.setItem("afg_user_role", data.rol);
            localStorage.setItem("afg_user_id", data.id);
            localStorage.setItem("afg_user_email", correo);

            // ===== REDIRECCIONAR =====
            if (data.rol === 3) {
                window.location.href = "/paginas/Perfil_Administrador.html";
            } else {
                window.location.href = "/paginas/Perfil_Usuario.html";
            }

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            mostrarError("No se pudo conectar al servidor.");
        }
    });

    // ============= FUNCIÓN PARA MOSTRAR ERRORES ==================
    function mostrarError(msg) {
        if (errorDiv) {
            errorDiv.textContent = msg;
            errorDiv.style.color = "red";
        } else {
            alert(msg);
        }
    }
});
