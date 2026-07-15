function initUnleashAnimations() {
  // Clear any existing ScrollTriggers on re-init to prevent bugs
  const triggers = ScrollTrigger.getAll();
  triggers.forEach(trigger => {
    if (trigger.trigger && (trigger.trigger.id === 'unleash45-page' || trigger.trigger.closest('#unleash45-page'))) {
      trigger.kill();
    }
  });

  // --- TEXT REVEAL UTILITIES ---
  const wordReveals = document.querySelectorAll('#unleash45-page .word-reveal');
  wordReveals.forEach(el => {
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

  const lineReveals = document.querySelectorAll('#unleash45-page .line-reveal');
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

  const textReveals = document.querySelectorAll('#unleash45-page .text-reveal');
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

  // --- BIOMECHANICAL DEADLIFT SVG ENGINE ---

  // Joint state configurations (cx, cy)
  const stateStanding = {
    kneeX: 270, kneeY: 420,
    hipX: 250, hipY: 310,
    shoulderX: 230, shoulderY: 190,
    headX: 220, headY: 140,
    elbowX: 240, elbowY: 240,
    handX: 250, handY: 310,
    barY: 500,
    kneeAngle: 110, hipAngle: 65,
    quadGlow: 0.1, hamGlow: 0.1, backGlow: 0.1, trapGlow: 0.1
  };

  const stateSetup = {
    kneeX: 310, kneeY: 440,
    hipX: 240, hipY: 380,
    shoulderX: 215, shoulderY: 270,
    headX: 200, headY: 230,
    elbowX: 218, elbowY: 335,
    handX: 220, handY: 400,
    barY: 400,
    kneeAngle: 90, hipAngle: 45,
    quadGlow: 0.4, hamGlow: 0.5, backGlow: 0.4, trapGlow: 0.1
  };

  const statePull = {
    kneeX: 285, kneeY: 410,
    hipX: 230, hipY: 330,
    shoulderX: 205, shoulderY: 200,
    headX: 195, headY: 150,
    elbowX: 212, elbowY: 260,
    handX: 220, handY: 320,
    barY: 320,
    kneeAngle: 140, hipAngle: 95,
    quadGlow: 0.8, hamGlow: 0.9, backGlow: 0.8, trapGlow: 0.5
  };

  const stateLockout = {
    kneeX: 260, kneeY: 410,
    hipX: 250, hipY: 305,
    shoulderX: 250, shoulderY: 175,
    headX: 250, headY: 125,
    elbowX: 250, elbowY: 240,
    handX: 250, handY: 305,
    barY: 305,
    kneeAngle: 175, hipAngle: 165,
    quadGlow: 0.3, hamGlow: 0.5, backGlow: 0.4, trapGlow: 0.9
  };

  // Helper selectors
  const setAttr = (id, attr, val) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
  };

  const setLine = (id, x1, y1, x2, y2) => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('x1', x1);
      el.setAttribute('y1', y1);
      el.setAttribute('x2', x2);
      el.setAttribute('y2', y2);
    }
  };

  const setMuscle = (id, opacity, x1, y1, x2, y2) => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('x1', x1);
      el.setAttribute('y1', y1);
      el.setAttribute('x2', x2);
      el.setAttribute('y2', y2);
      el.style.opacity = opacity;
      if (opacity > 0.6) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  };

  // Render coords into SVG structure
  function renderBiomechanicalAthlete(coords) {
    // Joints
    setAttr('joint-knee', 'cx', coords.kneeX);
    setAttr('joint-knee', 'cy', coords.kneeY);
    setAttr('joint-hip', 'cx', coords.hipX);
    setAttr('joint-hip', 'cy', coords.hipY);
    setAttr('joint-shoulder', 'cx', coords.shoulderX);
    setAttr('joint-shoulder', 'cy', coords.shoulderY);
    setAttr('joint-head', 'cx', coords.headX);
    setAttr('joint-head', 'cy', coords.headY);
    setAttr('joint-elbow', 'cx', coords.elbowX);
    setAttr('joint-elbow', 'cy', coords.elbowY);
    setAttr('joint-hand', 'cx', coords.handX);
    setAttr('joint-hand', 'cy', coords.handY);

    // Bones
    setLine('bone-shin', 260, 500, coords.kneeX, coords.kneeY);
    setLine('bone-thigh', coords.kneeX, coords.kneeY, coords.hipX, coords.hipY);
    setLine('bone-spine', coords.hipX, coords.hipY, coords.shoulderX, coords.shoulderY);
    setLine('bone-neck', coords.shoulderX, coords.shoulderY, coords.headX, coords.headY);
    setLine('bone-uarm', coords.shoulderX, coords.shoulderY, coords.elbowX, coords.elbowY);
    setLine('bone-farm', coords.elbowX, coords.elbowY, coords.handX, coords.handY);

    // Barbell
    setAttr('barbell-shaft', 'y1', coords.barY);
    setAttr('barbell-shaft', 'y2', coords.barY);

    const platesL = document.getElementById('barbell-plates-l');
    const platesR = document.getElementById('barbell-plates-r');
    if (platesL && platesR) {
      const deltaY = coords.barY - 390; // Relative to default SVG 390
      gsap.set(platesL, { y: deltaY });
      gsap.set(platesR, { y: deltaY });
    }

    // Muscle glows
    setMuscle('muscle-quads', coords.quadGlow, coords.kneeX, coords.kneeY, coords.hipX, coords.hipY);
    setMuscle('muscle-hamstrings', coords.hamGlow, 260, 500, coords.kneeX, coords.kneeY);
    setMuscle('muscle-back', coords.backGlow, coords.hipX, coords.hipY, coords.shoulderX, coords.shoulderY);
    setMuscle('muscle-traps', coords.trapGlow, coords.shoulderX, coords.shoulderY, coords.headX, coords.headY);

    // Dynamic text
    const kneeText = document.getElementById('angle-knee-text');
    const hipText = document.getElementById('angle-hip-text');
    if (kneeText) kneeText.textContent = `KNEE: ${Math.round(coords.kneeAngle)}°`;
    if (hipText) hipText.textContent = `HIP: ${Math.round(coords.hipAngle)}°`;

    const loadText = document.getElementById('muscle-load-text');
    if (loadText) {
      if (coords.backGlow > 0.7 || coords.hamGlow > 0.7) {
        loadText.textContent = "PEAK POSTERIOR DRIVE ACTIVATED";
        loadText.style.fill = "#B6FF00";
      } else if (coords.trapGlow > 0.8) {
        loadText.textContent = "LOCKOUT COMPLETION DETECTED";
        loadText.style.fill = "#B6FF00";
      } else if (coords.quadGlow > 0.3) {
        loadText.textContent = "PRE-TENSION INITIATED";
        loadText.style.fill = "#8c8c8c";
      } else {
        loadText.textContent = "BIOMECHANICAL STANDBY STATUS";
        loadText.style.fill = "#8c8c8c";
      }
    }
  }

  // Set initial coordinates
  const animationObj = { ...stateStanding };
  renderBiomechanicalAthlete(animationObj);

  // Scroll Trigger deadlift timeline
  const liftTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#unleash45-page',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2
    }
  });

  // Make deadlift SVG scale/fade in cleanly at the start
  const deadlifterSvg = document.getElementById('biomechanic-deadlifter');
  if (deadlifterSvg) {
    gsap.set(deadlifterSvg, { opacity: 0.1, scale: 0.95 });
    gsap.to(deadlifterSvg, {
      opacity: 0.35,
      scale: 1,
      scrollTrigger: {
        trigger: '#unleash45-page section',
        start: 'top 80%',
        end: 'top 20%',
        scrub: true
      }
    });
  }

  // Interpolation phases (Standing -> Grip -> Pull -> Lockout -> Standing)
  liftTimeline
    // 1. Standing to Setup (Grip Barbell)
    .to(animationObj, {
      ...stateSetup,
      duration: 2.5,
      ease: 'sine.inOut',
      onUpdate: () => renderBiomechanicalAthlete(animationObj)
    })
    // 2. Setup to Pull (Mid lift)
    .to(animationObj, {
      ...statePull,
      duration: 3,
      ease: 'sine.inOut',
      onUpdate: () => renderBiomechanicalAthlete(animationObj)
    })
    // 3. Pull to Lockout
    .to(animationObj, {
      ...stateLockout,
      duration: 2.5,
      ease: 'power1.out',
      onUpdate: () => renderBiomechanicalAthlete(animationObj)
    })
    // Hold Lockout phase
    .to(animationObj, {
      duration: 1.5,
      onUpdate: () => renderBiomechanicalAthlete(animationObj)
    })
    // 4. Return to Stand
    .to(animationObj, {
      ...stateStanding,
      duration: 2.5,
      ease: 'sine.inOut',
      onUpdate: () => renderBiomechanicalAthlete(animationObj)
    });


  // --- 8-WEEK TIMELINE INTERACTIVE CONNECTOR ---
  const timelineIndicator = document.getElementById('timeline-indicator');
  if (timelineIndicator) {
    gsap.fromTo(timelineIndicator, 
      { height: '0%' },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-wrapper',
          start: 'top 25%',
          end: 'bottom 75%',
          scrub: true
        }
      }
    );
  }

  // Active status triggers
  const timelineItems = document.querySelectorAll('#unleash45-page .timeline-item');
  timelineItems.forEach(item => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => item.classList.add('active'),
      onLeaveBack: () => item.classList.remove('active')
    });
  });

  // Accordion week hover expand
  const timelineContents = document.querySelectorAll('#unleash45-page .timeline-content');
  timelineContents.forEach(content => {
    content.addEventListener('mouseenter', () => {
      timelineContents.forEach(c => c.classList.remove('expanded'));
      content.classList.add('expanded');
    });
  });


  // --- FLOATING COMMUNITY CARDS PARALLAX ---
  const communityCards = document.querySelectorAll('#unleash45-page .floating-card');
  const floatWrapper = document.getElementById('community-float-wrapper');
  
  if (communityCards.length > 0 && floatWrapper) {
    // Parallax on Scroll
    communityCards.forEach(card => {
      const speed = parseFloat(card.getAttribute('data-speed')) || 1.2;
      gsap.fromTo(card,
        { y: 80 },
        {
          y: speed * -80,
          ease: 'none',
          scrollTrigger: {
            trigger: floatWrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });

    // Parallax on Mousemove (Subtle depth overlay)
    const handleMouseParallax = (e) => {
      // Don't apply mouse parallax on mobile
      if (window.innerWidth < 1024) return;

      const xc = window.innerWidth / 2;
      const yc = window.innerHeight / 2;
      const x = (e.clientX - xc) / xc;
      const y = (e.clientY - yc) / yc;

      communityCards.forEach(card => {
        const speed = parseFloat(card.getAttribute('data-speed')) || 1.2;
        gsap.to(card, {
          x: x * speed * 25,
          y: y * speed * 25,
          overwrite: 'auto',
          duration: 1.2,
          ease: 'power2.out'
        });
      });
    };

    window.addEventListener('mousemove', handleMouseParallax);
  }

  // Update cursor hover states for newly generated elements
  if (window.updateCursorHoverEvents) window.updateCursorHoverEvents();
}

// Bind to window for router execution
window.initUnleashAnimations = initUnleashAnimations;
