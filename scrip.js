function toggleRule(element) {
    element.classList.toggle('active');
}

function toggleCard(element) {
    element.classList.toggle('active');
}

function showSection(sectionId) {
    // Close mobile menu if open
    const nav = document.getElementById('main-nav');
    const btn = document.querySelector('.mobile-menu-btn');
    if (nav) nav.classList.remove('mobile-active');
    if (btn) btn.classList.remove('active');

    // Update active section
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find the link that was clicked and make it active
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });

    // Update URL hash without jumping
    // history.pushState(null, null, sectionId === 'home' ? '#' : '#' + sectionId);
    if (window.location.hash !== '') {
        history.replaceState(null, null, ' ');
    }
}

function toggleMobileMenu() {
    const nav = document.getElementById('main-nav');
    const btn = document.querySelector('.mobile-menu-btn');
    if (nav) nav.classList.toggle('mobile-active');
    if (btn) btn.classList.toggle('active');
}

// Handle browser back/forward
window.onpopstate = function() {
    // const hash = window.location.hash.substring(1) || 'home';
    // showSection(hash);
};

// Discord Avatar Fetching (Using Lanyard API or direct Discord CDN if possible)
// Note: For real-time updates without a backend, we can use a service like lanyard.rest or similar
async function fetchDiscordAvatar(userId) {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const data = await response.json();
        const imgElement = document.getElementById(`avatar-${userId}`);
        if (imgElement && data.success && data.data.discord_user.avatar) {
            const avatarHash = data.data.discord_user.avatar;
            const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=256`;
            imgElement.src = avatarUrl;
        } else if (imgElement) {
            // Fallback to default if Lanyard fails or no avatar
            imgElement.src = `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`;
        }
    } catch (error) {
        console.error("Error fetching avatar for", userId, error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial section based on hash
    const initialSection = window.location.hash.substring(1) || 'home';
    showSection(initialSection);
});
