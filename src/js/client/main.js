document.addEventListener('DOMContentLoaded', () => {
    // Navbar background on scroll (only applies to glassmorphic headers)
    const header = document.querySelector('header.header-glass');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('header-scrolled', window.scrollY > 50);
        });
    }

    // Recommended places carousel scroll
    const scrollContainer = document.getElementById('dest-scroll-container');
    const btnLeft = document.getElementById('dest-scroll-left');
    const btnRight = document.getElementById('dest-scroll-right');

    if (scrollContainer && btnLeft && btnRight) {
        btnLeft.addEventListener('click', () => {
            const card = scrollContainer.firstElementChild;
            const scrollAmount = card ? card.offsetWidth + 24 : 340;
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        btnRight.addEventListener('click', () => {
            const card = scrollContainer.firstElementChild;
            const scrollAmount = card ? card.offsetWidth + 24 : 340;
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // Travel page destination card switcher with FLIP sliding animation
    const cardsStack = document.getElementById('travel-cards-stack');
    const bgImg = document.getElementById('travel-bg-img');
    const titleEl = document.getElementById('travel-title');
    const descEl = document.getElementById('travel-desc');

    if (cardsStack) {
        cardsStack.addEventListener('click', (e) => {
            const clickedCard = e.target.closest('.travel-preview-card');
            if (!clickedCard || !cardsStack.contains(clickedCard)) return;

            const isAlreadyFirst = cardsStack.firstElementChild === clickedCard;

            // Update background image with crossfade
            if (bgImg && clickedCard.dataset.image) {
                bgImg.style.opacity = '0.2';
                setTimeout(() => {
                    bgImg.src = clickedCard.dataset.image;
                    bgImg.alt = clickedCard.dataset.title.replace(/<[^>]+>/g, ' ');
                    bgImg.style.opacity = '1';
                }, 180);
            }

            // Update title and description with smooth fade
            if (titleEl && clickedCard.dataset.title) {
                titleEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                titleEl.style.opacity = '0';
                titleEl.style.transform = 'translateY(8px)';
                setTimeout(() => {
                    titleEl.innerHTML = clickedCard.dataset.title;
                    titleEl.style.opacity = '1';
                    titleEl.style.transform = 'translateY(0)';
                }, 180);
            }

            if (descEl && clickedCard.dataset.desc) {
                descEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                descEl.style.opacity = '0';
                descEl.style.transform = 'translateY(8px)';
                setTimeout(() => {
                    descEl.textContent = clickedCard.dataset.desc;
                    descEl.style.opacity = '1';
                    descEl.style.transform = 'translateY(0)';
                }, 180);
            }

            // Slide the clicked card to top of the stack using FLIP animation
            if (!isAlreadyFirst) {
                const cards = Array.from(cardsStack.children);
                const firstRects = new Map();
                cards.forEach(card => {
                    firstRects.set(card, card.getBoundingClientRect());
                });

                // Move clicked card to top of the stack
                cardsStack.prepend(clickedCard);

                // Update active card styling
                cards.forEach(card => card.classList.remove('active-card'));
                clickedCard.classList.add('active-card');

                // Invert: translate cards back to starting positions
                cards.forEach(card => {
                    const firstRect = firstRects.get(card);
                    const lastRect = card.getBoundingClientRect();
                    const deltaY = firstRect.top - lastRect.top;

                    card.style.transition = 'none';
                    card.style.transform = `translateY(${deltaY}px)`;
                });

                // Force reflow
                cardsStack.offsetHeight;

                // Play: animate smoothly to new positions
                cards.forEach(card => {
                    card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)';
                    card.style.transform = '';
                });

                // Clean up transition style when finished
                setTimeout(() => {
                    cards.forEach(card => {
                        card.style.transition = '';
                    });
                }, 520);
            }
        });
    }

    // Packages page transportation filter tabs (Air, Land, Sea)
    const filterTabs = document.querySelectorAll('.packages-filter-tabs .filter-tab');
    const packageCards = document.querySelectorAll('.package-card');
    const breadcrumbEl = document.querySelector('.packages-breadcrumb');
    const heroTitleEl = document.querySelector('.packages-hero-title');
    const countEl = document.querySelector('.packages-count');

    if (filterTabs.length > 0 && packageCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const mode = tab.dataset.mode;
                if (!mode) return;

                // Update active tab styling
                filterTabs.forEach(t => {
                    t.classList.remove('filter-tab-active');
                    t.classList.add('filter-tab-inactive');
                });
                tab.classList.remove('filter-tab-inactive');
                tab.classList.add('filter-tab-active');

                // Update breadcrumb and hero title text
                const capitalized = mode.charAt(0).toUpperCase() + mode.slice(1);
                if (breadcrumbEl) breadcrumbEl.textContent = `Travel / ${capitalized}`;
                if (heroTitleEl) heroTitleEl.textContent = `${capitalized} Travel Destinations`;

                // Filter package cards with smooth animation
                let visibleCount = 0;
                packageCards.forEach(card => {
                    if (card.dataset.category === mode) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 20);
                        visibleCount++;
                    } else {
                        card.classList.add('hidden');
                        card.style.transition = '';
                    }
                });

                if (countEl) countEl.textContent = `${visibleCount} destinations`;
            });
        });
    }
});

