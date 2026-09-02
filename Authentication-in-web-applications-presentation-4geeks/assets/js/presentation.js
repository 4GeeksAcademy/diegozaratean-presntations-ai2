let currentSlide = 0;

function getElements() {
    return {
        slides: document.querySelectorAll('.slide'),
        counter: document.getElementById('slideCounter'),
        progressBar: document.getElementById('progressBar'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn')
    };
}

function updateSlide() {
    const { slides, counter, progressBar, prevBtn, nextBtn } = getElements();
    if (!slides || slides.length === 0) return;

    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide >= slides.length) currentSlide = slides.length - 1;

    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    if (counter) {
        counter.innerText = `Diapositiva ${currentSlide + 1} de ${slides.length}`;
    }
    
    if (progressBar) {
        const progress = ((currentSlide + 1) / slides.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    if (prevBtn) prevBtn.disabled = (currentSlide === 0);
    if (nextBtn) nextBtn.disabled = (currentSlide === slides.length - 1);
}

function nextSlide() {
    const { slides } = getElements();
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlide();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
    }
}

// Exponer explícitamente en window para onclick inline HTML
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.updateSlide = updateSlide;

function initControls() {
    const { prevBtn, nextBtn } = getElements();
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            if (e) e.preventDefault();
            prevSlide();
        };
    }
    if (nextBtn) {
        nextBtn.onclick = (e) => {
            if (e) e.preventDefault();
            nextSlide();
        };
    }
    updateSlide();
}

document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (e.key === 'ArrowRight' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    }
});

const COPY_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function copyTextToClipboard(text, btn) {
    function setSuccess() {
        btn.innerHTML = `${CHECK_ICON_SVG} <span>¡Copiado!</span>`;
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = `${COPY_ICON_SVG} <span>Copiar</span>`;
            btn.classList.remove('copied');
        }, 2200);
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(setSuccess).catch(() => {
            fallbackCopyText(text, setSuccess);
        });
    } else {
        fallbackCopyText(text, setSuccess);
    }
}

function fallbackCopyText(text, callback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        if (callback) callback();
    } catch (err) {
        console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
}

// Función global disponible para llamadas onclick directas
window.copyDirect = function(btn) {
    const container = btn.closest('.editor-container');
    if (!container) return;
    const codeBlock = container.querySelector('.code-block') || container.querySelector('code') || container.querySelector('pre');
    if (!codeBlock) return;
    copyTextToClipboard(codeBlock.innerText, btn);
};

function initCopyButtons() {
    document.querySelectorAll('.editor-container').forEach(container => {
        const header = container.querySelector('.editor-header');
        const codeBlock = container.querySelector('.code-block') || container.querySelector('code') || container.querySelector('pre');
        if (header && codeBlock && !header.querySelector('.copy-code-btn')) {
            const btn = document.createElement('button');
            btn.className = 'copy-code-btn';
            btn.type = 'button';
            btn.innerHTML = `${COPY_ICON_SVG} <span>Copiar</span>`;
            btn.title = 'Copiar código con formato exacto al portapapeles';
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                copyTextToClipboard(codeBlock.innerText, btn);
            });

            const rightContainer = header.querySelector('.editor-header-right');
            if (rightContainer) {
                rightContainer.appendChild(btn);
            } else {
                header.appendChild(btn);
            }
        }
    });
}

function boot() {
    initControls();
    initCopyButtons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

window.addEventListener('load', boot);

