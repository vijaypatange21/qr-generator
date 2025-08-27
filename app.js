// QR Generator Pro - JavaScript Application Logic (Fixed)

class QRGeneratorPro {
    constructor() {
        this.currentType = 'url';
        this.qrCode = null;
        this.settings = {
            foregroundColor: '#000000',
            backgroundColor: '#ffffff',
            size: 256,
            errorCorrectionLevel: 'M',
            theme: 'light'
        };
        
        // Ensure DOM is fully loaded before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing QR Generator Pro...');
        this.loadSettings();
        this.setupEventListeners();
        this.applyTheme();
        this.showInitialState();
    }

    showInitialState() {
        // Ensure the URL tab is active initially
        this.switchTab('url');
        this.hideDownloadSection();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Tab switching with improved event handling
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach((tab, index) => {
            console.log(`Setting up tab ${index}:`, tab.dataset.type);
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const type = e.currentTarget.dataset.type;
                console.log('Tab clicked:', type);
                this.switchTab(type);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // Input event listeners for real-time generation
        this.setupInputListeners();

        // Customization panel toggle - Fixed
        const customizationToggle = document.getElementById('customizationToggle');
        if (customizationToggle) {
            customizationToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Customization toggle clicked');
                this.toggleCustomization();
            });
        }

        // Customization inputs
        this.setupCustomizationListeners();

        // Download and copy buttons
        const downloadBtn = document.getElementById('downloadBtn');
        const copyBtn = document.getElementById('copyBtn');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadQR();
            });
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyQRToClipboard();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && e.target.matches('input, textarea')) {
                e.preventDefault();
                this.generateQRCode();
            }
        });
    }

    setupInputListeners() {
        // URL input
        const urlInput = document.getElementById('input-url');
        if (urlInput) {
            urlInput.addEventListener('input', this.debounce(() => this.generateQRCode(), 500));
            urlInput.addEventListener('blur', () => this.generateQRCode());
        }

        // Text input
        const textInput = document.getElementById('input-text');
        if (textInput) {
            textInput.addEventListener('input', this.debounce(() => this.generateQRCode(), 500));
            textInput.addEventListener('blur', () => this.generateQRCode());
        }

        // WiFi inputs
        const wifiInputs = ['wifi-ssid', 'wifi-password', 'wifi-security'];
        wifiInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', this.debounce(() => this.generateQRCode(), 500));
                input.addEventListener('change', () => this.generateQRCode());
            }
        });

        // Email inputs
        const emailInputs = ['email-address', 'email-subject', 'email-body'];
        emailInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', this.debounce(() => this.generateQRCode(), 500));
                input.addEventListener('blur', () => this.generateQRCode());
            }
        });

        // SMS inputs
        const smsInputs = ['sms-phone', 'sms-message'];
        smsInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', this.debounce(() => this.generateQRCode(), 500));
                input.addEventListener('blur', () => this.generateQRCode());
            }
        });
    }

    setupCustomizationListeners() {
        const foregroundColor = document.getElementById('foregroundColor');
        const backgroundColor = document.getElementById('backgroundColor');
        const qrSize = document.getElementById('qrSize');
        const errorLevel = document.getElementById('errorLevel');

        if (foregroundColor) {
            foregroundColor.addEventListener('change', (e) => {
                this.settings.foregroundColor = e.target.value;
                this.saveSettings();
                this.generateQRCode();
            });
        }

        if (backgroundColor) {
            backgroundColor.addEventListener('change', (e) => {
                this.settings.backgroundColor = e.target.value;
                this.saveSettings();
                this.generateQRCode();
            });
        }

        if (qrSize) {
            qrSize.addEventListener('change', (e) => {
                this.settings.size = parseInt(e.target.value);
                this.saveSettings();
                this.generateQRCode();
            });
        }

        if (errorLevel) {
            errorLevel.addEventListener('change', (e) => {
                this.settings.errorCorrectionLevel = e.target.value;
                this.saveSettings();
                this.generateQRCode();
            });
        }
    }

    switchTab(type) {
        console.log('Switching to tab:', type);
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-type="${type}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update active form
        document.querySelectorAll('.input-form').forEach(form => {
            form.classList.remove('active');
        });
        
        const activeForm = document.getElementById(`form-${type}`);
        if (activeForm) {
            activeForm.classList.add('active');
        }

        this.currentType = type;
        this.clearErrors();
        this.generateQRCode();
    }

    toggleTheme() {
        console.log('Toggling theme...');
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        this.saveSettings();
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.settings.theme === 'light' ? '🌙' : '☀️';
        }
    }

    toggleCustomization() {
        console.log('Toggling customization panel...');
        const toggle = document.getElementById('customizationToggle');
        const content = document.getElementById('customizationContent');
        
        if (toggle && content) {
            const isActive = toggle.classList.contains('active');
            
            if (isActive) {
                toggle.classList.remove('active');
                content.classList.remove('active');
                console.log('Customization panel closed');
            } else {
                toggle.classList.add('active');
                content.classList.add('active');
                console.log('Customization panel opened');
            }
        } else {
            console.error('Customization elements not found');
        }
    }

    validateInput() {
        const errors = {};
        let isValid = true;

        switch (this.currentType) {
            case 'url':
                const url = document.getElementById('input-url')?.value.trim() || '';
                if (!url) {
                    errors.url = 'Please enter a URL';
                    isValid = false;
                } else if (!this.isValidURL(url)) {
                    errors.url = 'Please enter a valid URL';
                    isValid = false;
                }
                break;

            case 'text':
                const text = document.getElementById('input-text')?.value.trim() || '';
                if (!text) {
                    errors.text = 'Please enter some text';
                    isValid = false;
                }
                break;

            case 'wifi':
                const ssid = document.getElementById('wifi-ssid')?.value.trim() || '';
                if (!ssid) {
                    errors.wifi = 'Please enter a network name (SSID)';
                    isValid = false;
                }
                break;

            case 'email':
                const email = document.getElementById('email-address')?.value.trim() || '';
                if (!email) {
                    errors.email = 'Please enter an email address';
                    isValid = false;
                } else if (!this.isValidEmail(email)) {
                    errors.email = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'sms':
                const phone = document.getElementById('sms-phone')?.value.trim() || '';
                if (!phone) {
                    errors.sms = 'Please enter a phone number';
                    isValid = false;
                }
                break;
        }

        this.displayErrors(errors);
        return isValid;
    }

    displayErrors(errors) {
        // Clear all previous errors
        document.querySelectorAll('.input-error').forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
        });

        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error');
        });

        // Display new errors
        Object.keys(errors).forEach(type => {
            const errorElement = document.getElementById(`error-${type}`);
            if (errorElement) {
                errorElement.textContent = errors[type];
                errorElement.classList.add('show');
                
                // Add error class to input
                const form = document.getElementById(`form-${type}`);
                if (form) {
                    const input = form.querySelector('.form-control');
                    if (input) {
                        input.classList.add('error');
                    }
                }
            }
        });
    }

    clearErrors() {
        document.querySelectorAll('.input-error').forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
        });

        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error');
        });
    }

    getQRData() {
        switch (this.currentType) {
            case 'url':
                const url = document.getElementById('input-url')?.value.trim() || '';
                // Add https:// if no protocol is present
                if (url && !url.match(/^https?:\/\//i)) {
                    return `https://${url}`;
                }
                return url;

            case 'text':
                return document.getElementById('input-text')?.value.trim() || '';

            case 'wifi':
                const ssid = document.getElementById('wifi-ssid')?.value.trim() || '';
                const password = document.getElementById('wifi-password')?.value.trim() || '';
                const security = document.getElementById('wifi-security')?.value || 'WPA';
                
                // WiFi QR format: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
                return `WIFI:T:${security};S:${ssid};P:${password};H:false;;`;

            case 'email':
                const email = document.getElementById('email-address')?.value.trim() || '';
                const subject = document.getElementById('email-subject')?.value.trim() || '';
                const body = document.getElementById('email-body')?.value.trim() || '';
                
                let mailtoUrl = `mailto:${email}`;
                const params = [];
                if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
                if (body) params.push(`body=${encodeURIComponent(body)}`);
                if (params.length > 0) mailtoUrl += `?${params.join('&')}`;
                
                return mailtoUrl;

            case 'sms':
                const phone = document.getElementById('sms-phone')?.value.trim() || '';
                const message = document.getElementById('sms-message')?.value.trim() || '';
                
                if (message) {
                    return `sms:${phone}?body=${encodeURIComponent(message)}`;
                }
                return `sms:${phone}`;

            default:
                return '';
        }
    }

    async generateQRCode() {
        if (!this.validateInput()) {
            this.hideQRCode();
            return;
        }

        const data = this.getQRData();
        if (!data) {
            this.hideQRCode();
            return;
        }

        this.showLoading();

        try {
            // Small delay to show loading animation
            await new Promise(resolve => setTimeout(resolve, 200));

            const container = document.getElementById('qrcode');
            if (!container) {
                throw new Error('QR code container not found');
            }
            
            container.innerHTML = '';

            this.qrCode = new QRCode(container, {
                text: data,
                width: this.settings.size,
                height: this.settings.size,
                colorDark: this.settings.foregroundColor,
                colorLight: this.settings.backgroundColor,
                correctLevel: QRCode.CorrectLevel[this.settings.errorCorrectionLevel]
            });

            this.hideLoading();
            this.showDownloadSection();
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.hideLoading();
            this.showToast('Error generating QR code', 'error');
        }
    }

    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        const qrContainer = document.getElementById('qrcode');
        
        if (spinner) spinner.style.display = 'flex';
        if (qrContainer) qrContainer.style.display = 'none';
    }

    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        const qrContainer = document.getElementById('qrcode');
        
        if (spinner) spinner.style.display = 'none';
        if (qrContainer) qrContainer.style.display = 'flex';
    }

    hideQRCode() {
        const qrContainer = document.getElementById('qrcode');
        if (qrContainer) {
            qrContainer.innerHTML = `
                <div class="qr-placeholder">
                    <div class="qr-icon">📱</div>
                    <p>Enter data to generate QR code</p>
                </div>
            `;
        }
        this.hideDownloadSection();
    }

    showDownloadSection() {
        const downloadSection = document.getElementById('downloadSection');
        if (downloadSection) {
            downloadSection.classList.add('active');
        }
    }

    hideDownloadSection() {
        const downloadSection = document.getElementById('downloadSection');
        if (downloadSection) {
            downloadSection.classList.remove('active');
        }
    }

    downloadQR() {
        if (!this.qrCode) {
            this.showToast('Please generate a QR code first', 'error');
            return;
        }

        try {
            const canvas = document.querySelector('#qrcode canvas');
            if (!canvas) {
                this.showToast('QR code not found', 'error');
                return;
            }

            const link = document.createElement('a');
            link.download = `qr-code-${this.currentType}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showToast('QR code downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading QR code:', error);
            this.showToast('Error downloading QR code', 'error');
        }
    }

    async copyQRToClipboard() {
        if (!this.qrCode) {
            this.showToast('Please generate a QR code first', 'error');
            return;
        }

        try {
            const canvas = document.querySelector('#qrcode canvas');
            if (!canvas) {
                this.showToast('QR code not found', 'error');
                return;
            }

            if (navigator.clipboard && window.ClipboardItem) {
                canvas.toBlob(async (blob) => {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        this.showToast('QR code copied to clipboard!', 'success');
                    } catch (error) {
                        console.error('Error copying to clipboard:', error);
                        this.showToast('Unable to copy to clipboard', 'error');
                    }
                });
            } else {
                this.showToast('Clipboard not supported on this browser', 'warning');
            }
        } catch (error) {
            console.error('Error copying QR code:', error);
            this.showToast('Error copying QR code', 'error');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        if (toastIcon) toastIcon.textContent = icons[type] || icons.info;
        if (toastMessage) toastMessage.textContent = message;
        
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('qr-generator-settings');
            if (saved) {
                const parsedSettings = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsedSettings };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }

        // Apply settings to UI
        const foregroundColor = document.getElementById('foregroundColor');
        const backgroundColor = document.getElementById('backgroundColor');
        const qrSize = document.getElementById('qrSize');
        const errorLevel = document.getElementById('errorLevel');

        if (foregroundColor) foregroundColor.value = this.settings.foregroundColor;
        if (backgroundColor) backgroundColor.value = this.settings.backgroundColor;
        if (qrSize) qrSize.value = this.settings.size;
        if (errorLevel) errorLevel.value = this.settings.errorCorrectionLevel;
    }

    saveSettings() {
        try {
            localStorage.setItem('qr-generator-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    isValidURL(string) {
        try {
            new URL(string.startsWith('http') ? string : `https://${string}`);
            return true;
        } catch (_) {
            return false;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application
let qrApp;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    console.log('DOM ready, initializing app...');
    qrApp = new QRGeneratorPro();
    window.qrApp = qrApp; // Make globally accessible for debugging
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (qrApp && e.state && e.state.type) {
        qrApp.switchTab(e.state.type);
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('App is online');
});

window.addEventListener('offline', () => {
    console.log('App is offline');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRGeneratorPro;
}