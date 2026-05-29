const typedPhrases = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB'];
const typedText = document.getElementById('typedText');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const sections = document.querySelectorAll('main .section');
const navLinks = document.querySelectorAll('.nav a');

let typedIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Typewriter effect
function typeWriter() {
  if (!typedText) return;
  const current = typedPhrases[typedIndex];
  const fullText = isDeleting ? current.slice(0, charIndex - 1) : current.slice(0, charIndex + 1);
  typedText.textContent = fullText;

  if (!isDeleting && charIndex < current.length) {
    charIndex++;
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
  }

  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    setTimeout(typeWriter, 900);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typedIndex = (typedIndex + 1) % typedPhrases.length;
  }

  const delay = isDeleting ? 80 : 120;
  setTimeout(typeWriter, delay);
}

typeWriter();

// Project filter functionality
if (filterButtons.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      projectCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.style.display = matches ? 'grid' : 'none';
      });
    });
  });
}

const sectionIds = Array.from(sections).map(section => section.id || 'home');

function setActiveSection(targetId) {
  if (!targetId || !sectionIds.includes(targetId)) {
    targetId = 'home';
  }

  sections.forEach(section => {
    section.classList.toggle('active', section.id === targetId);
  });

  navLinks.forEach(link => {
    const linkTarget = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', linkTarget === targetId);
  });

  if (location.hash !== `#${targetId}`) {
    history.replaceState(null, '', `#${targetId}`);
  }
}

function initSectionNavigation() {
  const initialSection = window.location.hash.replace('#', '') || 'home';
  setActiveSection(initialSection);
}

initSectionNavigation();

// Mobile menu toggle
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active', isActive);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href') || '';
      const targetId = href.replace('#', '') || 'home';
      setActiveSection(targetId);
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (menuToggle && navMenu) {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  setActiveSection(hash);
});

// Contact form submission
if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      if (formMessage) {
        formMessage.textContent = 'Please fill in all fields.';
        formMessage.style.color = '#ff6b6b';
      }
      return;
    }

    if (formMessage) {
      formMessage.textContent = 'Sending...';
      formMessage.style.color = '#7ddcff';
    }

    try {
      const response = await fetch('https://portfolio-1-1p5v.onrender.com/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        if (formMessage) {
          formMessage.textContent = 'Message saved successfully!';
          formMessage.style.color = '#4fd8ff';
        }
        contactForm.reset();
        setTimeout(() => {
          if (formMessage) formMessage.textContent = '';
        }, 3000);
      } else {
        if (formMessage) {
          formMessage.textContent = data.error || 'Failed to send message.';
          formMessage.style.color = '#ff6b6b';
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (formMessage) {
        formMessage.textContent = 'Network error. Please try again.';
        formMessage.style.color = '#ff6b6b';
      }
    }
  });
}

// Prevent layout shift from scrollbar
window.addEventListener('load', () => {
  document.documentElement.style.scrollBehavior = 'smooth';
});
