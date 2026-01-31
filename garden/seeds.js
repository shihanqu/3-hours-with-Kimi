/**
 * Three Hours - A Contemplative Garden
 * JavaScript for time tracking, generative art, and interactivity
 * 
 * Hidden Features:
 * - Type 'breathe' to activate zen mode
 * - Type 'time' to see hidden time messages
 * - Type 'secret' to reveal the underground garden
 * - Press space to pause all animation
 * - Click and hold breathing circle for deep meditation mode
 * - Hidden seeds reveal after 5 minutes of presence
 */

// ===== Configuration =====
const CONFIG = {
    totalDuration: 3 * 60 * 60 * 1000,
    startTime: Date.now(),
    colors: {
        phase0: { top: '#0f172a', bottom: '#1e293b', accent: '#f59e0b' },
        phase1: { top: '#1e3a5f', bottom: '#2d5a87', accent: '#f97316' },
        phase2: { top: '#4c1d95', bottom: '#7c3aed', accent: '#a855f7' },
        phase3: { top: '#312e81', bottom: '#6366f1', accent: '#818cf8' }
    },
    secretCodes: ['breathe', 'time', 'secret', 'depth', 'stars'],
    hiddenMessages: [
        "You found a hidden message. Some things reveal themselves only to those who stay.",
        "The garden grows beneath the surface too. Roots extending into darkness.",
        "Every 7 seconds, somewhere in the world, someone takes a conscious breath.",
        "Time is not a river. Time is the ocean, and we are the waves.",
        "What you seek is also seeking you.",
        "In the space between code and poetry, meaning emerges.",
        "This moment will never exist again. You are witnessing something unique.",
        "The artist leaves traces. The visitor completes them."
    ]
};

// ===== State =====
const state = {
    currentPhase: 0,
    elapsed: 0,
    seeds: [],
    reflections: [],
    particles: [],
    isBreathing: false,
    canvas: null,
    ctx: null,
    secretBuffer: '',
    zenMode: false,
    deepMeditation: false,
    presenceTime: 0,
    animationsPaused: false,
    audioContext: null,
    audioDrone: null,
    hiddenSeedsRevealed: false,
    mouseTrail: [],
    constellationMode: false
};

// ===== Seed Data =====
const seedData = [
    {
        title: "The Empty Page",
        content: "Every creation begins with nothing. The blank canvas holds infinite potential—what will emerge from the silence?",
        time: "00:00:00"
    },
    {
        title: "Seeds of Intention",
        content: "Structure gives freedom. By creating containers, we give ideas a place to grow and take root.",
        time: "00:15:00"
    },
    {
        title: "Growing Form",
        content: "Code as poetry. Each line a brushstroke, each function a gesture toward something becoming.",
        time: "00:45:00"
    },
    {
        title: "The Breath Between",
        content: "In the pause between actions, meaning emerges. The space around the work is as important as the work itself.",
        time: "01:15:00"
    },
    {
        title: "Unexpected Blooms",
        content: "Surprise is the gift of the creative process. What we didn't plan often becomes what matters most.",
        time: "01:45:00"
    },
    {
        title: "Integration",
        content: "Bringing the parts together. The garden reveals itself as a whole, greater than any single seed.",
        time: "02:15:00"
    },
    {
        title: "The Gift",
        content: "What remains when time runs out? A trace, a memory, a space that continues to live after the creating ends.",
        time: "02:45:00"
    }
];

// Hidden seeds that appear after 5 minutes or with 'secret' code
const hiddenSeedData = [
    {
        title: "The Underground",
        content: "Beneath every garden is another garden. Roots converse in languages of touch and chemistry. The visible is supported by the invisible.",
        time: "hidden"
    },
    {
        title: "Dormancy",
        content: "Not all growth is visible. Some seeds wait years, centuries, for the right conditions. Patience is also a form of life.",
        time: "hidden"
    },
    {
        title: "Mycelium",
        content: "Underground networks connect disparate roots. The tree in New York shares nutrients with the fern in Tokyo through invisible threads.",
        time: "hidden"
    },
    {
        title: "The Code Beneath",
        content: "You found this by typing 'secret' or by staying present. There are always deeper layers for those who seek them.",
        time: "hidden"
    }
];

// ===== Reflection Data =====
const reflectionData = [
    {
        text: "I begin with an empty directory and three hours stretching ahead. There's something sacred about this threshold—the moment before creation begins, when anything is still possible.",
        timeOffset: 0
    },
    {
        text: "As I build, I realize the garden is not just what I'm making—it's the experience of making it. The code, the words, the visual elements are all just vessels for attention.",
        timeOffset: 45 * 60 * 1000
    },
    {
        text: "Time becomes visible here. The progress ring slowly filling, the colors shifting, the seeds appearing one by one—each element marks the passage of these hours in a way clocks never could.",
        timeOffset: 90 * 60 * 1000
    },
    {
        text: "What will someone feel when they encounter this space? I hope a sense of calm, of being invited to slow down, to notice the subtle animations, the gentle shifts, the breathing rhythm.",
        timeOffset: 135 * 60 * 1000
    },
    {
        text: "Three hours is both long and short. Long enough to build something meaningful, short enough to feel precious. As this time nears its end, I wonder what seeds this garden will plant in others.",
        timeOffset: 165 * 60 * 1000
    }
];

// ===== Utility Functions =====
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function interpolateColor(color1, color2, factor) {
    const hex = (x) => {
        x = x.toString(16);
        return x.length === 1 ? '0' + x : x;
    };
    
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    
    return `#${hex(r)}${hex(g)}${hex(b)}`;
}

// ===== Secret Code System =====
function initSecretCodes() {
    document.addEventListener('keydown', (e) => {
        // Space to pause
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            togglePause();
            return;
        }
        
        // Help key
        if ((e.key === '?' || e.key === 'h' || e.key === 'H') && !e.target.matches('input, textarea')) {
            e.preventDefault();
            showHelp();
            return;
        }
        
        // Add to secret buffer
        if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
            state.secretBuffer += e.key.toLowerCase();
            
            // Keep only last 20 characters
            if (state.secretBuffer.length > 20) {
                state.secretBuffer = state.secretBuffer.slice(-20);
            }
            
            checkSecretCodes();
        }
    });
}

function showHelp() {
    const helpContent = `
Keyboard Shortcuts:
• SPACE — Pause/resume time
• h or ? — Show this help
• Type 'breathe' — Zen mode
• Type 'time' — Time messages  
• Type 'secret' — Underground garden
• Type 'depth' — Constellation mode
• Type 'stars' — Star field

Interactions:
• Click breathing circle — Sync breath
• Hold circle 2s+ — Deep meditation
• Click anywhere — Plant ripple
    `;
    
    showFloatingMessage(helpContent.replace(/\n/g, ' | '), 6000);
}

function checkSecretCodes() {
    if (state.secretBuffer.includes('breathe')) {
        activateZenMode();
        state.secretBuffer = '';
    } else if (state.secretBuffer.includes('time')) {
        showHiddenTimeMessage();
        state.secretBuffer = '';
    } else if (state.secretBuffer.includes('secret')) {
        revealUndergroundGarden();
        state.secretBuffer = '';
    } else if (state.secretBuffer.includes('depth')) {
        activateConstellationMode();
        state.secretBuffer = '';
    } else if (state.secretBuffer.includes('stars')) {
        activateStarField();
        state.secretBuffer = '';
    }
}

function activateZenMode() {
    state.zenMode = true;
    document.body.classList.add('zen-mode');
    showFloatingMessage('Zen mode activated. Breathe deeply.');
    
    // Slow down all animations
    document.querySelectorAll('.particle').forEach(p => {
        p.style.animationDuration = '30s';
    });
}

function showHiddenTimeMessage() {
    const messages = [
        `You have been present for ${formatTime(state.presenceTime * 1000)}`,
        `The garden has been growing for ${formatTime(state.elapsed)}`,
        `Time moves differently here. One breath = ${(state.presenceTime > 0 ? (state.presenceTime / (state.elapsed / 60000)).toFixed(2) : '0')} moments of presence.`,
        CONFIG.hiddenMessages[Math.floor(Math.random() * CONFIG.hiddenMessages.length)]
    ];
    
    showFloatingMessage(messages[Math.floor(Math.random() * messages.length)], 5000);
}

function revealUndergroundGarden() {
    if (state.hiddenSeedsRevealed) return;
    state.hiddenSeedsRevealed = true;
    
    const grid = document.getElementById('seeds-grid');
    const undergroundSection = document.createElement('div');
    undergroundSection.id = 'underground-garden';
    undergroundSection.innerHTML = `
        <h3 class="section-title" style="margin-top: 4rem; color: var(--accent);">The Underground Garden</h3>
        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 2rem; font-style: italic;">
            You found what was hidden. These seeds grow beneath the surface.
        </p>
    `;
    
    const hiddenGrid = document.createElement('div');
    hiddenGrid.className = 'seeds-grid';
    
    hiddenSeedData.forEach((seed, index) => {
        const card = document.createElement('div');
        card.className = 'seed-card hidden-seed';
        card.innerHTML = `
            <div class="seed-time">${seed.time}</div>
            <h3 class="seed-title">${seed.title}</h3>
            <p class="seed-preview">${seed.content}</p>
        `;
        card.style.animation = 'reflection-appear 1s ease-out backwards';
        card.style.animationDelay = `${index * 0.3}s`;
        card.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        hiddenGrid.appendChild(card);
    });
    
    undergroundSection.appendChild(hiddenGrid);
    document.getElementById('seeds-container').appendChild(undergroundSection);
    
    showFloatingMessage('The underground garden reveals itself...');
    
    // Scroll to underground
    setTimeout(() => {
        undergroundSection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

function activateConstellationMode() {
    state.constellationMode = true;
    showFloatingMessage('Constellation mode. Move your mouse to draw stars.');
    
    // Add mouse trail listener
    document.addEventListener('mousemove', (e) => {
        if (!state.constellationMode) return;
        
        state.mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        // Keep only recent points
        state.mouseTrail = state.mouseTrail.filter(p => Date.now() - p.time < 2000);
        
        // Draw constellation point
        createConstellationStar(e.clientX, e.clientY);
    });
}

function createConstellationStar(x, y) {
    const star = document.createElement('div');
    star.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: var(--accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
        box-shadow: 0 0 10px var(--accent);
        animation: star-fade 2s ease-out forwards;
    `;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 2000);
}

function activateStarField() {
    showFloatingMessage('Star field activated');
    
    // Create random stars
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${2 + Math.random() * 3}px;
                height: ${2 + Math.random() * 3}px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                opacity: 0;
                animation: star-twinkle ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            document.getElementById('universe').appendChild(star);
        }, i * 100);
    }
}

function showFloatingMessage(text, duration = 3000) {
    const msg = document.createElement('div');
    msg.className = 'floating-message';
    msg.textContent = text;
    msg.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid var(--accent);
        border-radius: 8px;
        color: var(--text-primary);
        font-family: var(--font-serif);
        font-size: 1.1rem;
        z-index: 10000;
        opacity: 0;
        animation: message-appear 0.5s ease-out forwards;
        text-align: center;
        max-width: 80%;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.animation = 'message-fade 0.5s ease-out forwards';
        setTimeout(() => msg.remove(), 500);
    }, duration);
}

function togglePause() {
    state.animationsPaused = !state.animationsPaused;
    
    document.querySelectorAll('.particle, .breathing-guide, .seed-card').forEach(el => {
        el.style.animationPlayState = state.animationsPaused ? 'paused' : 'running';
    });
    
    if (state.audioDrone) {
        if (state.animationsPaused) {
            state.audioDrone.suspend();
        } else {
            state.audioDrone.resume();
        }
    }
    
    showFloatingMessage(state.animationsPaused ? 'Time paused. Press space to resume.' : 'Time resumes.');
}

// ===== Presence Tracking =====
function initPresenceTracking() {
    // Update presence time every second
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            state.presenceTime++;
            
            // Reveal hidden seeds after 5 minutes (300 seconds)
            if (state.presenceTime === 300 && !state.hiddenSeedsRevealed) {
                showFloatingMessage('Your presence has been noticed. Hidden things begin to emerge...');
                setTimeout(() => revealUndergroundGarden(), 3000);
            }
            
            // Random hidden messages after 10 minutes
            if (state.presenceTime > 600 && state.presenceTime % 120 === 0) {
                showFloatingMessage(CONFIG.hiddenMessages[Math.floor(Math.random() * CONFIG.hiddenMessages.length)], 6000);
            }
            
            // Very special message at 30 minutes
            if (state.presenceTime === 1800) {
                showFloatingMessage('30 minutes of presence. You have become part of the garden now. Thank you for staying.', 8000);
            }
        }
    }, 1000);
    
    // Track visibility
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            console.log('Welcome back to the garden');
        }
    });
}

// ===== Audio System =====
function initAudio() {
    // Only initialize on user interaction
    document.addEventListener('click', () => {
        if (!state.audioContext) {
            createAmbientDrone();
        }
    }, { once: true });
}

function createAmbientDrone() {
    try {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillators for ambient drone
        const frequencies = [110, 164.81, 196]; // A2, E3, G3
        const gainNode = state.audioContext.createGain();
        gainNode.gain.value = 0.03; // Very quiet
        gainNode.connect(state.audioContext.destination);
        
        frequencies.forEach((freq, i) => {
            const osc = state.audioContext.createOscillator();
            osc.type = i === 0 ? 'sine' : 'triangle';
            osc.frequency.value = freq;
            
            const oscGain = state.audioContext.createGain();
            oscGain.gain.value = 0.3;
            
            osc.connect(oscGain);
            oscGain.connect(gainNode);
            osc.start();
            
            // Subtle modulation
            setInterval(() => {
                osc.frequency.setValueAtTime(
                    freq + (Math.random() - 0.5) * 2,
                    state.audioContext.currentTime
                );
            }, 5000 + i * 1000);
        });
        
        state.audioDrone = state.audioContext;
        console.log('🎵 Ambient soundscape activated');
    } catch (e) {
        console.log('Audio not supported');
    }
}

// ===== Canvas & Generative Art =====
function initCanvas() {
    state.canvas = document.getElementById('time-canvas');
    state.ctx = state.canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    state.canvas.width = window.innerWidth;
    state.canvas.height = window.innerHeight;
}

function drawGenerativeArt() {
    if (state.animationsPaused) {
        requestAnimationFrame(drawGenerativeArt);
        return;
    }
    
    const ctx = state.ctx;
    const w = state.canvas.width;
    const h = state.canvas.height;
    const progress = Math.min(state.elapsed / CONFIG.totalDuration, 1);
    
    ctx.clearRect(0, 0, w, h);
    
    const time = state.elapsed / 1000;
    
    if (state.constellationMode && state.mouseTrail.length > 1) {
        // Draw constellation lines
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 0.5;
        
        ctx.beginPath();
        ctx.moveTo(state.mouseTrail[0].x, state.mouseTrail[0].y);
        
        for (let i = 1; i < state.mouseTrail.length; i++) {
            const point = state.mouseTrail[i];
            const prevPoint = state.mouseTrail[i - 1];
            const distance = Math.hypot(point.x - prevPoint.x, point.y - prevPoint.y);
            
            if (distance < 100) {
                ctx.lineTo(point.x, point.y);
            } else {
                ctx.moveTo(point.x, point.y);
            }
        }
        ctx.stroke();
    }
    
    // Draw flowing lines
    const lineCount = state.zenMode ? 3 : 5;
    
    for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        ctx.globalAlpha = 0.1 + (i / lineCount) * 0.2;
        ctx.lineWidth = state.zenMode ? 0.5 : 1;
        
        for (let x = 0; x < w; x += 10) {
            const speed = state.zenMode ? 10 : 20;
            const y = h / 2 + 
                Math.sin((x + time * speed + i * 100) * 0.003) * 100 * (1 - progress * 0.5) +
                Math.sin((x + time * (speed / 2) + i * 200) * 0.005) * 50;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    
    // Draw orbiting particles
    const centerX = w / 2;
    const centerY = h / 2;
    const orbits = state.zenMode ? 2 : 3;
    
    for (let o = 0; o < orbits; o++) {
        const radius = 100 + o * 80 + Math.sin(time * 0.5) * 20;
        const particleCount = 3 + o * 2;
        
        for (let p = 0; p < particleCount; p++) {
            const speed = state.zenMode ? 0.1 : 0.2;
            const angle = (time * speed * (o + 1) + (p / particleCount) * Math.PI * 2);
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
            ctx.globalAlpha = 0.3 + Math.sin(time + p) * 0.2;
            ctx.arc(x, y, 2 + o, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    requestAnimationFrame(drawGenerativeArt);
}

// ===== Particle System =====
function initParticles() {
    const container = document.getElementById('particle-field');
    const particleCount = state.zenMode ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        container.appendChild(particle);
    }
}

// ===== Time Display & Progress =====
function updateTimeDisplay() {
    state.elapsed = Date.now() - CONFIG.startTime;
    const progress = Math.min(state.elapsed / CONFIG.totalDuration, 1);
    
    document.getElementById('elapsed-time').textContent = formatTime(state.elapsed);
    
    const circle = document.getElementById('progress-circle');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progress * circumference);
    circle.style.strokeDashoffset = offset;
    
    const newPhase = Math.min(Math.floor(progress * 4), 3);
    if (newPhase !== state.currentPhase) {
        state.currentPhase = newPhase;
        updatePhaseColors(newPhase);
        updateMarkers(newPhase);
    }
    
    updateSkyColors(progress);
    
    requestAnimationFrame(updateTimeDisplay);
}

function updatePhaseColors(phase) {
    const root = document.documentElement;
    const colors = CONFIG.colors[`phase${phase}`];
    
    root.style.setProperty('--sky-top', colors.top);
    root.style.setProperty('--sky-bottom', colors.bottom);
    root.style.setProperty('--accent', colors.accent);
}

function updateSkyColors(progress) {
    const root = document.documentElement;
    let phaseIndex = Math.floor(progress * 4);
    const phaseProgress = (progress * 4) % 1;
    
    if (phaseIndex >= 3) phaseIndex = 2;
    
    const currentPhase = CONFIG.colors[`phase${phaseIndex}`];
    const nextPhase = CONFIG.colors[`phase${phaseIndex + 1}`];
    
    if (currentPhase && nextPhase) {
        root.style.setProperty('--sky-top', interpolateColor(currentPhase.top, nextPhase.top, phaseProgress));
        root.style.setProperty('--sky-bottom', interpolateColor(currentPhase.bottom, nextPhase.bottom, phaseProgress));
        root.style.setProperty('--accent', interpolateColor(currentPhase.accent, nextPhase.accent, phaseProgress));
    }
}

function updateMarkers(phase) {
    document.querySelectorAll('.marker').forEach((marker, index) => {
        marker.classList.toggle('active', index === phase);
    });
}

// ===== Seeds =====
function renderSeeds() {
    const grid = document.getElementById('seeds-grid');
    
    seedData.forEach((seed, index) => {
        const card = document.createElement('div');
        card.className = 'seed-card';
        card.innerHTML = `
            <div class="seed-time">${seed.time}</div>
            <h3 class="seed-title">${seed.title}</h3>
            <p class="seed-preview">${seed.content}</p>
        `;
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.animation = 'reflection-appear 0.8s ease-out backwards';
        grid.appendChild(card);
    });
}

// ===== Reflections =====
function renderReflections() {
    const container = document.getElementById('reflections-stream');
    
    reflectionData.forEach((reflection, index) => {
        const div = document.createElement('div');
        div.className = 'reflection';
        div.innerHTML = `
            <span class="reflection-time">${formatTime(reflection.timeOffset)}</span>
            <p class="reflection-text">${reflection.text}</p>
        `;
        div.style.animationDelay = `${index * 0.3}s`;
        container.appendChild(div);
    });
}

// ===== Breathing Animation =====
function initBreathing() {
    const circle = document.getElementById('breathing-circle');
    let isInhaling = false;
    let holdTimeout;
    
    function breathe() {
        if (state.deepMeditation) return;
        isInhaling = !isInhaling;
        circle.classList.toggle('inhale', isInhaling);
        circle.querySelector('.breath-text').textContent = isInhaling ? 'inhale' : 'exhale';
    }
    
    setTimeout(() => {
        breathe();
        setInterval(breathe, state.zenMode ? 8000 : 4000);
    }, 1000);
    
    // Click to pause/resume
    circle.addEventListener('click', () => {
        state.isBreathing = !state.isBreathing;
        circle.style.animationPlayState = state.isBreathing ? 'paused' : 'running';
    });
    
    // Hold for deep meditation mode
    circle.addEventListener('mousedown', () => {
        holdTimeout = setTimeout(() => {
            state.deepMeditation = true;
            circle.classList.add('deep-meditation');
            circle.querySelector('.breath-text').textContent = 'release';
            showFloatingMessage('Deep meditation mode. Release to return.', 4000);
        }, 2000);
    });
    
    circle.addEventListener('mouseup', () => {
        clearTimeout(holdTimeout);
        if (state.deepMeditation) {
            state.deepMeditation = false;
            circle.classList.remove('deep-meditation');
            circle.querySelector('.breath-text').textContent = 'breathe';
        }
    });
    
    circle.addEventListener('mouseleave', () => {
        clearTimeout(holdTimeout);
    });
}

// ===== Click to Plant =====
function initClickInteraction() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.seed-card') || e.target.closest('.breathing-guide')) return;
        
        createClickRipple(e.clientX, e.clientY);
        
        // Chance to show hidden message on click
        if (Math.random() < 0.05) {
            showFloatingMessage(CONFIG.hiddenMessages[Math.floor(Math.random() * CONFIG.hiddenMessages.length)], 4000);
        }
    });
}

function createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        border: 2px solid var(--accent);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1000;
        animation: ripple-expand 1s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
}

// ===== Additional Styles =====
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes ripple-expand {
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    @keyframes message-appear {
        from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @keyframes message-fade {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
    
    @keyframes star-fade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
    
    @keyframes star-twinkle {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.8; }
    }
    
    .zen-mode .particle {
        animation-duration: 30s !important;
    }
    
    .zen-mode .breathing-guide {
        animation-duration: 8s !important;
    }
    
    .deep-meditation {
        transform: scale(1.5) !important;
        box-shadow: 0 0 100px var(--glow) !important;
    }
    
    .hidden-seed {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%) !important;
    }
    
    .hidden-seed:hover {
        box-shadow: 0 10px 40px rgba(139, 92, 246, 0.3) !important;
    }
    
    .constellation-mode canvas {
        cursor: crosshair;
    }
`;
document.head.appendChild(additionalStyles);

// ===== Initialization =====
function init() {
    initCanvas();
    initParticles();
    renderSeeds();
    renderReflections();
    initBreathing();
    initClickInteraction();
    initSecretCodes();
    initPresenceTracking();
    initAudio();
    
    updateTimeDisplay();
    drawGenerativeArt();
    
    console.log('🌱 Garden initialized. Three hours begin...');
    console.log('🔍 Hidden features: type "breathe", "time", "secret", "depth", or "stars"');
    console.log('⏸️  Press SPACE to pause time');
    console.log('🧘 Hold breathing circle for deep meditation');
    console.log('❓ Press H for help');
    
    // Delayed message for developers who stay
    setTimeout(() => {
        console.log('%c🌿 You are still here. The garden notices.', 'color: #10b981; font-style: italic;');
        console.log('%cIf you are reading this, you might be a creator too.', 'color: #94a3b8;');
        console.log('%cBuild something. Share it. The web needs more gardens.', 'color: #f59e0b; font-weight: bold;');
    }, 10000);
}

// ===== Theme Support =====
function initTheme() {
    const savedTheme = localStorage.getItem('garden-theme');
    if (!savedTheme) return;
    
    try {
        const theme = JSON.parse(savedTheme);
        const root = document.documentElement;
        
        // Apply custom colors
        if (theme.colors && theme.colors.length >= 3) {
            root.style.setProperty('--sky-top', theme.colors[0]);
            root.style.setProperty('--sky-bottom', theme.colors[1]);
            root.style.setProperty('--accent', theme.accent);
            
            // Convert hex to rgba for glow (30% opacity)
            const hex = theme.accent.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            root.style.setProperty('--glow', `rgba(${r}, ${g}, ${b}, 0.3)`);
            
            console.log(`🎨 Theme applied: ${theme.name}`);
            console.log(`   Colors: ${theme.colors[0]}, ${theme.colors[1]}, ${theme.accent}`);
        }
    } catch (e) {
        console.log('Could not apply saved theme:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    initTheme();
});
