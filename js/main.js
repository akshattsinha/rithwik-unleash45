document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // --- LENIS SMOOTH SCROLLING ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Bind ScrollTrigger to Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Make lenis globally accessible
  window.lenis = lenis;

  // --- CUSTOM CURSOR ---
  const dot = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');
  const cursorText = document.getElementById('cursor-text');

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Cursor inertia and speed stretch calculations
  let lastX = 0, lastY = 0;
  let velocity = 0;

  gsap.ticker.add(() => {
    // Lerp positions
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    gsap.set(dot, { x: dotX, y: dotY });

    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    const dx = mouseX - lastX;
    const dy = mouseY - lastY;
    velocity = Math.sqrt(dx * dx + dy * dy);

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const stretchX = Math.min(1 + velocity * 0.03, 1.8);
    const stretchY = Math.max(1 - velocity * 0.015, 0.5);

    // Apply cursor state checks
    if (
      glow.classList.contains('cursor-hovering-glow') || 
      glow.classList.contains('cursor-view-state') || 
      glow.classList.contains('cursor-scroll-state')
    ) {
      gsap.set(glow, { x: glowX, y: glowY, scaleX: 1, scaleY: 1, rotation: 0 });
    } else {
      gsap.set(glow, { x: glowX, y: glowY, scaleX: stretchX, scaleY: stretchY, rotation: angle });
    }

    lastX = mouseX;
    lastY = mouseY;
  });

  // Cursor Hover Listeners
  function updateCursorHoverEvents() {
    // Normal Hover
    const hoverElements = document.querySelectorAll('a, button, .magnetic, .timeline-content, .unleash-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => glow.classList.add('cursor-hovering-glow'));
      el.addEventListener('mouseleave', () => glow.classList.remove('cursor-hovering-glow'));
    });

    // View States (Images, Videos)
    const viewElements = document.querySelectorAll('.hover-reveal-view, .hover-reveal-img');
    viewElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorText.textContent = 'VIEW';
        glow.classList.add('cursor-view-state');
      });
      el.addEventListener('mouseleave', () => {
        glow.classList.remove('cursor-view-state');
      });
    });

    // Scroll States (Hero sections)
    const scrollElements = document.querySelectorAll('.hero-sec, .unleash-hero');
    scrollElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorText.textContent = 'SCROLL';
        glow.classList.add('cursor-scroll-state');
      });
      el.addEventListener('mouseleave', () => {
        glow.classList.remove('cursor-scroll-state');
      });
    });
  }

  updateCursorHoverEvents();
  window.updateCursorHoverEvents = updateCursorHoverEvents;

  // --- MAGNETIC EFFECT ---
  function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });

        // Pull cursor dot slightly to the button center
        const pullX = rect.left + rect.width / 2;
        const pullY = rect.top + rect.height / 2;
        dotX += (pullX - dotX) * 0.1;
        dotY += (pullY - dotY) * 0.1;
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1.1, 0.4)'
        });
      });
    });
  }
  initMagneticButtons();
  window.initMagneticButtons = initMagneticButtons;

  // --- CANVAS AMBIENT PARTICLES ---
  const canvas = document.getElementById('ambient-particles-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: Math.random() * 0.2 - 0.1,
      speedY: Math.random() * -0.5 - 0.1,
      opacity: Math.random() * 0.4 + 0.1
    });
  }

  let lastMouseX = 0, lastMouseY = 0;
  window.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;

      // Wrap around screen boundaries
      if (p.y < 0) {
        p.y = canvas.height;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < 0 || p.x > canvas.width) {
        p.x = Math.random() * canvas.width;
      }

      // Mouse influence (slight push away)
      const dx = p.x - lastMouseX;
      const dy = p.y - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        p.x += (dx / dist) * force * 1.2;
        p.y += (dy / dist) * force * 1.2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(182, 255, 0, ${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- LOADING SCREEN TIMELINE ---
  lenis.stop(); // Stop scroll during load

  const loaderTimeline = gsap.timeline({
    onComplete: () => {
      // Open Doors
      gsap.timeline({
        onComplete: () => {
          document.getElementById('loader').style.display = 'none';
          lenis.start();
          
          // Trigger first page animations
          const currentHash = window.location.hash || '#/';
          if (currentHash === '#/unleash45') {
            if (window.initUnleashAnimations) window.initUnleashAnimations();
          } else {
            if (window.initHomeAnimations) window.initHomeAnimations();
          }
        }
      })
      .to('#loader-panel-top', { y: '-100%', duration: 1.2, ease: 'expo.inOut' })
      .to('#loader-panel-bottom', { y: '100%', duration: 1.2, ease: 'expo.inOut' }, '-=1.2')
      .to('#loader-logo', { scale: 1.2, opacity: 0, duration: 0.5, ease: 'power2.in' }, '-=1.2')
      .to('#loader-barbell', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'power2.in' }, '-=1.2')
      .fromTo('header', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    }
  });

  // Setup path drawing variables
  const path = document.getElementById('loader-path');
  const pathLength = path.getTotalLength();
  gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

  // 1. Draw ECG Line
  loaderTimeline.to(path, {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: 'power2.inOut'
  });

  // 2. ECG morphs into Barbell shaft & Plates slide in
  loaderTimeline.addLabel('morph')
    .to(path, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 'morph')
    .to('#loader-barbell', { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 'morph')
    
    // Slide plates in
    .fromTo('#loader-plates-left', { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.1)' }, 'morph+=0.2')
    .fromTo('#loader-plates-right', { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.1)' }, 'morph+=0.2')
    
    // Barbell shakes slightly when plates lock
    .to('#loader-barbell', {
      x: 3,
      y: -2,
      rotation: 1,
      duration: 0.05,
      yoyo: true,
      repeat: 5,
      ease: 'bounce.out'
    }, 'morph+=0.75')
    .to('#loader-barbell', { x: 0, y: 0, rotation: 0, duration: 0.1 }, 'morph+=1')

    // Unleash Logo reveals
    .to('#loader-logo', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }, 'morph+=1.1');


  // --- CINEMATIC PAGE TRANSITIONS (SPA ROTATION) ---
  let isTransitioning = false;

  function handleRoute(hash) {
    if (isTransitioning) return;
    isTransitioning = true;
    lenis.stop();

    const prevPage = document.querySelector('.page-view.active');
    let targetPageId = 'home-page';
    let activeNavData = 'home';

    if (hash === '#/unleash45') {
      targetPageId = 'unleash45-page';
      activeNavData = 'unleash45';
    }

    const nextPage = document.getElementById(targetPageId);
    if (prevPage === nextPage) {
      isTransitioning = false;
      lenis.start();
      return;
    }

    // Update Header Navigation States
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === hash || (hash === '' && href === '#/') || (hash === '#/' && href === '#/')) {
        link.classList.add('active');
      }
    });

    // Update Footer Navigation States
    document.querySelectorAll('.footer-nav-link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === hash || (hash === '' && href === '#/') || (hash === '#/' && href === '#/')) {
        link.classList.add('active');
      }
    });

    const overlay = document.getElementById('transition-overlay');
    const transitionLogo = document.getElementById('transition-logo');

    // Page Transition Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Swap views
        prevPage.classList.remove('active');
        nextPage.classList.add('active');

        // Scroll to top instantly
        lenis.scrollTo(0, { immediate: true });
        
        // Refresh ScrollTrigger calculations
        ScrollTrigger.refresh();

        // Trigger page-specific animations
        if (targetPageId === 'unleash45-page') {
          if (window.initUnleashAnimations) window.initUnleashAnimations();
        } else {
          if (window.initHomeAnimations) window.initHomeAnimations();
        }

        // Animate overlay out
        gsap.timeline({
          onComplete: () => {
            isTransitioning = false;
            lenis.start();
            // Reset overlay for next time
            gsap.set(overlay, { y: '100%' });
          }
        })
        .to(transitionLogo, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in' })
        .to(overlay, { y: '-100%', duration: 0.8, ease: 'power4.inOut' })
        .fromTo(nextPage, 
          { scale: 0.95, filter: 'blur(10px)', opacity: 0 }, 
          { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.8, ease: 'power4.out', clearProps: 'all' }, 
          '-=0.6'
        );
      }
    });

    // Slide overlay up, zoom out old page
    tl.to(overlay, { y: '0%', duration: 0.8, ease: 'power4.inOut' })
      .to(prevPage, { scale: 0.95, filter: 'blur(10px)', opacity: 0, duration: 0.6, ease: 'power3.inOut' }, '-=0.8')
      .to(transitionLogo, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2');
  }

  // Monitor URL Hash Changes
  window.addEventListener('hashchange', () => {
    handleRoute(window.location.hash);
  });

  // Handle header scroll link behavior
  document.querySelectorAll('.nav-link[data-scroll], .footer-nav-link[data-scroll]').forEach(link => {
    link.addEventListener('click', (e) => {
      const scrollId = link.getAttribute('data-scroll');
      const hash = link.getAttribute('href');
      
      // If we are already on Home, prevent hash routing transition and just scroll to the section
      if (document.getElementById('home-page').classList.contains('active')) {
        e.preventDefault();
        const targetElement = document.getElementById(scrollId);
        if (targetElement) {
          lenis.scrollTo(targetElement, { offset: -90 });
        }
      }
    });
  });

  // Spotlight dynamic follow mouse (subtle depth)
  const spotlight = document.getElementById('ambient-spotlight');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 50;
    const y = (e.clientY / window.innerHeight - 0.5) * 50;
    gsap.to(spotlight, {
      x: x,
      y: y,
      duration: 1.5,
      ease: 'power1.out'
    });
  });

  // --- PLAY VIDEO LIGHTBOX FUNCTION ---
  const playTrigger = document.getElementById('play-video-trigger');
  const lightbox = document.getElementById('video-lightbox');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const iframeContainer = document.getElementById('video-iframe-container');

  if (playTrigger) {
    playTrigger.addEventListener('click', () => {
      const videoId = playTrigger.getAttribute('data-video-id');
      // Create iframe dynamically to optimize load
      iframeContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      lightbox.classList.add('active');
      lenis.stop();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      iframeContainer.innerHTML = '';
      lenis.start();
    });
  }

  // Close lightbox on clicking outside content
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        iframeContainer.innerHTML = '';
        lenis.start();
      }
    });
  }
});
