document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MENÚ HAMBURGUESA =====
    const botonMenu = document.getElementById('boton-menu');
    const navegacion = document.getElementById('navegacion');
    const overlayMenu = document.getElementById('overlay-menu');
    const enlacesNav = document.querySelectorAll('.enlace-nav, .boton-iniciar');

    function esMobile() {
        return window.innerWidth <= 768;
    }

    function abrirMenu() {
        if (esMobile()) {
            navegacion.classList.add('abierto');
            overlayMenu.classList.add('activo');
            botonMenu.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }

    function cerrarMenu() {
        navegacion.classList.remove('abierto');
        overlayMenu.classList.remove('activo');
        botonMenu.classList.remove('activo');
        document.body.style.overflow = '';
    }

    // Toggle del menú
    if (botonMenu) {
        botonMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navegacion.classList.contains('abierto')) {
                cerrarMenu();
            } else {
                abrirMenu();
            }
        });
    }

    // Cerrar menú al hacer clic en el overlay
    if (overlayMenu) {
        overlayMenu.addEventListener('click', cerrarMenu);
    }

    // Cerrar menú al hacer clic en un enlace
    enlacesNav.forEach(enlace => {
        enlace.addEventListener('click', function() {
            if (esMobile()) {
                cerrarMenu();
            }
        });
    });

    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navegacion.classList.contains('abierto') && esMobile()) {
            cerrarMenu();
        }
    });

    // Ajustar al cambiar el tamaño de ventana
    window.addEventListener('resize', function() {
        if (!esMobile()) {
            cerrarMenu();
        }
    });

    // ===== ANIMACIONES DE ENTRADA =====
    const tarjetasServicio = document.querySelectorAll('.tarjeta-servicio');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const tarjetasObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                tarjetasObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplicar animación a las tarjetas de servicio
    tarjetasServicio.forEach(tarjeta => {
        tarjeta.style.opacity = '0';
        tarjeta.style.transform = 'translateY(30px)';
        tarjeta.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        tarjetasObserver.observe(tarjeta);
    });

    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== EFECTO EN EL HEADER AL HACER SCROLL =====
    const header = document.querySelector('.encabezado');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    console.log('Página Principal cargada correctamente');


    // ============================================
    // SISTEMA DE GESTIÓN DE COOKIES
    // ============================================
    
    class GestorCookies {
        constructor() {
            this.cookieName = 'afgcorporacion_cookies_consent';
            this.cookieExpireDays = 365;
            this.init();
        }

        init() {
            // Verificar si ya hay consentimiento guardado
            const consent = this.obtenerConsentimiento();
            
            if (!consent) {
                // Mostrar banner después de 1 segundo
                setTimeout(() => {
                    this.mostrarBanner();
                }, 1000);
            } else {
                console.log('Consentimiento de cookies ya guardado:', consent);
                this.aplicarPreferencias(consent);
            }

            this.configurarEventos();
        }

        configurarEventos() {
            // Botones del banner
            document.getElementById('aceptarCookies')?.addEventListener('click', () => {
                this.aceptarTodas();
            });

            document.getElementById('rechazarCookies')?.addEventListener('click', () => {
                this.rechazarTodas();
            });

            document.getElementById('configurarCookies')?.addEventListener('click', () => {
                this.mostrarModal();
            });

            // Modal
            document.getElementById('cerrarModal')?.addEventListener('click', () => {
                this.ocultarModal();
            });

            document.getElementById('guardarPreferencias')?.addEventListener('click', () => {
                this.guardarPreferencias();
            });

            document.getElementById('rechazarTodas')?.addEventListener('click', () => {
                this.rechazarTodasModal();
            });

            // Cerrar modal al hacer clic fuera
            document.getElementById('cookieModal')?.addEventListener('click', (e) => {
                if (e.target.id === 'cookieModal') {
                    this.ocultarModal();
                }
            });

            // Política de privacidad
            document.getElementById('verPolitica')?.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Aquí iría un enlace a tu página de política de privacidad');
            });
        }

        mostrarBanner() {
            const banner = document.getElementById('cookieBanner');
            if (banner) {
                banner.classList.add('mostrar');
            }
        }

        ocultarBanner() {
            const banner = document.getElementById('cookieBanner');
            if (banner) {
                banner.classList.remove('mostrar');
            }
        }

        mostrarModal() {
            const modal = document.getElementById('cookieModal');
            if (modal) {
                modal.classList.add('mostrar');
                this.cargarPreferenciasEnModal();
            }
        }

        ocultarModal() {
            const modal = document.getElementById('cookieModal');
            if (modal) {
                modal.classList.remove('mostrar');
            }
        }

        aceptarTodas() {
            const preferencias = {
                necesarias: true,
                analisis: true,
                funcionalidad: true,
                marketing: true,
                timestamp: new Date().toISOString()
            };
            
            this.guardarConsentimiento(preferencias);
            this.ocultarBanner();
            this.aplicarPreferencias(preferencias);
            console.log('Todas las cookies aceptadas');
        }

        rechazarTodas() {
            const preferencias = {
                necesarias: true,
                analisis: false,
                funcionalidad: false,
                marketing: false,
                timestamp: new Date().toISOString()
            };
            
            this.guardarConsentimiento(preferencias);
            this.ocultarBanner();
            this.aplicarPreferencias(preferencias);
            console.log('Cookies rechazadas (solo necesarias activas)');
        }

        rechazarTodasModal() {
            document.getElementById('cookiesAnalisis').checked = false;
            document.getElementById('cookiesFuncionalidad').checked = false;
            document.getElementById('cookiesMarketing').checked = false;
            this.guardarPreferencias();
        }

        guardarPreferencias() {
            const preferencias = {
                necesarias: true,
                analisis: document.getElementById('cookiesAnalisis')?.checked || false,
                funcionalidad: document.getElementById('cookiesFuncionalidad')?.checked || false,
                marketing: document.getElementById('cookiesMarketing')?.checked || false,
                timestamp: new Date().toISOString()
            };
            
            this.guardarConsentimiento(preferencias);
            this.ocultarModal();
            this.ocultarBanner();
            this.aplicarPreferencias(preferencias);
            console.log('Preferencias guardadas:', preferencias);
        }

        cargarPreferenciasEnModal() {
            const consent = this.obtenerConsentimiento();
            if (consent) {
                document.getElementById('cookiesAnalisis').checked = consent.analisis || false;
                document.getElementById('cookiesFuncionalidad').checked = consent.funcionalidad || false;
                document.getElementById('cookiesMarketing').checked = consent.marketing || false;
            }
        }

        guardarConsentimiento(preferencias) {
            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + this.cookieExpireDays);
            
            document.cookie = `${this.cookieName}=${JSON.stringify(preferencias)}; expires=${expireDate.toUTCString()}; path=/; SameSite=Lax`;
        }

        obtenerConsentimiento() {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === this.cookieName) {
                    try {
                        return JSON.parse(decodeURIComponent(value));
                    } catch (e) {
                        return null;
                    }
                }
            }
            return null;
        }

        aplicarPreferencias(preferencias) {
            // Aquí aplicarías las preferencias reales
            // Por ejemplo, cargar Google Analytics si analisis es true
            
            if (preferencias.analisis) {
                console.log('✅ Activando cookies de análisis...');
                // Descomenta la siguiente línea para activar Google Analytics
                // this.cargarGoogleAnalytics();
            }

            if (preferencias.funcionalidad) {
                console.log('✅ Activando cookies de funcionalidad...');
                // Aquí cargarías funcionalidades adicionales
            }

            if (preferencias.marketing) {
                console.log('✅ Activando cookies de marketing...');
                // Descomenta la siguiente línea para activar Facebook Pixel
                // this.cargarFacebookPixel();
            }

            console.log('📊 Preferencias de cookies aplicadas:', preferencias);
        }

        // Método público para resetear las cookies (útil para testing)
        resetear() {
            document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            console.log('🔄 Cookies reseteadas. Recarga la página para ver el banner nuevamente.');
        }

        // ============================================
        // MÉTODOS PARA INTEGRAR SERVICIOS EXTERNOS
        // ============================================

        cargarGoogleAnalytics() {
            // Ejemplo de cómo cargar Google Analytics
            // Reemplaza 'G-XXXXXXXXXX' con tu ID de medición de Google Analytics 4
            
            const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // <- CAMBIA ESTO
            
            // Cargar el script de Google Analytics
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            document.head.appendChild(script);

            // Inicializar Google Analytics
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', GA_MEASUREMENT_ID);
            
            console.log('📈 Google Analytics cargado');
        }

        cargarFacebookPixel() {
            // Ejemplo de cómo cargar Facebook Pixel
            // Reemplaza 'XXXXXXXXXX' con tu ID de Facebook Pixel
            
            const FB_PIXEL_ID = 'XXXXXXXXXX'; // <- CAMBIA ESTO
            
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', FB_PIXEL_ID);
            fbq('track', 'PageView');
            
            console.log('📘 Facebook Pixel cargado');
        }

        cargarGoogleTagManager() {
            // Ejemplo de cómo cargar Google Tag Manager
            // Reemplaza 'GTM-XXXXXX' con tu ID de GTM
            
            const GTM_ID = 'GTM-XXXXXX'; // <- CAMBIA ESTO
            
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',GTM_ID);
            
            console.log('🏷️ Google Tag Manager cargado');
        }
    }

    // Inicializar el gestor de cookies
    const gestorCookies = new GestorCookies();

    // Exponer métodos útiles para desarrollo
    window.resetearCookies = () => gestorCookies.resetear();
    window.verConsentimiento = () => {
        const consent = gestorCookies.obtenerConsentimiento();
        console.log('📋 Consentimiento actual:', consent);
        return consent;
    };

    console.log('🍪 Sistema de cookies inicializado');
    console.log('💡 Comandos disponibles en consola:');
    console.log('   - window.resetearCookies() → Resetea las cookies');
    console.log('   - window.verConsentimiento() → Muestra el consentimiento actual');
});