// --- 1. ТРАНСЛЯЦИЯ (KZ/RU) ---
const translations = {
    kk: {
        audio_play: "Әуен",
        audio_stop: "Тоқтату",
        invitation_pre: "Ағайын-туыс, бауырлар, құда-жекжат, нағашылар, дос-жарандар, көршілер және әріптестер!",
        invitation_title: "Құрметті қонақтар!",
        invitation_main: "Сіздерді Балаларымыздың үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!",
        location_title: "Мекен-жайымыз",
        location_address: "Гайса Аязбаев көшесі, 18",
        btn_map: "Картадан ашу",
        dresscode_title: "Дресс-код және той түстері",
        dress_note: "Біз сіздерді дәл өздеріңіздей әдемі кешкі образда күтеміз!",
        timeline_title: "Той бағдарламасы",
        event_gathering: "Қонақтардың жиналуы",
        event_betashar: "Беташар",
        event_photos: "Фотосессия",
        event_start: "Тойдың басталуы",
        event_cake: "Торт",
        event_dance: "Билер",
        timer_title: "Тойға дейін қалды",
        unit_days: "Күн",
        unit_hours: "Сағат",
        unit_minutes: "Минут",
        unit_seconds: "Секунд",
        timer_ended: "Той басталды!",
        rsvp_title: "Қатысуды растау",
        rsvp_subtitle: "Өтінемін, 15.09.2026 дейін жауап беріңіз.",
        label_name: "Аты-жөніңіз",
        label_attendance: "Тойға келесіз бе?",
        opt_yes: "Қуана қатысамын",
        opt_plus: "Жұбыммен келемін",
        opt_no: "Қатыса алмаймын",
        btn_submit: "Жіберу",
        btn_sending: "Жіберілуде...",
        status_ok: "Рахмет! Сіздің жауабыңыз қабылданды.",
        status_error: "Қате кетті. Қайта көріңіз немесе бізге хабарласыңыз.",
        hosts_label: "Той иесі:",
        calendar_title: "Қыркүйек 2026",
        calendar_note: "Бұл күнді күнтізбеге белгілеп қойыңыздар!"
    }
};

let currentLang = 'kk';

// Language is fixed to Kazakh - no switching needed
function setLanguage(lang) {
    currentLang = 'kk';
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (translations['kk'][key]) {
            elem.innerText = translations['kk'][key];
        }
    });
    const nameLabel = document.querySelector('label[for="user-name"]');
    if (nameLabel) nameLabel.innerText = translations['kk'].label_name;
}

// --- 2. МУЗЫКАЛЬНЫЙ ПЛЕЕР ---
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');
let isPlaying = false;

if (bgMusic) {
    bgMusic.volume = 0.35; // Комфортная негромкая музыка
}

// Автовыключение музыки при сворачивании браузера или переключении вкладки
document.addEventListener("visibilitychange", () => {
    if (document.hidden && isPlaying && bgMusic) {
        bgMusic.pause();
        musicIcon.innerText = '🎵';
        musicText.innerText = translations[currentLang].audio_play;
        isPlaying = false;
    }
});

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.innerText = '🎵';
        musicText.innerText = translations[currentLang].audio_play;
    } else {
        bgMusic.volume = 0.35;
        bgMusic.play().catch(e => console.log("Auto-play blocked"));
        musicIcon.innerText = '⏸';
        musicText.innerText = translations[currentLang].audio_stop;
    }
    isPlaying = !isPlaying;
});

// --- 2.1 ОТКРЫТИЕ ШТОРКИ (WELCOME OVERLAY) ---
function openInvitation() {
    const overlay = document.getElementById('welcome-overlay');
    if (overlay) {
        overlay.classList.add('opened');
        
        // Автоматический запуск музыки при открытии
        if (bgMusic) {
            bgMusic.volume = 0.35;
            bgMusic.play().then(() => {
                isPlaying = true;
                musicIcon.innerText = '⏸';
                musicText.innerText = translations[currentLang].audio_stop;
            }).catch(e => console.log("Autoplay blocked or failed:", e));
        }
        
        // Разблокировка скролла
        document.body.classList.remove('scroll-locked');
        
        // Скрытие элемента из DOM после завершения анимации (3.5с)
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 3500);
    }
}

// --- 3. ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ---
// Целевая дата: 30 августа 2026 года, 17:00
const targetDate = new Date("Sep 26, 2026 18:00:00").getTime();

const timerUpdate = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(timerUpdate);
        document.getElementById("countdown").classList.add("hidden");
        document.getElementById("timer-ended").classList.remove("hidden");
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}, 1000);

// --- 4. АНИМАЦИЯ ПРИ СКРОЛЛЕ ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- 5. ОБРАБОТКА ФОРМЫ (GOOGLE SHEETS) ---
const rsvpForm = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');

// Подключенная ссылка Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfN_qa5t8Voduj5Zx4m6e0p5-mDvtgz-Dfk3QOPPjuVDu063VDjLj913CNcQaVKXO8RA/exec';

rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Блокируем кнопку UI
    submitBtn.disabled = true;
    btnText.innerText = translations[currentLang].btn_sending;

    const formData = new FormData(this);
    const surname = formData.get('surname') || '';
    const name = formData.get('name') || '';
    const count = formData.get('count') || '';

    const data = {
        lastName: surname,
        firstName: name,
        persons: count,
        attendance: count === "0" ? "Не приду" : "Приду (" + count + " чел.)",
        // Дублируем для обратной совместимости:
        surname: surname,
        name: name,
        count: count,
        timestamp: surname
    };

    // Формируем параметры в формате URLSearchParams (чтобы в Apps Script заполнился e.parameter)
    const params = new URLSearchParams();
    for (const key in data) {
        params.append(key, data[key]);
    }
    
    // Передаем параметры и в URL, и в теле POST-запроса (гарантия 100% получения в e.parameter)
    const requestUrl = GOOGLE_SCRIPT_URL + '?' + params.toString();

    fetch(requestUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(() => {
        // Поскольку mode: 'no-cors', мы не получим тело ответа, 
        // но успешное завершение fetch обычно означает, что запрос ушел.
        alert(translations[currentLang].status_ok);
        rsvpForm.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert(translations[currentLang].status_error);
    })
    .finally(() => {
        submitBtn.disabled = false;
        btnText.innerText = translations[currentLang].btn_submit;
    });
});

// --- 6. DRESSCODE COLOR PICKER ---
const colorSwatches = document.querySelectorAll('.color-swatch');
const dressFills = document.querySelectorAll('.dresscode-fill');

if (colorSwatches.length > 0) {
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Remove active from all
            colorSwatches.forEach(s => s.classList.remove('active'));
            // Add active to clicked
            swatch.classList.add('active');
            // Apply color to SVG fills
            const color = swatch.style.backgroundColor;
            dressFills.forEach(el => {
                el.style.fill = color;
            });
        });
    });
}