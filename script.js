// Custom Particle System for Hearts
class HeartParticle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + Math.random() * 200;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = '#ff4d6d';

        // Draw heart shape
        this.ctx.beginPath();
        const d = this.size;
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
        this.ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
        this.ctx.fill();

        this.ctx.restore();
    }

    update() {
        this.y -= this.speed;
        this.angle += this.rotationSpeed;
        this.x += Math.sin(this.y / 50) * 0.5;

        if (this.y < -50) {
            this.reset();
        }
    }
}

const initHearts = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'hearts-canvas';
    document.getElementById('particles-js').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let hearts = [];
    const heartCount = 30;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < heartCount; i++) {
        hearts.push(new HeartParticle(canvas, ctx));
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        requestAnimationFrame(animate);
    };

    animate();
};

// Intersection Observer for Reveal Animations
const initReveal = () => {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Track gallery items and note card
    document.querySelectorAll('.grid-item, .note-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHearts();
    initReveal();

    // Add a subtle parallax effect to the hero title
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }
    });
});
