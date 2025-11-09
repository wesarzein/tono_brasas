document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const prevBtn = wrapper.querySelector('.carousel-nav .prev');
        const nextBtn = wrapper.querySelector('.carousel-nav .next');
        const cards = carousel.querySelectorAll('.promo-card, .card');

        if (!carousel || !prevBtn || !nextBtn || cards.length === 0) return;

        let scrollSpeed = 1; // px por frame
        let direction = 1; // 1 = derecha, -1 = izquierda
        let requestId;

        const step = () => {
            carousel.scrollLeft += scrollSpeed * direction;

            // Cambiar dirección al llegar a los extremos
            if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
                direction = -1; // ir a la izquierda
            } else if (carousel.scrollLeft <= 0) {
                direction = 1; // ir a la derecha
            }

            requestId = requestAnimationFrame(step);
        };

        step(); // iniciar animación

        // Funciones de botones
        const gap = 16;
        const cardWidth = cards[0].offsetWidth + gap;

        prevBtn.addEventListener('click', () => {
            carousel.scrollLeft -= cardWidth;
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollLeft += cardWidth;
        });

        // Pausar al pasar el mouse
        wrapper.addEventListener('mouseenter', () => cancelAnimationFrame(requestId));
        wrapper.addEventListener('mouseleave', () => step());
    });
});
