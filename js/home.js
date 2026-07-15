function initHomeAnimations() {
  // Clear any existing ScrollTriggers on re-init to prevent bugs
  const triggers = ScrollTrigger.getAll();
  triggers.forEach(trigger => {
    // Only kill triggers associated with the home page
    if (trigger.trigger && (trigger.trigger.id === 'hero-section' || trigger.trigger.closest('#home-page'))) {
      trigger.kill();
    }
  });

  // --- TEXT REVEAL UTILITIES ---
  
  // Word Reveal Animation (Slide Up)
  const wordReveals = document.querySelectorAll('#home-page .word-reveal');
  wordReveals.forEach(el => {
    // Avoid double splitting
    if (el.querySelector('.word-wrapper')) return;
    
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = words.map(word => 
      `<span class="word-wrapper" style="display:inline-block; overflow:hidden; vertical-align:top;">
        <span class="word-inner" style="display:inline-block; transform:translateY(100%); will-change:transform;">${word}&nbsp;</span>
      </span>`
    ).join(' ');

    gsap.to(el.querySelectorAll('.word-inner'), {
      y: '0%',
      duration: 1.2,
      stagger: 0.04,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Line/Paragraph Reveal (Fade In + Slide Up)
  const lineReveals = document.querySelectorAll('#home-page .line-reveal');
  lineReveals.forEach(el => {
    gsap.fromTo(el, 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Button & Card Reveal (Fade In + Slide Up)
  const textReveals = document.querySelectorAll('#home-page .text-reveal');
  textReveals.forEach(el => {
    gsap.fromTo(el, 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // --- PORTRAIT HERO 3D VIRTUAL CAMERA SEQUENCER ---
  const coachImage = document.getElementById('hero-coach-image');
  const heroSec = document.getElementById('hero-section');
  const scrollIndicator = document.getElementById('hero-scroll-indicator');
  const subjectLayer = document.getElementById('hero-subject-layer');
  const cameraBg = document.getElementById('hero-camera-bg');
  const foregroundLayer = document.getElementById('hero-foreground-layer');
  const spotlight = document.getElementById('hero-spotlight-layer');
  const heartbeatOverlay = document.getElementById('heartbeat-overlay');

  if (heroSec && coachImage && subjectLayer) {
    // 1. Initial 3D placement configurations
    // Subject far away, full body visible, neutral serious, spotlight faint
    gsap.set(subjectLayer, { transformPerspective: 1200, force3D: true });
    gsap.set(subjectLayer, { x: 0, y: 30, z: -350, rotateY: 0, opacity: 0 }); // will fade in on load
    gsap.set(coachImage, { filter: 'brightness(0.9) contrast(1)' });
    gsap.set(cameraBg, { z: -500, x: 0, y: 0 });
    gsap.set(foregroundLayer, { z: 100, x: 0 });
    gsap.set(spotlight, { opacity: 0.15, scale: 0.85 });
    gsap.set(heartbeatOverlay, { opacity: 0 });
    gsap.set('.story-scene', { opacity: 0 });
    gsap.set('#scene-1', { opacity: 0 }); // Will trigger fade in on load
    
    // Slow fade-in reveal of Rithwik standing in darkness on load
    gsap.to(subjectLayer, { opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.4 });
    gsap.to('#scene-1', { opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.8 });

    // 2. Continuous Scroll-Driven 3D Motorized Camera Sequence
    const cameraTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroSec,
        start: 'top top',
        end: '+=4000px', // Pinned viewport duration
        end: '+=4500px', // Extended scroll range for elegant pacing
        pin: true,
        scrub: 2.0, // Increased scrub inertia for cinematic glide
        invalidateOnRefresh: true
      }
    });

    // We animate strictly GPU-accelerated translate3d (x, y, z), rotateY, and opacity
    // Every stage overlaps by 30-50% with the next, maintaining continuous motion
    cameraTimeline
      // ==========================================
      // SCENE 2: Dolly Forward & Intro Fade Out
      // ==========================================
      .to(subjectLayer, {
        z: -200,
        y: 40,
        x: 0,
        rotateY: 0,
        duration: 1.8,
        ease: 'sine.inOut'
      }, 0)
      .to(cameraBg, {
        z: -420,
        duration: 1.8,
        ease: 'sine.inOut'
      }, 0)
      .to(spotlight, {
        opacity: 0.28,
        scale: 1.0,
        duration: 1.8,
        ease: 'sine.inOut'
      }, 0)
      .to('#scene-1', { 
        opacity: 0, 
        duration: 0.05, // Gone almost instantly on scroll start
        ease: 'power1.out' 
      }, 0)
      .to(scrollIndicator, { 
        opacity: 0, 
        duration: 0.6 
      }, 0)

      // ==========================================
      // SCENE 3: Orbit Left & Parallax Depth (Overlaps Scene 2)
      // ==========================================
      .to(subjectLayer, {
        z: -50,
        x: -80,
        rotateY: 12,
        y: 60,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 1.2) // Starts before Scene 2 dolly finishes
      .to(cameraBg, {
        z: -350,
        x: 100, // Moves in opposite direction for parallax
        duration: 2.0,
        ease: 'sine.inOut'
      }, 1.2)
      .to(foregroundLayer, {
        x: -150, // Slides faster for foreground depth
        duration: 2.0,
        ease: 'sine.inOut'
      }, 1.2)

      // ==========================================
      // SCENE 4: Waist Level (Overlaps Scene 3)
      // ==========================================
      .to(subjectLayer, {
        z: 120,
        y: -180,
        x: -100,
        rotateY: 6,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 2.5) // Smooth handover of coordinates
      .to(cameraBg, {
        z: -260,
        x: 60,
        y: -40,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 2.5)
      .to(foregroundLayer, {
        x: -200,
        y: -60,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 2.5)
      .to('#scene-4', { 
        opacity: 1, 
        duration: 0.5, 
        ease: 'sine.out' 
      }, 3.1)
      .to('#scene-4', { 
        opacity: 0, 
        duration: 0.5, 
        ease: 'sine.in' 
      }, 4.2)

      // ==========================================
      // SCENE 5: Chest Level (Overlaps Scene 4)
      // ==========================================
      .to(subjectLayer, {
        z: 320,
        y: -40,
        x: -40,
        rotateY: -4,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 3.8)
      .to(cameraBg, {
        z: -200,
        x: 30,
        y: -20,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 3.8)
      .to(spotlight, {
        opacity: 0.38,
        scale: 1.15,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 3.8)
      .to('#scene-5', { 
        opacity: 1, 
        duration: 0.5, 
        ease: 'sine.out' 
      }, 4.4)
      .to('#scene-5', { 
        opacity: 0, 
        duration: 0.5, 
        ease: 'sine.in' 
      }, 5.5)

      // ==========================================
      // SCENE 6: Shoulder Level (Overlaps Scene 5)
      // ==========================================
      .to(subjectLayer, {
        z: 460,
        y: 40,
        x: 20,
        rotateY: -8,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 5.1)
      .to(cameraBg, {
        z: -150,
        x: -20,
        y: 0,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 5.1)
      .to(spotlight, {
        opacity: 0.45,
        scale: 0.7,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 5.1)
      .to('#scene-6', { 
        opacity: 1, 
        duration: 0.5, 
        ease: 'sine.out' 
      }, 5.7)
      .to('#scene-6', { 
        opacity: 0, 
        duration: 0.5, 
        ease: 'sine.in' 
      }, 6.8)

      // ==========================================
      // SCENE 7: Face Close-Up (Overlaps Scene 6)
      // ==========================================
      .to(subjectLayer, {
        z: 680,
        y: 180,
        x: 80,
        rotateY: -2,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 6.4)
      .to(cameraBg, {
        z: -100,
        x: -50,
        y: 50,
        duration: 2.0,
        ease: 'sine.inOut'
      }, 6.4)
      .to('#scene-7', { 
        opacity: 1, 
        duration: 0.5, 
        ease: 'sine.out' 
      }, 7.0)
      .to('#scene-7', { 
        opacity: 0, 
        duration: 0.5, 
        ease: 'sine.in' 
      }, 8.1)

      // ==========================================
      // SCENE 8: Pull Back & Layout Alignment (Overlaps Scene 7)
      // ==========================================
      .to(subjectLayer, {
        z: 150,
        y: 80,
        x: -180,
        rotateY: 0,
        duration: 2.2,
        ease: 'power2.inOut'
      }, 7.8)
      .to(cameraBg, {
        z: -300,
        x: 0,
        y: 0,
        duration: 2.2,
        ease: 'power2.inOut'
      }, 7.8)
      .to(spotlight, {
        opacity: 0.25,
        scale: 1.0,
        duration: 2.2,
        ease: 'power2.inOut'
      }, 7.8)
      .to(scrollIndicator, { 
        opacity: 1, 
        duration: 0.5 
      }, 8.8);
  }

  // --- STATS COUNTERS ---
  const stats = document.querySelectorAll('#home-page .stat-number');
  stats.forEach(stat => {
    const targetVal = parseInt(stat.getAttribute('data-count'), 10);
    let suffix = '';
    if (targetVal === 1000) suffix = '+';
    else if (targetVal === 45) suffix = 'MIN';
    else if (targetVal === 8) suffix = 'WEEKS';
    else if (targetVal === 98) suffix = '%';

    gsap.fromTo(stat, 
      { textContent: 0 },
      {
        textContent: targetVal,
        duration: 2,
        ease: 'power3.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: stat,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        onUpdate: function() {
          const val = Math.ceil(this.targets()[0].textContent);
          if (suffix) {
            stat.innerHTML = `${val}<span class="stat-unit">${suffix}</span>`;
          } else {
            stat.innerHTML = val;
          }
        }
      }
    );
  });

  // --- HORIZONTAL METHODOLOGY SCROLL ---
  const track = document.getElementById('methodology-track');
  const methodologySec = document.getElementById('methodology-section');
  
  if (track && methodologySec) {
    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const windowWidth = window.innerWidth;
      return -(trackWidth - windowWidth + (windowWidth * 0.1));
    };

    gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: methodologySec,
        pin: true,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }

  // --- 3D TILT EFFECT FOR METHODOLOGY CARDS ---
  const tiltCards = document.querySelectorAll('#home-page .tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const tiltX = (yc - y) / 15; // Max tilt angle
      const tiltY = (x - xc) / 15;

      gsap.to(card, {
        rotationX: tiltX,
        rotationY: tiltY,
        scale: 1.02,
        ease: 'power2.out',
        duration: 0.3,
        transformPerspective: 1000
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        ease: 'power2.out',
        duration: 0.5
      });
    });
  });

  // Update cursor hover states for newly generated elements
  if (window.updateCursorHoverEvents) window.updateCursorHoverEvents();
}

// Bind to window for router execution
window.initHomeAnimations = initHomeAnimations;
