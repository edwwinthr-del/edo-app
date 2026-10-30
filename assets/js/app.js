const DATA_FILES = {
  profile: 'data/profile.json',
  skills: 'data/skills.json',
  experience: 'data/experience.json',
  education: 'data/education.json',
  projects: 'data/projects.json',
};

const SUPPORTED_LANGUAGES = ['en', 'tr', 'sr'];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const iconPaths = {
  server: '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M12 7h5M12 17h5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  sparkles: '<path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3ZM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15ZM19 13l.6 1.4L21 15l-1.4.6L19 17l-.6-1.4L17 15l1.4-.6L19 13Z"/>',
  check: '<path d="M20 11.5V12a8 8 0 1 1-4.7-7.3"/><path d="m9 12 3 3 9-10"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-3.2-3.2 2.3-1.9Z"/>',
};

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadJSON(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.json();
}

function getLanguage() {
  const queryLanguage = new URLSearchParams(window.location.search).get('lang');
  if (SUPPORTED_LANGUAGES.includes(queryLanguage)) return queryLanguage;

  try {
    const storedLanguage = window.localStorage.getItem('portfolio-language');
    if (SUPPORTED_LANGUAGES.includes(storedLanguage)) return storedLanguage;
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }

  return 'en';
}

function getValue(object, path) {
  return path.split('.').reduce((value, key) => value?.[key], object);
}

function applyStaticTranslations(ui) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = getValue(ui, element.dataset.i18n);
    if (typeof value === 'string') element.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    const value = getValue(ui, element.dataset.i18nHtml);
    if (typeof value === 'string') element.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const value = getValue(ui, element.dataset.i18nAria);
    if (typeof value === 'string') element.setAttribute('aria-label', value);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(element => {
    const value = getValue(ui, element.dataset.i18nAlt);
    if (typeof value === 'string') element.setAttribute('alt', value);
  });
}

function mergeLocalized(base, patch) {
  if (patch === undefined) return base;
  if (Array.isArray(patch)) return patch;
  if (!patch || typeof patch !== 'object') return patch;

  const keys = [...new Set([...Object.keys(base || {}), ...Object.keys(patch)])];
  return Object.fromEntries(
    keys.map(key => [key, mergeLocalized(base?.[key], patch[key])]),
  );
}

function localizeProjects(projects, patches = []) {
  return projects.map(project => {
    const patch = patches.find(item => item.id === project.id);
    if (!patch) return project;
    return {
      ...project,
      ...patch,
      screens: project.screens.map((screen, index) => ({
        ...screen,
        ...(patch.screens?.[index] || {}),
      })),
    };
  });
}

function setupLanguageSelector(language, ui) {
  const selector = document.querySelector('#language-select');
  if (!selector) return;

  selector.value = language;
  try {
    window.localStorage.setItem('portfolio-language', language);
  } catch {
    // The page is already rendered in the selected language.
  }
  selector.setAttribute('aria-label', ui.language.select);
  selector.addEventListener('change', event => {
    const nextLanguage = event.target.value;
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) return;

    try {
      window.localStorage.setItem('portfolio-language', nextLanguage);
    } catch {
      // The query parameter below still keeps the chosen language on this visit.
    }

    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLanguage);
    window.location.assign(url);
  });
}

function renderProfile(profile, ui) {
  document.querySelector('#hero-eyebrow').textContent = profile.hero.eyebrow;
  document.querySelector('#hero-intro').textContent = profile.hero.intro;
  document.querySelectorAll('.hero__statement > span').forEach((element, index) => {
    element.textContent = ui.hero.lines[index];
  });
  document.querySelector('#contact-mail').href = `mailto:${profile.email}`;
  document.querySelector('#contact-mail span').textContent = profile.email;
  document.querySelector('#copyright-year').textContent = String(new Date().getFullYear());

  const story = document.querySelector('#about-story');
  story.innerHTML = `
    <p class="lead">${escapeHTML(profile.about.lead)}</p>
    ${profile.about.body.map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join('')}
  `;

  const facts = document.querySelector('#quick-facts');
  facts.innerHTML = profile.quickFacts.map(fact => `
    <div class="fact">
      <strong>${escapeHTML(fact.value)}</strong>
      <span>${escapeHTML(fact.label)}</span>
    </div>
  `).join('');

  const principles = document.querySelector('#principles');
  principles.innerHTML = profile.about.principles.map((principle, index) => `
    <article class="principle reveal" data-reveal>
      <span class="principle__number">0${index + 1}</span>
      <h3>${escapeHTML(principle.title)}</h3>
      <p>${escapeHTML(principle.text)}</p>
    </article>
  `).join('');
}

function renderSkills(data) {
  const grid = document.querySelector('#skills-grid');
  grid.innerHTML = data.categories.map((category, index) => `
    <article class="skill-card reveal" data-reveal>
      <div class="skill-card__top">
        <span class="skill-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">${iconPaths[category.icon] || iconPaths.tool}</svg>
        </span>
        <span>${escapeHTML(category.kicker)} / ${String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3>${escapeHTML(category.name)}</h3>
      <div class="skill-list">
        ${category.skills.map(skill => `<span>${escapeHTML(skill)}</span>`).join('')}
      </div>
    </article>
  `).join('');

  document.querySelector('#language-list').innerHTML = data.languages.map(language => `
    <span>${escapeHTML(language.name)} <small>${escapeHTML(language.level)}</small></span>
  `).join('');
}

function renderExperience(data, ui) {
  const timeline = document.querySelector('#experience-timeline');
  timeline.innerHTML = data.jobs.map(job => `
    <article class="timeline-item reveal" data-reveal>
      <span class="timeline-item__marker" aria-hidden="true"></span>
      <div class="job-head">
        <div>
          <span class="job-company"><i></i>${escapeHTML(job.company)} · ${escapeHTML(job.location)}</span>
          <h3>${escapeHTML(job.title)}${job.programme ? `<small class="sr-only">, ${escapeHTML(job.programme)}</small>` : ''}</h3>
        </div>
        <span class="period">${escapeHTML(job.period)}</span>
      </div>
      <p class="job-summary">${escapeHTML(job.summary)}</p>
      <ul class="job-list">
        ${job.achievements.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
      </ul>
      <div class="job-tech" aria-label="${escapeHTML(ui.experience.technologiesLabel)}">
        ${job.technologies.map(tech => `<span>${escapeHTML(tech)}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderEducation(data, ui) {
  const degree = data.degree;
  const qualificationParts = degree.qualification.split(' in ');
  const qualificationLead = degree.qualificationLead || qualificationParts[0];
  const qualificationAccent = degree.qualificationAccent || qualificationParts.slice(1).join(' in ');
  const card = document.querySelector('#education-card');
  card.innerHTML = `
    <div class="education-card__orbit" aria-hidden="true">
      <span>2024</span>
      <i></i><i></i><i></i>
    </div>
    <div class="education-copy">
      <span class="section-heading__index">${escapeHTML(ui.education.index)}</span>
      <h2>${escapeHTML(qualificationLead)}<br><em>${escapeHTML(qualificationAccent)}</em></h2>
      <p class="school">${escapeHTML(degree.institution)} <span>· ${escapeHTML(degree.location)} · ${escapeHTML(degree.year)}</span></p>
      <p>${escapeHTML(degree.summary)}</p>
      <div class="course-list" aria-label="${escapeHTML(ui.education.courseworkLabel)}">
        ${degree.coursework.map(course => `<span>${escapeHTML(course)}</span>`).join('')}
      </div>
    </div>
  `;
}

function renderProjects(projects, ui, language) {
  const grid = document.querySelector('#projects-grid');
  grid.innerHTML = projects
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((project, index) => `
      <a
        class="project-card reveal"
        data-reveal
        href="projects.html?id=${encodeURIComponent(project.id)}&amp;lang=${encodeURIComponent(language)}"
        style="--project-accent:${escapeHTML(project.accent)};--project-accent-2:${escapeHTML(project.accentSecondary)};--media-aspect:${escapeHTML(project.screens[0].aspect)}"
        aria-labelledby="project-title-${escapeHTML(project.id)}"
      >
        <div class="project-card__media">
          <img
            src="${escapeHTML(project.screens[0].src)}"
            alt="${escapeHTML(project.screens[0].alt)}"
            width="1440"
            height="900"
            loading="${index < 2 ? 'eager' : 'lazy'}"
          >
        </div>
        <div class="project-card__body">
          <div class="project-meta">
            <span>${String(index + 1).padStart(2, '0')} / ${escapeHTML(project.category)}</span>
            <span>${escapeHTML(project.year)}</span>
          </div>
          <h3 id="project-title-${escapeHTML(project.id)}">${escapeHTML(project.name)}</h3>
          <p class="project-card__subtitle">${escapeHTML(project.subtitle)}</p>
          <p class="project-card__description">${escapeHTML(project.description)}</p>
          <div class="tech-pills">
            ${project.technologies.slice(0, 5).map(tech => `<span class="tech-pill">${escapeHTML(tech)}</span>`).join('')}
          </div>
          <span class="project-card__open">${escapeHTML(ui.projects.openCase)} <b>↗</b></span>
        </div>
      </a>
    `).join('');
}

function setupNavigation() {
  const header = document.querySelector('#site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const progress = document.querySelector('#scroll-progress');
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    document.body.classList.toggle('menu-open', !open);
    menuButton.setAttribute('aria-expanded', String(!open));
  });

  mobileMenu?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const updateScroll = () => {
    const top = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${height > 0 ? Math.min(100, (top / height) * 100) : 0}%`;
    header.classList.toggle('is-scrolled', top > 30);
  };

  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });

  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.dataset.nav === visible.target.id);
    });
  }, { rootMargin: '-30% 0px -60%', threshold: [0, 0.2, 0.5] });

  sections.forEach(section => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  const observeReveals = () => {
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(element => revealObserver.observe(element));
  };

  observeReveals();
  return observeReveals;
}

function setupTypewriter(phrases) {
  if (reducedMotion) return;
  const element = document.querySelector('#typewriter-text');
  if (!element) return;
  let phraseIndex = 0;
  let characterIndex = phrases[0].length;
  let deleting = false;

  const tick = () => {
    const phrase = phrases[phraseIndex];
    characterIndex += deleting ? -1 : 1;
    element.textContent = phrase.slice(0, Math.max(0, characterIndex));

    if (!deleting && characterIndex === phrase.length) {
      deleting = true;
      window.setTimeout(tick, 1500);
      return;
    }
    if (deleting && characterIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    window.setTimeout(tick, deleting ? 45 : 85);
  };
  window.setTimeout(tick, 1600);
}

function setupMotion() {
  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);

  const visual = document.querySelector('.hero__visual');
  if (visual && window.matchMedia('(pointer: fine)').matches) {
    const layers = [...visual.querySelectorAll('[data-depth]')];
    visual.addEventListener('pointermove', event => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      layers.forEach(layer => {
        const depth = Number(layer.dataset.depth);
        window.gsap.to(layer, {
          x: x * depth * 80,
          y: y * depth * 55,
          duration: 1.1,
          ease: 'power2.out',
          overwrite: true,
        });
      });
    });
    visual.addEventListener('pointerleave', () => {
      window.gsap.to(layers, { x: 0, y: 0, duration: 1.2, ease: 'power3.out', overwrite: true });
    });
  }

  window.gsap.utils.toArray('.project-card').forEach(card => {
    window.gsap.fromTo(card,
      { y: 50, rotateX: 2.5 },
      {
        y: 0,
        rotateX: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          end: 'top 58%',
          scrub: 0.7,
        },
      },
    );
  });

  window.gsap.to('.hero__visual', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });
}

async function init() {
  try {
    document.body.classList.add('js-ready');
    const language = getLanguage();
    const [profile, skills, experience, education, projects, locale] = await Promise.all([
      ...Object.values(DATA_FILES).map(loadJSON),
      loadJSON(`data/i18n/${language}.json`),
    ]);
    const content = locale.content || {};
    const localizedProfile = mergeLocalized(profile, content.profile);
    const localizedSkills = mergeLocalized(skills, content.skills);
    const localizedExperience = mergeLocalized(experience, content.experience);
    const localizedEducation = mergeLocalized(education, content.education);
    const localizedProjects = localizeProjects(projects.projects, content.projects);

    document.documentElement.lang = locale.htmlLang;
    document.title = locale.meta.title;
    document.querySelector('meta[name="description"]').setAttribute('content', locale.meta.description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', locale.meta.title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', locale.meta.description);
    applyStaticTranslations(locale.ui);
    setupLanguageSelector(language, locale.ui);

    renderProfile(localizedProfile, locale.ui);
    renderSkills(localizedSkills);
    renderExperience(localizedExperience, locale.ui);
    renderEducation(localizedEducation, locale.ui);
    renderProjects(localizedProjects, locale.ui, language);

    const observeReveals = setupNavigation();
    setupTypewriter(locale.ui.hero.typewriter);
    setupMotion();
    observeReveals();

    document.documentElement.dataset.ready = 'true';
  } catch (error) {
    console.error('Portfolio data failed to load.', error);
    document.body.classList.remove('js-ready');
    document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('is-visible'));
  }
}

init();
