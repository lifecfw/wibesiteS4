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

function acceptTerms() {
    document.getElementById('terms-container').style.display = 'none';
    document.getElementById('activation-form-container').style.display = 'block';
}

async function submitActivation(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const webhookUrl = "https://discord.com/api/webhooks/1472223708109082748/jElEeidurQFeLI0OKAHaI-ZBxgEAkaenmCRTTo2vHqxf0FYye8dlQJVEYcfGtGO_4alP";
    
    const embed = {
        title: "طلب تفعيل جديد",
        color: 0x9333ea,
        fields: [
            { name: "يوزر الديسكورد", value: data.discord_user },
            { name: "يوزر روبلوكس", value: data.roblox_user },
            { name: "الاسم والعمر الحقيقي", value: data.real_info },
            { name: "اسم الشخصية الأول والأخير وتاريخ ميلادها والمنشئ واللغة الخاصه بالشخصية؟", value: data.char_info },
            { name: "ماهي قصة الشخصية؟ ( لاتقل عن 5 اسطر ولا تزيد عن 10 اسطر )", value: data.char_story },
            { name: "ماهي ايجابيات وسلبيات الشخصية من القصة؟", value: data.pros_cons },
            { name: "هل لديك خبرة سابقة في تقمص الشخصيات؟ اكتب عنها بالتفصيل", value: data.experience },
            { name: "ماهوا سبب رغبتك في دخول المدينة؟", value: data.reason },
            { name: "انت الان تحمل سلاح ناري توجهت لتبحث عن رهينة لتقوم بسطو مسلح على أحد المتاجر اكتشفت ان الشخص الذي اختطفته شخص ذو سلطة اجرامية في المدينة ماذا ستفعل في هذا الموقف؟", value: data.scenario_1 },
            { name: "بعد توجهك الى احدى الاحياء الخطيرة في المدينة وجدت سيارة مركونة في أحد الازقة وداخلها شحنة قد تكون مواد مخدرة ماذا ستفعل؟", value: data.scenario_2 },
            { name: "أنت تقوم بإصلاح سيارتك, قام شخص بسحب سلاحه خلفك وامرك برمي اغراضك وتسليم مفاتيح سيارتك. ماذا ستقول وماذا ستفعل في هذه الحالة؟", value: data.scenario_3 },
            { name: "يوم روتيني لك كسائق اجره اتصل عليك شخصين, الاول يحتاج توصيله من العمل الى منزله في احد الاحياء الفارهه بمبلغ 13$, اما الثاني يحتاج توصيله من ساندي شور الى احد الاحياء المشبوهة جنوب المدينة. ماذا ستختار ولماذا؟", value: data.scenario_4 }
        ],
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (response.ok) {
            alert("تم ارسال طلب تفعليك!!");
            form.reset();
            document.getElementById('terms-container').style.display = 'block';
            document.getElementById('activation-form-container').style.display = 'none';
            showSection('home');
        } else {
            alert("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("حدث خطأ في الاتصال.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial section based on hash
    const initialSection = window.location.hash.substring(1) || 'home';
    showSection(initialSection);
});
