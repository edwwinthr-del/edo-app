const root = document.querySelector('#project-root');
const SUPPORTED_LANGUAGES = ['en', 'tr', 'sr'];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadProjects() {
  const response = await fetch('data/projects.json', { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Project data returned ${response.status}`);
  return response.json();
}

async function loadJSON(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
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
      // The query parameter below still preserves the selection for this visit.
    }

    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLanguage);
    window.location.assign(url);
  });
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

function findProject(data) {
  const id = new URLSearchParams(window.location.search).get('id');
  return data.projects.find(project => project.id === id) || data.projects[0];
}

function featureRows(project, ui) {
  const screens = project.screens;
  const chunks = [
    project.features.slice(0, 3),
    project.features.slice(3, 6),
    project.features.slice(6, 9),
  ].filter(chunk => chunk.length);

  return chunks.map((items, index) => {
    const screen = screens[Math.min(index, screens.length - 1)];
    const headingMap = ui.project.featureHeadings;
    const heading = headingMap[index] || headingMap[headingMap.length - 1];
    return `
      <article class="feature-row case-reveal-item">
        <figure class="feature-media" style="--feature-aspect:${escapeHTML(screen.aspect)}">
          <img
            src="${escapeHTML(screen.src)}"
            alt="${escapeHTML(screen.alt)}"
            width="1440"
            height="900"
            loading="lazy"
          >
        </figure>
        <div class="feature-copy">
          <span class="feature-copy__index">${String(index + 1).padStart(2, '0')} / ${escapeHTML(screen.caption)}</span>
          <h3>${escapeHTML(heading.lead)}<br><em>${escapeHTML(heading.accent)}</em></h3>
          <p>${escapeHTML(project.description)}</p>
          <ul class="feature-checklist">
            ${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
          </ul>
        </div>
      </article>
    `;
  }).join('');
}

function renderProject(project, allProjects, ui, language) {
  const ordered = allProjects.slice().sort((a, b) => a.order - b.order);
  const currentIndex = ordered.findIndex(item => item.id === project.id);
  const nextProject = ordered[(currentIndex + 1) % ordered.length];
  const [heroScreen, secondScreen, thirdScreen] = project.screens;
  const demoAction = project.demo
    ? `<a class="button button--ghost" href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer">${escapeHTML(ui.project.liveDemo)} ↗</a>`
    : '';

  document.documentElement.style.setProperty('--project-accent', project.accent);
  document.documentElement.style.setProperty('--project-accent-2', project.accentSecondary);
  document.title = `${project.name} — Edvin Tahirović`;
  document.querySelector('meta[name="description"]').setAttribute('content', project.description);
  document.querySelector('#case-github').href = project.github;

  root.innerHTML = `
    <section class="case-hero" id="overview" style="--project-accent:${escapeHTML(project.accent)};--project-accent-2:${escapeHTML(project.accentSecondary)};--hero-aspect:${escapeHTML(heroScreen.aspect)}">
      <div class="case-hero__copy">
        <span class="case-kicker">${escapeHTML(project.category)} · ${escapeHTML(project.year)}</span>
        <h1>${escapeHTML(project.name)}</h1>
        <p class="case-hero__subtitle">${escapeHTML(project.description)}</p>
        <div class="case-hero__actions">
          <a class="button button--primary" href="#application">${escapeHTML(ui.project.exploreBuild)} <span>↓</span></a>
          <a class="button button--ghost" href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer">${escapeHTML(ui.project.viewRepository)} ↗</a>
          ${demoAction}
        </div>
        <div class="case-quickstats">
          ${project.stats.map(stat => `
            <div class="case-quickstat">
              <strong>${escapeHTML(stat.value)}</strong>
              <span>${escapeHTML(stat.label)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="case-visual" aria-label="${escapeHTML(project.name)} ${escapeHTML(ui.project.interfacePreview)}">
        <figure class="case-device" data-float>
          <div class="case-browser-bar" aria-hidden="true"><i></i><i></i><i></i></div>
          <img src="${escapeHTML(heroScreen.src)}" alt="${escapeHTML(heroScreen.alt)}" width="1440" height="900" fetchpriority="high">
        </figure>
        ${secondScreen ? `
          <figure class="case-float case-float--left" data-float>
            <img src="${escapeHTML(secondScreen.src)}" alt="${escapeHTML(secondScreen.alt)}" width="1440" height="900" loading="lazy">
          </figure>
        ` : ''}
        ${thirdScreen ? `
          <figure class="case-float case-float--right" data-float>
            <img src="${escapeHTML(thirdScreen.src)}" alt="${escapeHTML(thirdScreen.alt)}" width="1440" height="900" loading="lazy">
          </figure>
        ` : ''}
      </div>
    </section>

    <section class="case-scroll" id="application" aria-label="${escapeHTML(ui.project.applicationReveal)}" style="--reveal-aspect:${escapeHTML((secondScreen || heroScreen).aspect)}">
      <div class="case-scroll__sticky">
        <div class="case-reveal-window" data-reveal-window>
          <img src="${escapeHTML((secondScreen || heroScreen).src)}" alt="${escapeHTML((secondScreen || heroScreen).alt)}" width="1440" height="900">
        </div>
        <div class="case-scroll__copy">
          <p>${escapeHTML(ui.project.revealPrefix)} <strong>${escapeHTML(ui.project.revealMiddle)}</strong> <em>${escapeHTML(project.subtitle)}.</em></p>
        </div>
      </div>
    </section>

    <section class="case-section case-features" id="features">
      <div class="case-section-title case-reveal-item">
        <div>
          <span class="section-heading__index">${escapeHTML(ui.project.insideIndex)}</span>
          <h2>${ui.project.insideTitle}</h2>
        </div>
        <p class="mini-label">${escapeHTML(project.contribution)}</p>
      </div>
      ${featureRows(project, ui)}
    </section>

    <section class="case-section" id="story">
      <div class="case-story-grid">
        <div class="sticky-copy case-reveal-item">
          <span class="section-heading__index">${escapeHTML(ui.project.thinkingIndex)}</span>
          <h2>${ui.project.thinkingTitle}</h2>
          <p>${escapeHTML(ui.project.thinkingBody)}</p>
        </div>
        <div class="story-panels">
          <article class="story-panel case-reveal-item">
            <span class="story-panel__index">${escapeHTML(ui.project.problemIndex)}</span>
            <h3>${escapeHTML(ui.project.problemTitle)}</h3>
            <p>${escapeHTML(project.problem)}</p>
          </article>
          <article class="story-panel case-reveal-item">
            <span class="story-panel__index">${escapeHTML(ui.project.approachIndex)}</span>
            <h3>${escapeHTML(ui.project.approachTitle)}</h3>
            <p>${escapeHTML(project.solution)}</p>
          </article>
          <article class="story-panel case-reveal-item">
            <span class="story-panel__index">${escapeHTML(ui.project.contributionIndex)}</span>
            <h3>${escapeHTML(ui.project.contributionTitle)}</h3>
            <p>${escapeHTML(project.contribution)}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="case-section" id="engineering">
      <div class="case-section-title case-reveal-item">
        <div>
          <span class="section-heading__index">${escapeHTML(ui.project.engineeringIndex)}</span>
          <h2>${ui.project.engineeringTitle}</h2>
        </div>
      </div>
      <div class="case-details-grid">
        <article class="detail-card case-reveal-item">
          <span class="section-heading__index">${escapeHTML(ui.project.capabilitiesIndex)}</span>
          <h3>${escapeHTML(ui.project.capabilitiesTitle)}</h3>
          <ul class="detail-list">
            ${project.features.slice(0, 6).map(feature => `<li>${escapeHTML(feature)}</li>`).join('')}
          </ul>
        </article>
        <article class="detail-card case-reveal-item">
          <span class="section-heading__index">${escapeHTML(ui.project.technicalIndex)}</span>
          <h3>${escapeHTML(ui.project.technicalTitle)}</h3>
          <ul class="detail-list">
            ${project.technicalDetails.map(detail => `<li>${escapeHTML(detail)}</li>`).join('')}
          </ul>
        </article>
      </div>
    </section>

    <section class="case-section stack-section" id="stack">
      <div class="case-section-title case-reveal-item">
        <div>
          <span class="section-heading__index">${escapeHTML(ui.project.stackIndex)}</span>
          <h2>${ui.project.stackTitle}</h2>
        </div>
      </div>
      <div class="stack-cloud">
        ${project.technologies.map(tech => `<span>${escapeHTML(tech)}</span>`).join('')}
      </div>
    </section>

    <section class="case-final" id="project-cta">
      <div class="case-final__card case-reveal-item">
        <figure class="case-final__image" style="--final-aspect:${escapeHTML(heroScreen.aspect)}">
          <img src="${escapeHTML(heroScreen.src)}" alt="${escapeHTML(heroScreen.alt)}" width="1440" height="900" loading="lazy">
        </figure>
        <span class="case-kicker">${escapeHTML(project.category)} · ${escapeHTML(project.year)}</span>
        <h2>${escapeHTML(project.name)}<br><em>${escapeHTML(project.subtitle)}</em></h2>
        <p>${escapeHTML(project.description)}</p>
        <div class="case-final__actions">
          <a class="button button--primary" href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer">${escapeHTML(ui.project.openRepository)} ↗</a>
          <a class="button button--ghost" href="index.html?lang=${encodeURIComponent(language)}#projects">${escapeHTML(ui.project.backToProjects)}</a>
          ${demoAction}
        </div>
      </div>
    </section>

    <nav class="case-next" aria-label="${escapeHTML(ui.project.nextProject)}">
      <span>${escapeHTML(ui.project.nextProject)} / ${escapeHTML(nextProject.category)}</span>
      <a href="projects.html?id=${encodeURIComponent(nextProject.id)}&amp;lang=${encodeURIComponent(language)}">
        ${escapeHTML(nextProject.name)}
        <b>↗</b>
      </a>
    </nav>
  `;

  document.body.style.setProperty('--project-accent', project.accent);
  document.body.style.setProperty('--project-accent-2', project.accentSecondary);
  const params = new URLSearchParams(window.location.search);
  if (params.get('id') !== project.id) {
    params.set('id', project.id);
    history.replaceState({}, '', `projects.html?${params.toString()}`);
  }
}

function setupChrome() {
  const header = document.querySelector('#site-header');
  const progress = document.querySelector('#scroll-progress');
  const update = () => {
    const top = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', top > 30);
    progress.style.width = `${height > 0 ? Math.min(100, (top / height) * 100) : 0}%`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function setupReveals() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.case-reveal-item').forEach(element => observer.observe(element));
}

function setupMotion() {
  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.from('.case-hero__copy > *', {
    y: 34,
    opacity: 0,
    duration: 0.95,
    stagger: 0.08,
    ease: 'power3.out',
  });

  window.gsap.from('.case-device', {
    y: 80,
    scale: 0.95,
    opacity: 0,
    duration: 1.2,
    delay: 0.25,
    ease: 'power3.out',
  });

  window.gsap.from('.case-float', {
    y: 55,
    opacity: 0,
    duration: 1,
    stagger: 0.14,
    delay: 0.65,
    ease: 'power3.out',
  });

  if (window.matchMedia('(min-width: 761px)').matches) {
    window.gsap.to('[data-reveal-window]', {
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      yPercent: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: '.case-scroll',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
      },
    });
  }

  window.gsap.utils.toArray('.feature-row').forEach(row => {
    window.gsap.from(row, {
      y: 55,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: row,
        start: 'top 82%',
      },
    });
  });
}

async function init() {
  try {
    document.body.classList.add('js-ready');
    const language = getLanguage();
    const [data, locale] = await Promise.all([
      loadProjects(),
      loadJSON(`data/i18n/${language}.json`),
    ]);
    const localizedProjects = localizeProjects(data.projects, locale.content?.projects);
    const project = findProject({ projects: localizedProjects });

    document.documentElement.lang = locale.htmlLang;
    applyStaticTranslations(locale.ui);
    setupLanguageSelector(language, locale.ui);
    renderProject(project, localizedProjects, locale.ui, language);

    const homeUrl = `index.html?lang=${encodeURIComponent(language)}`;
    document.querySelectorAll('.site-header .brand, .case-footer .brand').forEach(link => {
      link.href = homeUrl;
    });
    document.querySelector('.case-nav__back').href = `${homeUrl}#projects`;
    document.querySelector('.case-footer .back-to-top').href = `${homeUrl}#projects`;

    setupChrome();
    setupReveals();
    setupMotion();
    document.documentElement.dataset.ready = 'true';
  } catch (error) {
    console.error('Project presentation failed to load.', error);
    root.innerHTML = `
      <section class="case-section">
        <div class="case-section-title">
          <div>
            <span class="section-heading__index">Project data unavailable</span>
            <h2>The presentation could<br><em>not be loaded.</em></h2>
          </div>
        </div>
        <a class="button button--primary" href="index.html#projects">Return to projects</a>
      </section>
    `;
  }
}

init();
