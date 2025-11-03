// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenuDesktop = document.getElementById('nav-menu-desktop');
const navMenuMobile = document.getElementById('nav-menu-mobile');
const navOverlay = document.getElementById('nav-overlay');
const header = document.getElementById('header');
const contactForm = document.getElementById('contact-form');

// Links de navegação (desktop e mobile)
const navLinksDesktop = document.querySelectorAll('.nav__list--desktop .nav__link');
const navLinksMobile = document.querySelectorAll('.nav__list--mobile .nav__link');
const allNavLinks = [...navLinksDesktop, ...navLinksMobile];

// Menu State Module
const MenuState = {
  isOpen: false,
  lastFocusedElement: null,

  open() {
    if (!this.isOpen) {
      this.lastFocusedElement = document.activeElement;

      // Adicionar atributos ARIA
      navToggle.setAttribute('aria-expanded', 'true');
      navMenuMobile.setAttribute('aria-hidden', 'false');

      // Mostrar menu e overlay
      navMenuMobile.classList.add('show');
      navOverlay.classList.add('show');

      // Prevenir scroll do body
      document.body.style.overflow = 'hidden';

      // Não focar em link específico para evitar seleção visual incorreta
      // O foco permanecerá no botão toggle para melhor acessibilidade

      this.isOpen = true;
    }
  },

  close() {
    if (this.isOpen) {
      // Remover atributos ARIA
      navToggle.setAttribute('aria-expanded', 'false');
      navMenuMobile.setAttribute('aria-hidden', 'true');

      // Esconder menu e overlay
      navMenuMobile.classList.remove('show');
      navOverlay.classList.remove('show');

      // Restaurar scroll do body
      document.body.style.overflow = '';

      // Restaurar foco
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }

      this.isOpen = false;
    }
  },

  toggle() {
    if (MenuState.isOpen) {
      MenuState.close();
    } else {
      MenuState.open();
    }
  }
};

// Accessibility Module
const Accessibility = {
  trapFocus(e) {
    if (!MenuState.isOpen) return;

    const focusableElements = navMenuMobile.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    // ESC fecha o menu
    if (e.key === 'Escape') {
      MenuState.close();
    }
  }
};

// Scroll Handler Module
const ScrollHandler = {
  throttledUpdateActiveLink: null,

  init() {
    // Throttle otimizado para mobile (50ms para melhor resposta)
    this.throttledUpdateActiveLink = this.throttle(this.updateActiveLink.bind(this), 50);
    window.addEventListener('scroll', this.throttledUpdateActiveLink);
  },

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Função de sincronização desktop/mobile
  syncActiveLinks(sectionId) {
    // Remover classe active de todos os links (desktop e mobile)
    allNavLinks.forEach(link => {
      link.classList.remove('active-link');
    });

    // Encontrar e adicionar classe active no link desktop
    let desktopLink = null;
    for (let link of navLinksDesktop) {
      if (link.getAttribute('href') === `#${sectionId}`) {
        desktopLink = link;
        desktopLink.classList.add('active-link');
        break;
      }
    }

    // Encontrar e adicionar classe active no link mobile
    let mobileLink = null;
    for (let link of navLinksMobile) {
      if (link.getAttribute('href') === `#${sectionId}`) {
        mobileLink = link;
        mobileLink.classList.add('active-link');
        break;
      }
    }
  },

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    let activeSectionId = null;

    // Encontrar seção ativa
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        activeSectionId = sectionId;
      }
    });

    // Se encontrou seção ativa, sincronizar links
    if (activeSectionId) {
      this.syncActiveLinks(activeSectionId);
    }
  }
};

// Navigation Events Module
const NavigationEvents = {
  init() {
    // Toggle menu
    if (navToggle) {
      navToggle.addEventListener('click', MenuState.toggle);
    }

    // Close menu
    if (navClose) {
      navClose.addEventListener('click', MenuState.close);
    }

    // Overlay fecha o menu ao clicar
    if (navOverlay) {
      navOverlay.addEventListener('click', MenuState.close);
    }

    // Fechar menu ao clicar em um link mobile
    navLinksMobile.forEach(link => {
      link.addEventListener('click', (e) => {
        if (MenuState.isOpen) {
          MenuState.close();
          // Permitir navegação após um pequeno delay para o menu fechar
          setTimeout(() => {
            window.location.hash = link.getAttribute('href');
          }, 300);
          e.preventDefault();
        }
      });
    });

    // Focus trap
    document.addEventListener('keydown', Accessibility.trapFocus);
  }
};

// Header effects
function handleHeaderScroll() {
  if (window.scrollY > 100) {
    header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  NavigationEvents.init();
  ScrollHandler.init();

  // Header scroll effect
  window.addEventListener('scroll', handleHeaderScroll);

  // Smooth scroll para links de navegação
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#') && targetId !== '#') {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Scroll animations
  window.addEventListener('scroll', animateOnScroll);

  // Initialize animations on load
  animateOnScroll();

  // Track page view
  console.log('Event: page_view', {
    page: window.location.pathname,
    title: document.title
  });

  // Track button clicks
  const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
  whatsappButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Event: whatsapp_click', {
        location: 'inline'
      });
    });
  });

  // Track form submissions
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      console.log('Event: form_submit', {
        form: 'contact'
      });
    });
  }
});

// Legacy variables para compatibilidade (remover após migração completa)
let isMenuOpen = false;

// Scroll animations
function animateOnScroll() {
  const elements = document.querySelectorAll('.fade-in-up');

  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('visible');
    }
  });
}

// Form submission
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Adicionar estado de loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando...';

    // Simular envio (substituir com integração real)
    setTimeout(() => {
      // Preparar mensagem para WhatsApp
      const name = formData.get('name');
      const phone = formData.get('phone');
      const email = formData.get('email');
      const message = formData.get('message');

      const whatsappMessage = `*Nova solicitação de orçamento*\n\n` +
                             `*Nome:* ${name}\n` +
                             `*Telefone:* ${phone}\n` +
                             `*E-mail:* ${email}\n` +
                             `*Mensagem:* ${message}`;

      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;

      // Resetar formulário
      contactForm.reset();
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Mensagem';

      // Redirecionar para WhatsApp
      window.open(whatsappUrl, '_blank');

      // Mostrar mensagem de sucesso
      showNotification('Mensagem enviada com sucesso! Redirecionando para WhatsApp...');
    }, 2000);
  });
}

// Sistema de notificações
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Adicionar estilos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'var(--primary-color)' : 'var(--accent-color)'};
    color: white;
    padding: 16px 24px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    font-weight: 500;
  `;

  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Máscara para telefone
function applyPhoneMask(input) {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    }

    e.target.value = value;
  });
}

// Inicializar máscaras
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  applyPhoneMask(phoneInput);
}

// Validação de formulário
function validateForm() {
  const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      showError(input, 'Este campo é obrigatório');
    } else {
      clearError(input);
    }

    // Validação específica para e-mail
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        showError(input, 'Digite um e-mail válido');
      }
    }

    // Validação específica para telefone
    if (input.id === 'phone') {
      const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
      if (!phoneRegex.test(input.value)) {
        isValid = false;
        showError(input, 'Digite um telefone válido');
      }
    }
  });

  return isValid;
}

function showError(input, message) {
  const formGroup = input.closest('.contact__form-group');
  const existingError = formGroup.querySelector('.error-message');

  if (!existingError) {
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: var(--accent-color);
      font-size: 0.875rem;
      margin-top: 4px;
      display: block;
    `;

    formGroup.appendChild(errorElement);
    input.style.borderColor = 'var(--accent-color)';
  }
}

function clearError(input) {
  const formGroup = input.closest('.contact__form-group');
  const existingError = formGroup.querySelector('.error-message');

  if (existingError) {
    formGroup.removeChild(existingError);
  }

  input.style.borderColor = '';
}

// Lazy loading para imagens (quando implementado)
function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Performance: Debounce para scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.addEventListener('load', () => {
  // Adicionar classes de animação
  const animateElements = document.querySelectorAll('.benefit__card, .process__step, .contact__form-wrapper');
  animateElements.forEach(element => {
    element.classList.add('fade-in-up');
  });

  // Inicializar animações
  animateOnScroll();
  setupLazyLoading();

  // Definir link ativo inicial baseado na posição atual
  ScrollHandler.throttledUpdateActiveLink();
});

// Prevenção de spam no formulário
let formSubmitTime = 0;
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - formSubmitTime;

    if (timeDiff < 5000) {
      e.preventDefault();
      showNotification('Por favor, aguarde alguns segundos antes de enviar novamente.', 'error');
      return;
    }

    formSubmitTime = currentTime;
  });
}

// Trackeamento de analytics (quando implementado)
function trackEvent(eventName, properties = {}) {
  // Substituir com implementação real (Google Analytics, etc.)
  console.log('Event:', eventName, properties);
}


// Touch gestures para mobile (implementação básica)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - fechar menu
      if (MenuState.isOpen) {
        MenuState.close();
      }
    } else {
      // Swipe right - abrir menu
      if (!MenuState.isOpen) {
        MenuState.open();
      }
    }
  }
}

console.log('🌱 ReciclaMais - Site carregado com sucesso!');