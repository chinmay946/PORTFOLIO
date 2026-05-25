const typedPhrases = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB'];
const typedText = document.getElementById('typedText');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const loader = document.getElementById('loader');

let typedIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
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

window.addEventListener('scroll', () => {
  if (window.scrollY > 420) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  menuToggle.classList.toggle('open');
});

const navLinks = document.querySelectorAll('.nav a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }
  });
});

contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = 'Please fill in all fields.';
    formMessage.style.color = '#ff6b6b';
    return;
  }

  formMessage.textContent = 'Sending...';
  formMessage.style.color = '#7ddcff';

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
      formMessage.textContent = 'Message saved successfully!';
      formMessage.style.color = '#4fd8ff';
      contactForm.reset();
      setTimeout(() => {
        formMessage.textContent = '';
      }, 3000);
    } else {
      formMessage.textContent = data.error || 'Failed to send message.';
      formMessage.style.color = '#ff6b6b';
    }
  } catch (error) {
    console.error('Error:', error);
    formMessage.textContent = 'Network error. Please try again.';
    formMessage.style.color = '#ff6b6b';
  }
});

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500);
  }, 700);
});
