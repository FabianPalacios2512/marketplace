/**
 * 📱 PWA INSTALL MANAGER
 * Maneja la instalación de la PWA y prompts de instalación
 */
class PWAInstallManager {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        this.checkIfInstalled();
        this.setupEventListeners();
        this.createInstallButton();
    }

    // Verificar si ya está instalada
    checkIfInstalled() {
        // PWA instalada si display-mode es standalone
        this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone === true ||
                          document.referrer.includes('android-app://');
        
        const environment = window.location.protocol === 'https:' ? 'PRODUCCIÓN' : 'DESARROLLO';
        console.log(`📱 PWA Install Manager [${environment}]:`, this.isInstalled ? 'Ya instalada' : 'No instalada');
        
        // Mostrar info sobre limitaciones en desarrollo
        if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
            console.warn('⚠️ PWA en HTTP: Funciones limitadas. En HTTPS tendrás funcionalidad completa.');
        }
    }

    setupEventListeners() {
        // Capturar evento beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 PWA: beforeinstallprompt disparado');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Detectar cuando se instala
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA: App instalada exitosamente');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstalledMessage();
        });

        // Detectar cambios en display mode
        window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
            this.isInstalled = e.matches;
            if (this.isInstalled) {
                this.hideInstallButton();
            }
        });
    }

    createInstallButton() {
        // Solo crear si no está instalada
        if (this.isInstalled) return;

        // Crear banner principal de instalación
        this.installButton = document.createElement('div');
        this.installButton.id = 'pwa-install-prompt';
        this.installButton.innerHTML = `
            <!-- Banner Principal - Top -->
            <div class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white transform transition-all duration-500 -translate-y-full" id="install-banner-top">
                <div class="px-4 py-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <i class="fas fa-mobile-alt text-white text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg">📱 ¿Deseas descargar la App Móvil?</h3>
                                <p class="text-sm text-indigo-100">Acceso rápido, funciona offline y como app nativa</p>
                            </div>
                        </div>
                        <button id="close-install-prompt-top" class="text-white/70 hover:text-white p-1">
                            <i class="fas fa-times text-lg"></i>
                        </button>
                    </div>
                    <div class="mt-3 flex space-x-3">
                        <button id="install-app-btn-top" class="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-indigo-50 transition-all flex items-center space-x-2 shadow-lg">
                            <i class="fas fa-download"></i>
                            <span>Instalar App</span>
                        </button>
                        <button id="maybe-later-btn-top" class="text-white/90 px-4 py-2 rounded-full text-sm hover:text-white transition-colors border border-white/30">
                            Más tarde
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.installButton);

        // Event listeners para los botones
        document.getElementById('install-app-btn-top').addEventListener('click', () => {
            this.installApp();
        });

        document.getElementById('close-install-prompt-top').addEventListener('click', () => {
            this.hideInstallButton();
        });

        document.getElementById('maybe-later-btn-top').addEventListener('click', () => {
            this.hideInstallButton();
            // No mostrar por 24 horas
            localStorage.setItem('pwa-install-dismissed', Date.now() + (24 * 60 * 60 * 1000));
        });
    }

    showInstallButton() {
        if (!this.installButton || this.isInstalled) return;

        // Verificar si fue rechazado recientemente
        const dismissedUntil = localStorage.getItem('pwa-install-dismissed');
        if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
            console.log('📱 PWA: Install prompt dismissed, esperando...');
            return;
        }

        // Mostrar banner principal después de 3 segundos
        setTimeout(() => {
            const topBanner = document.getElementById('install-banner-top');
            if (topBanner) {
                topBanner.classList.remove('-translate-y-full');
                topBanner.classList.add('translate-y-0');
            }
        }, 3000);
    }

    hideInstallButton() {
        const topBanner = document.getElementById('install-banner-top');
        if (topBanner) {
            topBanner.classList.add('-translate-y-full');
            topBanner.classList.remove('translate-y-0');
        }
        
        // Remover completamente después de la animación
        setTimeout(() => {
            if (this.installButton) {
                this.installButton.remove();
                this.installButton = null;
            }
        }, 500);
    }

    async installApp() {
        if (!this.deferredPrompt) {
            console.warn('📱 PWA: No hay prompt disponible');
            return;
        }

        try {
            // Mostrar el prompt de instalación
            this.deferredPrompt.prompt();
            
            // Esperar la respuesta del usuario
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log('📱 PWA: User choice:', outcome);
            
            if (outcome === 'accepted') {
                console.log('✅ PWA: Usuario aceptó la instalación');
                this.hideInstallButton();
            } else {
                console.log('❌ PWA: Usuario rechazó la instalación');
                // Guardar rechazo por 7 días
                localStorage.setItem('pwa-install-dismissed', Date.now() + (7 * 24 * 60 * 60 * 1000));
            }

            this.deferredPrompt = null;
        } catch (error) {
            console.error('❌ PWA: Error en instalación:', error);
        }
    }

    showInstalledMessage() {
        // Mostrar mensaje de confirmación
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname.includes('192.168');
        const environment = window.location.protocol === 'https:' ? '' : ' (Modo Desarrollo)';
        
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div class="fixed top-4 right-4 z-50 bg-green-600 text-white p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-check-circle text-lg"></i>
                    <div>
                        <h4 class="font-semibold text-sm">¡App Instalada!${environment}</h4>
                        <p class="text-xs text-green-100">
                            ${isLocal ? 
                                'Instalada desde desarrollo local. En producción tendrás todas las funciones.' : 
                                'Uni-Eats ahora está en tu pantalla principal'
                            }
                        </p>
                        ${isLocal ? 
                            '<p class="text-xs text-green-200 mt-1">💡 Funciona offline y con menú fijo</p>' : 
                            ''
                        }
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // Método para forzar mostrar prompt (para botón manual)
    showInstallPrompt() {
        if (this.isInstalled) {
            console.log('📱 PWA: Ya está instalada');
            return;
        }

        if (this.deferredPrompt) {
            this.installApp();
        } else {
            // Mostrar instrucciones manuales
            this.showManualInstallInstructions();
        }
    }

    showManualInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = '';
        
        if (isIOS) {
            instructions = `
                <div class="text-center">
                    <i class="fas fa-mobile-alt text-4xl text-indigo-600 mb-3"></i>
                    <h3 class="font-bold text-lg mb-2">Instalar en iOS</h3>
                    <ol class="text-left space-y-2 text-sm">
                        <li>1. Toca el botón <i class="fas fa-share"></i> compartir</li>
                        <li>2. Selecciona "Añadir a inicio"</li>
                        <li>3. Confirma tocando "Añadir"</li>
                    </ol>
                </div>
            `;
        } else if (isAndroid) {
            instructions = `
                <div class="text-center">
                    <i class="fas fa-mobile-alt text-4xl text-indigo-600 mb-3"></i>
                    <h3 class="font-bold text-lg mb-2">Instalar en Android</h3>
                    <ol class="text-left space-y-2 text-sm">
                        <li>1. Toca el menú <i class="fas fa-ellipsis-v"></i> (tres puntos)</li>
                        <li>2. Selecciona "Instalar app" o "Añadir a inicio"</li>
                        <li>3. Confirma la instalación</li>
                    </ol>
                </div>
            `;
        } else {
            instructions = `
                <div class="text-center">
                    <i class="fas fa-desktop text-4xl text-indigo-600 mb-3"></i>
                    <h3 class="font-bold text-lg mb-2">Instalar en Escritorio</h3>
                    <p class="text-sm">Busca el ícono de instalación <i class="fas fa-download"></i> en la barra de direcciones de tu navegador.</p>
                </div>
            `;
        }

        // Crear modal con instrucciones
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                    ${instructions}
                    <button class="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors" onclick="this.closest('.fixed').remove()">
                        Entendido
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Información sobre la PWA
    getPWAInfo() {
        return {
            isInstalled: this.isInstalled,
            isStandalone: window.matchMedia('(display-mode: standalone)').matches,
            canInstall: !!this.deferredPrompt,
            platform: this.detectPlatform()
        };
    }

    detectPlatform() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return 'iOS';
        if (/Android/.test(navigator.userAgent)) return 'Android';
        if (/Windows/.test(navigator.userAgent)) return 'Windows';
        if (/Mac/.test(navigator.userAgent)) return 'macOS';
        return 'Desktop';
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PWAInstaller = new PWAInstallManager();
    });
} else {
    window.PWAInstaller = new PWAInstallManager();
}

// Exportar para uso global
window.PWAInstallManager = PWAInstallManager;