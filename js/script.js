(function () {
  'use strict';

  let currentLang = 'ru';

  const navItems = [
    { key: 'home', href: 'index.html', i18n: 'nav.home' },
    { key: 'about', href: 'about.html', i18n: 'nav.about' },
    { key: 'tours', href: 'tours.html', i18n: 'nav.tours' },
    { key: 'blog', href: 'blog.html', i18n: 'nav.blog' },
    { key: 'reviews', href: 'reviews.html', i18n: 'nav.reviews' },
    { key: 'gallery', href: 'gallery.html', i18n: 'nav.gallery' },
    { key: 'faq', href: 'faq.html', i18n: 'nav.faq' },
    { key: 'contact', href: 'contact.html', i18n: 'nav.contact' }
  ];

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || key;
  }

  function getPage() {
    const page = document.body.getAttribute('data-page') || 'home';
    const parentMap = { 'tour-single': 'tours', 'tour-classic': 'tours', 'tour-adventure': 'tours', 'tour-winter': 'tours', 'tour-custom': 'tours', 'blog-single': 'blog' };
    return parentMap[page] || page;
  }

  function buildNavLinks(className) {
    const page = getPage();
    return navItems.map(function (item) {
      const active = page === item.key ? ' ' + className + '--active' : '';
      return '<li><a href="' + item.href + '" class="' + className + active + '" data-i18n="' + item.i18n + '">' + t(item.i18n) + '</a></li>';
    }).join('');
  }

  function buildHeader() {
    const page = getPage();
    const bookHref = page === 'home' ? '#contact-form' : 'contact.html';

    return (
      '<header class="site-header">' +
        '<div class="container site-header__inner">' +
          '<a href="index.html" class="logo">' +
            '<span class="logo__name" data-i18n="brand.name">' + t('brand.name') + '</span>' +
            '<span class="logo__tagline" data-i18n="brand.tagline">' + t('brand.tagline') + '</span>' +
          '</a>' +
          '<nav class="nav" aria-label="Main navigation">' +
            '<ul class="nav__list">' + buildNavLinks('nav__link') + '</ul>' +
          '</nav>' +
          '<div class="header__actions">' +
            '<button class="theme-toggle" data-theme-toggle data-i18n-aria="theme.toggle" aria-label="Toggle dark mode">' +
              '<svg class="theme-toggle__icon theme-toggle__icon--moon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/></svg>' +
              '<svg class="theme-toggle__icon theme-toggle__icon--sun" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>' +
            '</button>' +
            '<div class="lang-switch">' +
              '<button class="lang-switch__btn' + (currentLang === 'en' ? ' lang-switch__btn--active' : '') + '" data-lang="en" aria-label="English">EN</button>' +
              '<button class="lang-switch__btn' + (currentLang === 'ru' ? ' lang-switch__btn--active' : '') + '" data-lang="ru" aria-label="Русский">RU</button>' +
            '</div>' +
            '<a href="' + bookHref + '" class="btn btn--primary btn--sm header__cta" data-i18n="btn.bookNow">' + t('btn.bookNow') + '</a>' +
            '<button class="burger" aria-label="Toggle menu" aria-expanded="false">' +
              '<span class="burger__line"></span>' +
              '<span class="burger__line"></span>' +
              '<span class="burger__line"></span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<nav class="mobile-nav" aria-label="Mobile navigation">' +
        '<ul class="mobile-nav__list">' + buildNavLinks('mobile-nav__link') + '</ul>' +
        '<div class="mobile-nav__cta">' +
          '<a href="' + bookHref + '" class="btn btn--primary" data-i18n="btn.bookNow">' + t('btn.bookNow') + '</a>' +
        '</div>' +
      '</nav>'
    );
  }

  function buildFooter() {
    const footerLinks = navItems.map(function (item) {
      return '<li><a href="' + item.href + '" data-i18n="' + item.i18n + '">' + t(item.i18n) + '</a></li>';
    }).join('');

    return (
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer__grid">' +
            '<div class="footer__logo">' +
              '<a href="index.html" class="logo">' +
                '<span class="logo__name" data-i18n="brand.name">' + t('brand.name') + '</span>' +
                '<span class="logo__tagline" data-i18n="brand.tagline">' + t('brand.tagline') + '</span>' +
              '</a>' +
              '<p class="footer__slogan" data-i18n="brand.slogan">' + t('brand.slogan') + '</p>' +
            '</div>' +
            '<div>' +
              '<h4 class="footer__title" data-i18n="footer.quickLinks">' + t('footer.quickLinks') + '</h4>' +
              '<ul class="footer__links">' + footerLinks + '</ul>' +
            '</div>' +
            '<div>' +
              '<h4 class="footer__title" data-i18n="footer.contact">' + t('footer.contact') + '</h4>' +
              '<ul class="footer__contact">' +
                '<li><a href="https://wa.me/996555123456"><span data-i18n="footer.whatsapp">' + t('footer.whatsapp') + '</span>: +996 555 123 456</a></li>' +
                '<li><a href="https://t.me/iamnomad_kg"><span data-i18n="footer.telegram">' + t('footer.telegram') + '</span>: @iamnomad_kg</a></li>' +
                '<li><a href="mailto:info@iamnomad.kg"><span data-i18n="footer.email">' + t('footer.email') + '</span>: info@iamnomad.kg</a></li>' +
                '<li><a href="tel:+996312456789"><span data-i18n="footer.phone">' + t('footer.phone') + '</span>: +996 312 456 789</a></li>' +
              '</ul>' +
              '<div class="footer__social">' +
                '<p class="footer__title" data-i18n="footer.followUs">' + t('footer.followUs') + '</p>' +
                '<div class="social-links">' +
                  '<a href="https://www.instagram.com/iamnomad_kg/" class="social-links__item" aria-label="Instagram" target="_blank" rel="noopener">IG</a>' +
                  '<a href="https://www.facebook.com/iamnomadkg/" class="social-links__item" aria-label="Facebook" target="_blank" rel="noopener">FB</a>' +
                  '<a href="https://www.youtube.com/@iamnomad_kg" class="social-links__item" aria-label="YouTube" target="_blank" rel="noopener">YT</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="footer__bottom">' +
            '<p data-i18n="footer.copyright">' + t('footer.copyright') + '</p>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  function initLayout() {
    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');
    if (headerEl) headerEl.innerHTML = buildHeader();
    if (footerEl) footerEl.innerHTML = buildFooter();
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (translations[currentLang][key]) {
        el.textContent = translations[currentLang][key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[currentLang][key]) {
        el.placeholder = translations[currentLang][key];
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria');
      if (translations[currentLang][key]) {
        el.setAttribute('aria-label', translations[currentLang][key]);
      }
    });

    document.documentElement.lang = currentLang;

    // Update page <title>
    const rawPage = document.body.getAttribute('data-page') || 'home';
    const titleKey = 'page.title.' + rawPage;
    const pageTitle = translations[currentLang] && translations[currentLang][titleKey];
    if (pageTitle) {
      document.title = pageTitle + ' — I AM NOMAD';
    }

    // Update <meta name="description">
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const descKey = 'page.desc.' + rawPage;
      const pageDesc = translations[currentLang] && translations[currentLang][descKey];
      if (pageDesc) metaDesc.setAttribute('content', pageDesc);
    }
  }

  function initI18n() {
    const saved = localStorage.getItem('lang');
    if (saved && translations[saved]) {
      currentLang = saved;
    }

    applyTranslations();
    updateLangButtons();

    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-lang]');
      if (!btn) return;
      const lang = btn.getAttribute('data-lang');
      if (lang && translations[lang]) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        applyTranslations();
        updateLangButtons();
        document.dispatchEvent(new CustomEvent('langchange'));
      }
    });
  }

  function updateLangButtons() {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.classList.toggle('lang-switch__btn--active', btn.getAttribute('data-lang') === currentLang);
    });
  }

  function initMobileNav() {
    document.addEventListener('click', function (e) {
      const burger = e.target.closest('.burger');
      if (burger) {
        const mobileNav = document.querySelector('.mobile-nav');
        const isOpen = burger.classList.toggle('burger--open');
        mobileNav.classList.toggle('mobile-nav--open', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('overflow-hidden', isOpen);
        return;
      }

      const mobileLink = e.target.closest('.mobile-nav__link');
      if (mobileLink) {
        const burger2 = document.querySelector('.burger');
        const mobileNav2 = document.querySelector('.mobile-nav');
        if (burger2) { burger2.classList.remove('burger--open'); burger2.setAttribute('aria-expanded', 'false'); }
        if (mobileNav2) mobileNav2.classList.remove('mobile-nav--open');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }

  function initAccordions() {
    document.querySelectorAll('.accordion__header').forEach(function (header) {
      header.addEventListener('click', function () {
        const item = header.closest('.accordion__item');
        const isOpen = item.classList.contains('accordion__item--open');

        const parent = item.closest('.accordion');
        if (parent) {
          parent.querySelectorAll('.accordion__item--open').forEach(function (openItem) {
            openItem.classList.remove('accordion__item--open');
          });
        }

        if (!isOpen) {
          item.classList.add('accordion__item--open');
        }
      });
    });
  }

  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (tabsEl) {
      const buttons = tabsEl.querySelectorAll('.tabs__btn');
      const panels = tabsEl.querySelectorAll('.tabs__panel');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const target = btn.getAttribute('data-tab');

          buttons.forEach(function (b) {
            b.classList.toggle('tabs__btn--active', b === btn);
          });

          panels.forEach(function (panel) {
            panel.classList.toggle('tabs__panel--active', panel.getAttribute('data-tab') === target);
          });

          if (tabsEl.classList.contains('tabs--filter')) {
            filterTourCards(target);
          }
        });
      });
    });
  }

  function filterTourCards(category) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-category]').forEach(function (card) {
      const show = category === 'all' || card.getAttribute('data-category').split(' ').indexOf(category) !== -1;
      if (show) {
        card.classList.remove('card--hidden');
        if (!prefersReduced) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.97)';
          requestAnimationFrame(function () {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = '';
          });
        }
      } else {
        if (!prefersReduced) {
          card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.97)';
          setTimeout(function () { card.classList.add('card--hidden'); }, 220);
        } else {
          card.classList.add('card--hidden');
        }
      }
    });
  }

  function initSliders() {
    document.querySelectorAll('.slider').forEach(function (slider) {
      const track = slider.querySelector('.slider__track');
      const prevBtn = slider.querySelector('.slider__btn--prev');
      const nextBtn = slider.querySelector('.slider__btn--next');
      if (!track) return;

      const slideWidth = function () {
        if (slider.classList.contains('slider--single')) {
          return track.clientWidth;
        }
        const slide = track.querySelector('.slider__slide');
        if (!slide) return 0;
        return slide.offsetWidth + 24;
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          track.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          track.scrollBy({ left: slideWidth(), behavior: 'smooth' });
        });
      }
    });

    document.querySelectorAll('.gallery-slider').forEach(function (slider) {
      const track = slider.querySelector('.gallery-slider__track');
      const slides = slider.querySelectorAll('.gallery-slider__slide');
      const dots = slider.querySelectorAll('.gallery-slider__dot');
      const prevBtn = slider.querySelector('.gallery-slider__arrow--prev');
      const nextBtn = slider.querySelector('.gallery-slider__arrow--next');
      let current = 0;

      function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function (dot, i) {
          dot.classList.toggle('gallery-slider__dot--active', i === current);
        });
      }

      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { goTo(i); });
      });
    });
  }

  function initStickyCta() {
    const stickyCta = document.querySelector('.sticky-cta');
    const trigger = document.querySelector('[data-sticky-trigger]');
    if (!stickyCta || !trigger) return;

    function checkScroll() {
      const rect = trigger.getBoundingClientRect();
      stickyCta.classList.toggle('sticky-cta--visible', rect.bottom < 0);
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }

  // Web3Forms integration — replace YOUR_WEB3FORMS_KEY with a key from https://web3forms.com/
  function initTourBuilder() {
    var root = document.querySelector('[data-tour-builder]');
    if (!root) return;

    var ITEMS = [
      { id: 'yurt', icon: '🏕️' },
      { id: 'eagle', icon: '🦅' },
      { id: 'horses', icon: '🐎' },
      { id: 'riding', icon: '🏇' },
      { id: 'issykSouth', icon: '🌊' },
      { id: 'issykNorth', icon: '🏖️' },
      { id: 'trek', icon: '🥾' },
      { id: 'atv', icon: '🏍️' },
      { id: 'rafting', icon: '🛶' },
      { id: 'wakeboard', icon: '🏄' },
      { id: 'ski', icon: '🎿' },
      { id: 'heli', icon: '🚁' },
      { id: 'spa', icon: '♨️' },
      { id: 'photo', icon: '📸' },
      { id: 'bishkek', icon: '🏙️' },
      { id: 'burana', icon: '🏛️' }
    ];

    var poolEl = root.querySelector('[data-builder-pool]');
    var routeEl = root.querySelector('[data-builder-route]');
    var emptyEl = root.querySelector('[data-builder-empty]');
    var countEl = root.querySelector('[data-builder-count]');
    var clearBtn = root.querySelector('[data-builder-clear]');
    var submitBtn = root.querySelector('[data-builder-submit]');
    var routeIds = [];
    var dragId = null;
    var dragFrom = null;

    function itemById(id) {
      for (var i = 0; i < ITEMS.length; i++) {
        if (ITEMS[i].id === id) return ITEMS[i];
      }
      return null;
    }

    function labelOf(id) {
      return t('builder.item.' + id);
    }

    function renderPool() {
      poolEl.innerHTML = '';
      ITEMS.forEach(function (item) {
        var used = routeIds.indexOf(item.id) !== -1;
        var chip = document.createElement('div');
        chip.className = 'builder__chip' + (used ? ' builder__chip--used' : '');
        chip.setAttribute('draggable', used ? 'false' : 'true');
        chip.dataset.id = item.id;
        chip.dataset.source = 'pool';
        chip.innerHTML =
          '<span class="builder__chip-icon" aria-hidden="true">' + item.icon + '</span>' +
          '<span class="builder__chip-label">' + labelOf(item.id) + '</span>' +
          (used ? '' : '<button type="button" class="builder__chip-btn" data-add aria-label="+">+</button>');
        poolEl.appendChild(chip);
      });
    }

    function renderRoute() {
      var chips = routeEl.querySelectorAll('.builder__chip');
      chips.forEach(function (c) { c.remove(); });

      if (emptyEl) {
        emptyEl.hidden = routeIds.length > 0;
      }

      routeIds.forEach(function (id) {
        var item = itemById(id);
        if (!item) return;
        var chip = document.createElement('div');
        chip.className = 'builder__chip builder__chip--in-route';
        chip.setAttribute('draggable', 'true');
        chip.dataset.id = id;
        chip.dataset.source = 'route';
        chip.innerHTML =
          '<span class="builder__chip-handle" aria-hidden="true">⋮⋮</span>' +
          '<span class="builder__chip-icon" aria-hidden="true">' + item.icon + '</span>' +
          '<span class="builder__chip-label">' + labelOf(id) + '</span>' +
          '<button type="button" class="builder__chip-btn builder__chip-btn--remove" data-remove aria-label="×">×</button>';
        routeEl.appendChild(chip);
      });

      if (countEl) countEl.textContent = String(routeIds.length);
      if (submitBtn) {
        submitBtn.classList.toggle('btn--disabled', routeIds.length === 0);
        if (routeIds.length === 0) {
          submitBtn.setAttribute('aria-disabled', 'true');
        } else {
          submitBtn.removeAttribute('aria-disabled');
        }
      }
    }

    function render() {
      renderPool();
      renderRoute();
    }

    function addItem(id) {
      if (routeIds.indexOf(id) !== -1) return;
      routeIds.push(id);
      render();
    }

    function removeItem(id) {
      routeIds = routeIds.filter(function (x) { return x !== id; });
      render();
    }

    function moveItem(id, toIndex) {
      var from = routeIds.indexOf(id);
      if (from === -1) return;
      routeIds.splice(from, 1);
      if (toIndex > from) toIndex -= 1;
      if (toIndex < 0) toIndex = 0;
      if (toIndex > routeIds.length) toIndex = routeIds.length;
      routeIds.splice(toIndex, 0, id);
      render();
    }

    function insertFromPool(id, toIndex) {
      if (routeIds.indexOf(id) !== -1) return;
      if (typeof toIndex !== 'number' || toIndex < 0 || toIndex > routeIds.length) {
        routeIds.push(id);
      } else {
        routeIds.splice(toIndex, 0, id);
      }
      render();
    }

    function dropIndexFromEvent(e) {
      var chips = Array.prototype.slice.call(routeEl.querySelectorAll('.builder__chip--in-route'));
      for (var i = 0; i < chips.length; i++) {
        var rect = chips[i].getBoundingClientRect();
        var mid = rect.top + rect.height / 2;
        if (e.clientY < mid) return i;
      }
      return chips.length;
    }

    poolEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add]');
      if (!btn) return;
      var chip = btn.closest('.builder__chip');
      if (chip && chip.dataset.id) addItem(chip.dataset.id);
    });

    routeEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove]');
      if (!btn) return;
      var chip = btn.closest('.builder__chip');
      if (chip && chip.dataset.id) removeItem(chip.dataset.id);
    });

    root.addEventListener('dragstart', function (e) {
      var chip = e.target.closest('.builder__chip');
      if (!chip || !chip.getAttribute('draggable') || chip.getAttribute('draggable') === 'false') return;
      dragId = chip.dataset.id;
      dragFrom = chip.dataset.source;
      chip.classList.add('builder__chip--dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragId);
    });

    root.addEventListener('dragend', function (e) {
      var chip = e.target.closest('.builder__chip');
      if (chip) chip.classList.remove('builder__chip--dragging');
      routeEl.classList.remove('builder__route--over');
      dragId = null;
      dragFrom = null;
    });

    routeEl.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      routeEl.classList.add('builder__route--over');
    });

    routeEl.addEventListener('dragleave', function (e) {
      if (!routeEl.contains(e.relatedTarget)) {
        routeEl.classList.remove('builder__route--over');
      }
    });

    routeEl.addEventListener('drop', function (e) {
      e.preventDefault();
      routeEl.classList.remove('builder__route--over');
      var id = dragId || e.dataTransfer.getData('text/plain');
      if (!id) return;
      var index = dropIndexFromEvent(e);
      if (dragFrom === 'route') {
        moveItem(id, index);
      } else {
        insertFromPool(id, index);
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        routeIds = [];
        render();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', function (e) {
        if (routeIds.length === 0) {
          e.preventDefault();
          return;
        }
        var lines = routeIds.map(function (id, i) {
          return (i + 1) + '. ' + labelOf(id);
        });
        sessionStorage.setItem('customTourBlocks', JSON.stringify({
          ids: routeIds,
          labels: routeIds.map(labelOf),
          text: lines.join('\n')
        }));
      });
    }

    // Re-render labels on language change
    document.addEventListener('langchange', render);

    render();
  }

  function initCustomTourPrefill() {
    var raw = sessionStorage.getItem('customTourBlocks');
    if (!raw) return;
    var tourInput = document.getElementById('contact-tour');
    var message = document.getElementById('contact-message');
    if (!tourInput && !message) return;

    try {
      var data = JSON.parse(raw);
      if (tourInput) tourInput.value = t('tour.custom.title');
      if (message && data.text) {
        message.value = t('builder.requestPrefix') + '\n' + data.text;
      }
      sessionStorage.removeItem('customTourBlocks');
    } catch (err) {
      sessionStorage.removeItem('customTourBlocks');
    }
  }

  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const originalText = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = '...'; }

        var data = {};
        new FormData(form).forEach(function (val, key) { data[key] = val; });

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(function (res) { return res.json(); })
          .then(function (json) {
            if (json.success) {
              form.reset();
              showFormMsg(form, t('misc.formSuccess'), 'success');
            } else {
              showFormMsg(form, t('misc.formError'), 'error');
            }
          })
          .catch(function () {
            showFormMsg(form, t('misc.formError'), 'error');
          })
          .finally(function () {
            if (btn) { btn.disabled = false; btn.textContent = originalText; }
          });
      });
    });
  }

  function showFormMsg(form, text, type) {
    var msg = form.querySelector('.form__msg');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'form__msg';
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.className = 'form__msg form__msg--' + type;
  }

  function initTheme() {
    function applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      try {
        localStorage.setItem('theme', theme);
      } catch (e) {}
    }

    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-theme-toggle]');
      if (!btn) return;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  function initScrollHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      if (y > 80) {
        header.classList.toggle('site-header--hidden', y > lastY);
      } else {
        header.classList.remove('site-header--hidden');
      }
      lastY = y;
    }, { passive: true });
  }

  function initScrollReveal() {
    if (!window.IntersectionObserver) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.card, .feature, .review-card').forEach(function (el) {
      el.classList.add('reveal');
    });
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-grid img, .gallery-slider__slide img');
    if (!galleryImages.length) return;

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&times;</button>' +
      '<button class="lightbox__prev" aria-label="Previous">&#8249;</button>' +
      '<img class="lightbox__img" src="" alt="">' +
      '<button class="lightbox__next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lb);

    const imgs = Array.from(galleryImages);
    let current = 0;
    const lbImg = lb.querySelector('.lightbox__img');

    function openLightbox(index) {
      current = (index + imgs.length) % imgs.length;
      lbImg.src = imgs[current].src.replace(/w=\d+/, 'w=1600');
      lbImg.alt = imgs[current].alt;
      lb.classList.add('lightbox--open');
      document.body.classList.add('overflow-hidden');
    }

    function closeLightbox() {
      lb.classList.remove('lightbox--open');
      document.body.classList.remove('overflow-hidden');
    }

    imgs.forEach(function (img, i) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () { openLightbox(i); });
    });

    lb.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox__prev').addEventListener('click', function () { openLightbox(current - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function () { openLightbox(current + 1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('lightbox--open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(current - 1);
      if (e.key === 'ArrowRight') openLightbox(current + 1);
    });
  }

  function init() {
    initLayout();
    initI18n();
    initTheme();
    initMobileNav();
    initAccordions();
    initTabs();
    initSliders();
    initStickyCta();
    initForms();
    initCustomTourPrefill();
    initTourBuilder();
    initScrollHeader();
    initScrollReveal();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
