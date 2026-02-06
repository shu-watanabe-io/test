// グローバル変数
let breathingInterval;
let meditationInterval;
let meditationStartTime;
let meditationDuration;
let visualizationInterval;
let trainingData = [];

// DOM読み込み完了後の初期化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTabs();
    initBreathingExercise();
    initMeditation();
    initVisualization();
    initAffirmation();
    initTracker();
    loadTrainingData();
});

// ナビゲーション
function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // モバイルメニュートグル
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // スムーススクロール
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // モバイルメニューを閉じる
                navMenu.classList.remove('active');
            }
        });
    });
}

// タブ機能
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // すべてのタブをリセット
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 選択されたタブをアクティブに
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// 呼吸法エクササイズ
function initBreathingExercise() {
    const startButton = document.getElementById('startBreathing');
    const breathingCircle = document.getElementById('breathingCircle');
    const breathingText = document.getElementById('breathingText');
    const breathingCounter = document.getElementById('breathingCounter');

    startButton.addEventListener('click', () => {
        if (breathingInterval) {
            clearInterval(breathingInterval);
            breathingInterval = null;
            startButton.textContent = 'エクササイズを開始';
            breathingCircle.className = 'breathing-circle';
            breathingText.textContent = '準備';
            breathingCounter.textContent = '';
            return;
        }

        startButton.textContent = 'エクササイズを停止';
        let cycle = 0;
        let phase = 0;
        const phases = [
            { name: '吸う', duration: 4, class: 'inhale' },
            { name: '止める', duration: 7, class: 'hold' },
            { name: '吐く', duration: 8, class: 'exhale' }
        ];

        function breathingCycle() {
            if (cycle >= 4) {
                clearInterval(breathingInterval);
                breathingInterval = null;
                startButton.textContent = 'エクササイズを開始';
                breathingCircle.className = 'breathing-circle';
                breathingText.textContent = '完了！';
                breathingCounter.textContent = 'お疲れ様でした';
                return;
            }

            const currentPhase = phases[phase];
            breathingCircle.className = `breathing-circle ${currentPhase.class}`;
            breathingText.textContent = currentPhase.name;
            breathingCounter.textContent = `サイクル ${cycle + 1}/4`;

            phase++;
            if (phase >= phases.length) {
                phase = 0;
                cycle++;
            }
        }

        breathingCycle();
        breathingInterval = setInterval(breathingCycle, 4000);
    });
}

// 瞑想タイマー
function initMeditation() {
    const startButton = document.getElementById('startMeditation');
    const durationSelect = document.getElementById('meditationDuration');
    const timerDisplay = document.getElementById('timerDisplay');
    const progressBar = document.getElementById('progressBar');

    startButton.addEventListener('click', () => {
        if (meditationInterval) {
            clearInterval(meditationInterval);
            meditationInterval = null;
            startButton.textContent = '瞑想を開始';
            progressBar.style.width = '0%';
            const minutes = parseInt(durationSelect.value);
            timerDisplay.textContent = `${minutes}:00`;
            return;
        }

        meditationDuration = parseInt(durationSelect.value) * 60;
        meditationStartTime = Date.now();
        startButton.textContent = '瞑想を停止';

        meditationInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - meditationStartTime) / 1000);
            const remaining = meditationDuration - elapsed;

            if (remaining <= 0) {
                clearInterval(meditationInterval);
                meditationInterval = null;
                startButton.textContent = '瞑想を開始';
                timerDisplay.textContent = '完了！';
                progressBar.style.width = '100%';
                // 完了音を鳴らす（オプション）
                return;
            }

            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            const progress = (elapsed / meditationDuration) * 100;
            progressBar.style.width = `${progress}%`;
        }, 1000);
    });
}

// ビジュアライゼーション
function initVisualization() {
    const startButton = document.getElementById('startVisualization');
    const promptList = document.getElementById('promptList');
    
    const prompts = [
        'あなたは目標を達成した瞬間にいます...',
        '周りの景色や環境を詳しく感じてください...',
        'あなたの体の感覚に注意を向けてください...',
        '達成した時の喜びや満足感を味わってください...',
        'この成功があなたの人生にもたらす変化を感じてください...',
        'あなたはこの目標を達成する力を持っています...',
        'この感覚を心に刻み、日々の行動に活かしましょう...'
    ];

    let currentPromptIndex = 0;

    startButton.addEventListener('click', () => {
        if (visualizationInterval) {
            clearInterval(visualizationInterval);
            visualizationInterval = null;
            startButton.textContent = 'ガイドを開始';
            currentPromptIndex = 0;
            return;
        }

        startButton.textContent = 'ガイドを停止';
        currentPromptIndex = 0;
        
        function showNextPrompt() {
            if (currentPromptIndex >= prompts.length) {
                clearInterval(visualizationInterval);
                visualizationInterval = null;
                startButton.textContent = 'ガイドを開始';
                promptList.innerHTML = '<div class="prompt-card">ビジュアライゼーションが完了しました</div>';
                currentPromptIndex = 0;
                return;
            }

            promptList.innerHTML = `<div class="prompt-card">${prompts[currentPromptIndex]}</div>`;
            currentPromptIndex++;
        }

        showNextPrompt();
        visualizationInterval = setInterval(showNextPrompt, 8000);
    });
}

// アファメーション
function initAffirmation() {
    const affirmationText = document.getElementById('affirmationText');
    const nextButton = document.getElementById('nextAffirmation');
    
    const affirmations = [
        '私は価値ある存在です',
        '私は自分の人生をコントロールできます',
        '私は困難を乗り越える力を持っています',
        '私は毎日成長しています',
        '私は愛され、サポートされています',
        '私は自分の目標を達成できます',
        '私は平和で落ち着いた心を持っています',
        '私は自分を信じています',
        '私は前向きなエネルギーに満ちています',
        '私は健康で幸せです',
        '私は自分の感情をコントロールできます',
        '私は素晴らしい未来を創造しています'
    ];

    let currentIndex = 0;

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % affirmations.length;
        affirmationText.style.opacity = '0';
        
        setTimeout(() => {
            affirmationText.textContent = affirmations[currentIndex];
            affirmationText.style.opacity = '1';
        }, 300);
    });
}

// トラッカー機能
function initTracker() {
    const form = document.getElementById('trainingForm');
    const moodInput = document.getElementById('mood');
    const moodValue = document.getElementById('moodValue');

    // 気分スライダーの値表示
    moodInput.addEventListener('input', (e) => {
        moodValue.textContent = e.target.value;
    });

    // フォーム送信
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            id: Date.now(),
            date: new Date().toISOString(),
            exerciseType: document.getElementById('exerciseType').value,
            duration: parseInt(document.getElementById('duration').value),
            mood: parseInt(document.getElementById('mood').value),
            notes: document.getElementById('notes').value
        };

        trainingData.push(formData);
        saveTrainingData();
        updateStats();
        updateRecentSessions();
        
        // フォームをリセット
        form.reset();
        moodValue.textContent = '5';
        
        // 成功メッセージ
        alert('トレーニング記録を保存しました！');
    });
}

// ローカルストレージからデータを読み込み
function loadTrainingData() {
    const savedData = localStorage.getItem('mentalTrainingData');
    if (savedData) {
        trainingData = JSON.parse(savedData);
        updateStats();
        updateRecentSessions();
    }
}

// ローカルストレージにデータを保存
function saveTrainingData() {
    localStorage.setItem('mentalTrainingData', JSON.stringify(trainingData));
}

// 統計情報を更新
function updateStats() {
    // ユニークな日数を計算
    const uniqueDates = new Set(
        trainingData.map(item => new Date(item.date).toDateString())
    );
    document.getElementById('totalDays').textContent = uniqueDates.size;

    // 合計時間を計算
    const totalMinutes = trainingData.reduce((sum, item) => sum + item.duration, 0);
    document.getElementById('totalMinutes').textContent = totalMinutes;

    // 平均気分を計算
    if (trainingData.length > 0) {
        const avgMood = trainingData.reduce((sum, item) => sum + item.mood, 0) / trainingData.length;
        document.getElementById('avgMood').textContent = avgMood.toFixed(1);
    }
}

// 最近のセッションを表示
function updateRecentSessions() {
    const recentList = document.getElementById('recentList');
    
    if (trainingData.length === 0) {
        recentList.innerHTML = '<p class="empty-message">まだ記録がありません</p>';
        return;
    }

    // 最新5件を表示
    const recentSessions = trainingData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    recentList.innerHTML = recentSessions.map(session => {
        const date = new Date(session.date);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        return `
            <div class="session-item">
                <div class="session-header">
                    <span class="session-type">${session.exerciseType}</span>
                    <span class="session-date">${dateStr}</span>
                </div>
                <div class="session-details">
                    <span><i class="fas fa-clock"></i> ${session.duration}分</span>
                    <span><i class="fas fa-smile"></i> 気分: ${session.mood}/10</span>
                </div>
                ${session.notes ? `<p style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.875rem;">${session.notes}</p>` : ''}
            </div>
        `;
    }).join('');
}

// スムーススクロールのポリフィル
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = function(target) {
        const startPosition = window.pageYOffset;
        const targetPosition = target.getBoundingClientRect().top + startPosition;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const animation = function(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        const ease = function(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };
}

// ページ読み込み時のアニメーション
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// スクロールアニメーション（オプション）
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 観察対象の要素を追加
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.about-card, .technique-card, .exercise-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(el);
    });
});




const modal_mental_strong = document.getElementById("modal_mental_strong");
const openBtnMentalStrong = document.getElementById("openModalMentalStrong");
const closeBtnMentalStrong = document.getElementById("modal_mental_strong_close");

openBtnMentalStrong.onclick = () => {
	modal_mental_strong.classList.add("show");
};

closeBtnMentalStrong.onclick = () => {
	modal_mental_strong.classList.remove("show");
};

window.onclick = (e) => {
	if (e.target === modal_mental_strong) {
	  modal_mental_strong.classList.remove("show");
	}
	
	if (e.target === modal_mental_weak) {
	  modal_mental_weak.classList.remove("show");
	}
};


const modal_mental_weak = document.getElementById("modal_mental_weak");
const openBtnMentalWeak = document.getElementById("openModalMentalWeak");
const closeBtnMentalWeak = document.getElementById("modal_mental_weak");

openBtnMentalWeak.onclick = () => {
	modal_mental_weak.classList.add("show");
};

closeBtnMentalWeak.onclick = () => {
	modal_mental_weak.classList.remove("show");
};





