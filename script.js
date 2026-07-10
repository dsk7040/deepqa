document.addEventListener('DOMContentLoaded', () => {

  // ==================== Header Scroll Effect ====================
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initially in case of reload page scrolled


  // ==================== Mobile Navigation Toggle ====================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      mobileNavToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileNavToggle.classList.remove('active');
      }
    });

    // Close mobile nav when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileNavToggle.classList.remove('active');
      });
    });
  }


  // ==================== Scroll Spy active nav link ====================
  const sections = document.querySelectorAll('section');
  const scrollSpy = () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120; // offset header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Initial call


  // ==================== Parallax Mouse Animation ====================
  const parallaxElements = document.querySelectorAll('.parallax-element');
  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate percentage offset from center (-1 to 1)
    const percentX = (mouseX - windowWidth / 2) / (windowWidth / 2);
    const percentY = (mouseY - windowHeight / 2) / (windowHeight / 2);

    parallaxElements.forEach(element => {
      const depth = parseFloat(element.getAttribute('data-depth')) || 0.05;
      const moveX = percentX * depth * 90; // movement bounds in pixels
      const moveY = percentY * depth * 90;
      element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });


  // ==================== FAQ Accordion Interactivity ====================
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isAlreadyActive = item.classList.contains('active');

      // Close all other accordions first
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });

      // Toggle current accordion
      if (isAlreadyActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Open first accordion item by default
  const firstAccordion = document.querySelector('.accordion-item');
  if (firstAccordion) {
    firstAccordion.classList.add('active');
    const firstContent = firstAccordion.querySelector('.accordion-content');
    firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
  }

  // ==================== Pricing Switcher Toggle ====================
  const billingToggleBtn = document.getElementById('billingToggleBtn');
  const priceValues = document.querySelectorAll('.price-value');
  const billingSubtitles = document.querySelectorAll('.billing-subtitle');
  const switcherLabels = document.querySelectorAll('.switcher-label');

  if (billingToggleBtn) {
    billingToggleBtn.addEventListener('click', () => {
      const isYearly = billingToggleBtn.classList.toggle('active');
      
      // Toggle active classes on text labels
      switcherLabels.forEach(label => label.classList.toggle('active'));

      priceValues.forEach(price => {
        const monthlyPrice = price.getAttribute('data-monthly');
        const yearlyPrice = price.getAttribute('data-yearly');
        
        if (isYearly) {
          price.textContent = yearlyPrice;
        } else {
          price.textContent = monthlyPrice;
        }
      });

      billingSubtitles.forEach(subtitle => {
        if (isYearly) {
          subtitle.textContent = 'Billed annually';
        } else {
          subtitle.textContent = 'Billed monthly';
        }
      });
    });
  }


  // ==================== Statistics Counter Animation ====================
  const statsSection = document.querySelector('.stats-row');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animationTriggered = false;

  // Initialize stats to 0 with suffix immediately if JS is running
  if (statNumbers.length > 0) {
    statNumbers.forEach(stat => {
      const suffix = stat.getAttribute('data-suffix') || '';
      stat.textContent = '0' + suffix;
    });
  }

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds smooth animation
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing out quadratic for professional decelleration
        const easeOutQuad = progress * (2 - progress);
        const currentValue = Math.floor(easeOutQuad * target);

        stat.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  if ('IntersectionObserver' in window && statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationTriggered) {
          animateCounters();
          animationTriggered = true;
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    });

    observer.observe(statsSection);
  } else {
    // Fallback if IntersectionObserver not supported
    animateCounters();
  }


  // ==================== Back to Top Button ====================
  const backToTopBtn = document.getElementById('backToTop');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ==================== Testimonial Carousel Auto-slide ====================
  const carousel = document.getElementById('testimonialsCarousel');
  const dots = document.querySelectorAll('.carousel-dot');
  const cards = document.querySelectorAll('.testimonial-card');
  let activeIndex = 0;
  let autoSlideInterval = null;
  let isPaused = false;
  const slideSpeed = 5000; // 5 seconds
  
  if (carousel && dots.length > 0) {
    const slideCount = dots.length;

    const slideTo = (index) => {
      activeIndex = index;
      carousel.style.transform = `translateX(-${activeIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        if (!isPaused) {
          let nextIndex = (activeIndex + 1) % slideCount;
          slideTo(nextIndex);
        }
      }, slideSpeed);
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    };

    // Hover hold functionality on testimonial cards
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        isPaused = true;
      });

      card.addEventListener('mouseleave', () => {
        isPaused = false;
        // Reset timer when mouse leaves to give full duration
        startAutoSlide();
      });

      card.addEventListener('click', () => {
        isPaused = true;
      });
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        slideTo(idx);
        isPaused = false;
        startAutoSlide();
      });
    });

    // Start sliding initially
    startAutoSlide();
  }

  // ==================== Premium WebGL Fluid Simulation Backgrounds ====================
  const initFluidSimulation = () => {
    if (window.FluidSimulation && window.THREE) {
      const heroCanvas = document.getElementById('fluid-canvas');
      if (heroCanvas) {
        new window.FluidSimulation(heroCanvas, heroCanvas.parentElement, {
          simResolution: 256,
          densityDissipation: 0.995, // Soft, long lasting smoke
          velocityDissipation: 0.990, // Smooth organic swirling inertia
          curlStrength: 38.0, // High confinement forces for nice swirling detail
          pressureIterations: 24, // Volumetric projection quality
          splatForce: 1500.0,
          colorPalette: [
            new THREE.Color('#00E5FF'), // Bright Cyan
            new THREE.Color('#0088FF'), // Bright Blue
            new THREE.Color('#9b6dff'), // Amethyst Purple
            new THREE.Color('#2dd4a8'), // Emerald Green
            new THREE.Color('#e8b840')  // Gold
          ]
        });
      }

      const contactCanvas = document.getElementById('contact-canvas');
      if (contactCanvas) {
        new window.FluidSimulation(contactCanvas, contactCanvas.parentElement, {
          simResolution: 192, // slightly smaller resolution for contact section to be lighter
          densityDissipation: 0.992,
          velocityDissipation: 0.985,
          curlStrength: 30.0,
          pressureIterations: 20,
          splatForce: 1200.0,
          colorPalette: [
            new THREE.Color('#00E5FF'),
            new THREE.Color('#9b6dff'),
            new THREE.Color('#0088FF')
          ]
        });
      }
    } else {
      console.log('FluidSimulation or THREE class is not loaded on window.');
    }
  };

  initFluidSimulation();

});
