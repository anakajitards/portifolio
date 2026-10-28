/**
 * PORTFÓLIO EDITORIAL — INTERAÇÕES VISUAIS
 * JavaScript puro (Vanilla JS), sem dependências externas
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. RELÓGIO EDITORIAL EM TEMPO REAL (FUSO HORÁRIO LOCAL / BRASIL)
  // ------------------------------------------------------------------------
  const localTimeEl = document.getElementById('localTime');

  function updateClock() {
    if (!localTimeEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    localTimeEl.textContent = `BR — ${hours}:${minutes}:${seconds}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ------------------------------------------------------------------------
  // 2. HEADER DINÂMICO AO ROLAR A PÁGINA
  // ------------------------------------------------------------------------
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 3. MENU MOBILE DRAWER (ABERTURA / FECHAMENTO ACESSÍVEL)
  // ------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openMenu);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeMenu);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });

  // ------------------------------------------------------------------------
  // 4. SCROLL SUAVE PARA LINKS ÂNCORA COM COMPENSAÇÃO DE HEADER
  // ------------------------------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 12);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ------------------------------------------------------------------------
  // 5. OBSERVER PARA ATIVAR O LINK DO MENU CONFORME A SEÇÃO VISÍVEL
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(sec => navObserver.observe(sec));

  // ------------------------------------------------------------------------
  // 6. FILTRO DA GALERIA DE PROJETOS
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove a classe ativa de todos e adiciona no clicado
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 7. COPIAR E-MAIL COM 1 CLIQUE & FEEDBACK VISUAL
  // ------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const emailLink = document.getElementById('emailLink');

  if (copyEmailBtn && emailLink) {
    copyEmailBtn.addEventListener('click', async () => {
      const emailToCopy = emailLink.textContent.trim();

      try {
        await navigator.clipboard.writeText(emailToCopy);
        copyEmailBtn.classList.add('copied');
        copyBtnText.textContent = 'E-mail Copiado! ✓';

        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          copyBtnText.textContent = 'Copiar E-mail';
        }, 2500);
      } catch (err) {
        // Fallback em caso de restrição de permissão de clipboard
        const tempInput = document.createElement('input');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        copyEmailBtn.classList.add('copied');
        copyBtnText.textContent = 'E-mail Copiado! ✓';
        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          copyBtnText.textContent = 'Copiar E-mail';
        }, 2500);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. ANIMAÇÃO SUAVE DE ENTRADA AO ROLAR (SCROLL REVEAL)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.hero-info-grid, .about-grid, .projects-editorial-grid, .contact-main-grid');

  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

});
