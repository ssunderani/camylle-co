document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Configuration (Dark/Light Toggle)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleIcon = document.getElementById('themeToggleIcon');

  function updateThemeUI(isDark) {
    if (isDark) {
      themeToggleIcon.textContent = 'light_mode';
      themeToggleBtn.setAttribute('title', 'Toggle light theme');
    } else {
      themeToggleIcon.textContent = 'dark_mode';
      themeToggleBtn.setAttribute('title', 'Toggle dark theme');
    }
  }

  // Set initial icon based on classes
  const isInitialDark = document.documentElement.classList.contains('dark');
  updateThemeUI(isInitialDark);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);
    showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled', 'info');
  });

  // ==========================================
  // 2. Mobile Drawer Navigation Menu
  // ==========================================
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-links a, #mob-cta-contact');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scroll under drawer
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuToggleBtn.addEventListener('click', openDrawer);
  closeDrawerBtn.addEventListener('click', closeDrawer);
  mobileOverlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================
  // 3. Smooth Scrolling & Active Navigation Links Highlight
  // ==========================================
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  // Handle smooth scroll clicks for desktop & mobile links
  const allScrollLinks = document.querySelectorAll('a[href^="#"]');
  allScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Adjust for sticky header height
        const offsetPosition = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Highlight active link based on scroll position using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px', // Trigger when section covers mid portion
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // ==========================================
  // 4. Floating Action Button (Scroll to Top)
  // ==========================================
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================
  // 5. Wholesaler Interactive Cards (Accordion Detail Trigger)
  // ==========================================
  const wholesalerCards = document.querySelectorAll('.wholesaler-card');

  wholesalerCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Toggle card active class
      const isActive = card.classList.contains('active');
      
      // Close other active cards for accordion style
      wholesalerCards.forEach(c => c.classList.remove('active'));
      
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });

  // ==========================================
  // 6. Interactive History Milestone Modal
  // ==========================================
  const heroCtaHistory = document.getElementById('hero-cta-history');
  const historyModalOverlay = document.getElementById('historyModalOverlay');
  const closeModalBtn = document.getElementById('closeModalBtn');

  function openModal() {
    historyModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    historyModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  heroCtaHistory.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  historyModalOverlay.addEventListener('click', (e) => {
    if (e.target === historyModalOverlay) {
      closeModal();
    }
  });
  
  // Close on ESC key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && historyModalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // ==========================================
  // 7. Brand Directory - Filter & Search Logic
  // ==========================================
  const brandSearchInput = document.getElementById('brandSearchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const brandCards = document.querySelectorAll('.brand-card');
  const brandTickerItems = document.querySelectorAll('.brand-logo-item');

  let currentCategory = 'all';
  let searchQuery = '';

  function filterBrands() {
    brandCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardName = card.querySelector('.brand-card-name').textContent.toLowerCase();
      const cardDesc = card.querySelector('.brand-card-desc').textContent.toLowerCase();
      const cardOrigin = card.querySelector('.brand-card-origin').textContent.toLowerCase();
      
      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesSearch = cardName.includes(searchQuery) || 
                            cardDesc.includes(searchQuery) || 
                            cardOrigin.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      }
    });
  }

  // Filter tag clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      filterBrands();
    });
  });

  // Real-time search inputs
  brandSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterBrands();
  });

  // Make Brand marquee items click-to-filter brand catalog
  brandTickerItems.forEach(item => {
    item.addEventListener('click', () => {
      const brandKey = item.getAttribute('data-brand');
      let displayName = item.textContent.trim();
      
      // Special check for Britain Gummy
      if (brandKey === 'britain_gummy') displayName = 'Britain Gummy';
      if (brandKey === 'sapsucker') displayName = 'Sap Sucker';

      brandSearchInput.value = displayName;
      searchQuery = displayName.toLowerCase();
      
      // Reset categories to "All"
      filterBtns.forEach(b => b.classList.remove('active'));
      document.getElementById('filter-all').classList.add('active');
      currentCategory = 'all';
      
      filterBrands();
      
      // Scroll smoothly down to the directory controls
      const controlsOffset = document.querySelector('.directory-controls').offsetTop - 100;
      window.scrollTo({
        top: controlsOffset,
        behavior: 'smooth'
      });
      
      showToast(`Filtering brand directory: ${displayName}`, 'info');
    });
  });

  // ==========================================
  // 8. Form Validation & Toast System
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const submitFormBtn = document.getElementById('submitFormBtn');
  const toastContainer = document.getElementById('toastContainer');

  // Input listeners to remove error classes when user edits the text
  const formInputs = contactForm.querySelectorAll('.form-control');
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) {
        input.classList.remove('invalid');
      }
    });
  });

  // Validation function
  function validateForm() {
    let isValid = true;
    
    formInputs.forEach(input => {
      // Required check
      if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('invalid');
        isValid = false;
      }
      
      // Email format check
      if (input.getAttribute('type') === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          input.classList.add('invalid');
          isValid = false;
        }
      }
    });
    
    return isValid;
  }

  // Custom Toast notification launcher
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    
    let iconName = 'check_circle';
    if (type === 'error') iconName = 'error';
    if (type === 'info') iconName = 'info';
    
    toast.innerHTML = `
      <span class="material-symbols-outlined toast-icon">${iconName}</span>
      <span class="toast-text">${message}</span>
      <button class="toast-close" aria-label="Dismiss message">
        <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
      </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto dismiss after 4 seconds
    const dismissTimer = setTimeout(() => {
      dismissToast(toast);
    }, 4000);
    
    // Dismiss button click handler
    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(dismissTimer);
      dismissToast(toast);
    });
  }

  function dismissToast(toast) {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }

  // Handle Form Submit
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fill out all required fields correctly.', 'error');
      return;
    }
    
    // Show Loading/Submitting state
    const originalBtnText = submitFormBtn.textContent;
    submitFormBtn.textContent = 'Submitting...';
    submitFormBtn.setAttribute('disabled', 'true');
    submitFormBtn.style.opacity = '0.7';
    
    // Simulate API request delay
    setTimeout(() => {
      // Success feedback
      showToast(`Thank you, ${document.getElementById('firstName').value}! Your message has been sent successfully.`);
      
      // Reset form controls & button state
      contactForm.reset();
      submitFormBtn.textContent = originalBtnText;
      submitFormBtn.removeAttribute('disabled');
      submitFormBtn.style.opacity = '';
    }, 1500);
  });
});
