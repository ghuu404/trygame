(function() {
'use strict';

/* ==================== 常量 ==================== */
var QUEUE_GROW_INTERVAL = 1 * 60 * 1000;   // 每 1 分钟 +1 人
var QUEUE_BASE_MAX = 20;
var QUEUE_VISIBLE = 6;                     // 屏幕上可见的排队人数（不含隐藏位）

/* 每个队列位置的视觉参数（透视效果） */
var POS_STYLES = [
    { x: 0,   y: -2,  scale: 1.00, opacity: 1.00, z: 100 },  /* 问诊位 */
    { x: 22,  y: -9,  scale: 0.76, opacity: 0.95, z: 90  },
    { x: 40,  y: -16, scale: 0.58, opacity: 0.88, z: 80  },
    { x: 56,  y: -22, scale: 0.44, opacity: 0.78, z: 70  },
    { x: 70,  y: -28, scale: 0.34, opacity: 0.68, z: 60  },
    { x: 82,  y: -33, scale: 0.26, opacity: 0.58, z: 55  },
    { x: 92,  y: -38, scale: 0.19, opacity: 0.00, z: 50  }   /* 隐藏位（入场用）*/
];

/* ==================== 医力门控 ==================== */
function getFormulaLimit() {
    var power = getPower();
    if (power <= 1000) return 20;
    if (power <= 2000) return 40;
    if (power <= 3000) return 60;
    return 999;
}
function getUsableFormulaCount() {
    return Math.min(getFormulaLimit(), FORMULAS.length);
}

/* ==================== 队列数据 ==================== */
var queueVisibleCount = 0;                 /* 逻辑队列人数（= diagQueueCount）*/
var formulaQueue = [];                     /* 按排队顺序预抽好的方子索引 */

/* ==================== 元素 ==================== */
var queueStage, symptomPanel, queueCountEl, optionBtns;
var powerText, coinText, coinGain, modalOverlay, modalBox;
var bound = false;

var state = null;              /* { formula, checked, attempts, phase } */
var waiting = false;
var currentPatientEl = null;   /* data-pos="0" 的病人元素 */

/* ==================== 初始化 ==================== */
function initDiagnose() {
    queueStage = document.getElementById('diagQueueStage');
    symptomPanel = document.getElementById('diagSymptomPanel');
    queueCountEl = document.getElementById('diagQueueCount');
    optionBtns = document.querySelectorAll('#diagOptionsBar .option-btn');
    powerText = document.getElementById('diagPowerText');
    coinText = document.getElementById('diagCoinText');
    coinGain = document.getElementById('diagCoinGain');
    modalOverlay = document.getElementById('diagModalOverlay');
    modalBox = document.getElementById('diagModalBox');

    if (!bound) {
        bindDiagnoseEvents();
        bound = true;
    }

    loadQueueCount();
    renderDiagTop();

    if (queueVisibleCount > 0) {
        hideNoPatient();
        fillQueue();
    } else {
        showNoPatient();
    }
}

function bindDiagnoseEvents() {
    document.getElementById('btnDiagBack').addEventListener('click', function() {
        window.switchPage('main');
    });
    document.getElementById('btnNoPatientBack').addEventListener('click', function() {
        window.switchPage('main');
    });

    for (var b = 0; b < optionBtns.length; b++) {
        (function(btn) {
            btn.addEventListener('click', function() { onOptionClick(btn); });
        })(optionBtns[b]);
    }
}

/* ==================== 队列人数（多少个人在等） ==================== */
function getQueueMax() {
    var powerInt = Math.floor(getPower());
    return QUEUE_BASE_MAX + Math.floor(powerInt / 1000) * 10;
}

function loadQueueCount() {
    var now = Date.now();
    var savedCount = localStorage.getItem('queueCount');
    var savedTime = localStorage.getItem('queueTime');
    if (savedCount === null) {
        queueVisibleCount = 6 + Math.floor(Math.random() * 4);
        localStorage.setItem('queueCount', String(queueVisibleCount));
        localStorage.setItem('queueTime', String(now));
        return;
    }
    queueVisibleCount = parseInt(savedCount);
    var lastTime = parseInt(savedTime) || now;
    var elapsed = now - lastTime;
    var max = getQueueMax();
    var gained = Math.floor(elapsed / QUEUE_GROW_INTERVAL);
    if (gained > 0 && queueVisibleCount < max) {
        queueVisibleCount = Math.min(max, queueVisibleCount + gained);
        var remainder = elapsed % QUEUE_GROW_INTERVAL;
        localStorage.setItem('queueTime', String(now - remainder));
    }
    if (queueVisibleCount > max) queueVisibleCount = max;
    localStorage.setItem('queueCount', String(queueVisibleCount));
}

function saveQueueCount() {
    localStorage.setItem('queueCount', String(queueVisibleCount));
    localStorage.setItem('queueTime', String(Date.now()));
}

/* ==================== 方子池（按当前可用范围洗牌） ==================== */
function loadPool() {
    try {
        var p = JSON.parse(localStorage.getItem('formulaPool') || 'null');
        if (Array.isArray(p)) return p;
    } catch(e) {}
    return null;
}
function savePool(pool) { localStorage.setItem('formulaPool', JSON.stringify(pool)); }
function shuffleArray(arr) {
    for (var j = arr.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var t = arr[j]; arr[j] = arr[k]; arr[k] = t;
    }
    return arr;
}
function reshufflePool(limit) {
    var arr = [];
    for (var i = 0; i < limit; i++) arr.push(i);
    shuffleArray(arr);
    savePool(arr);
    return arr;
}
function pickNextFormulaIndex() {
    var limit = getUsableFormulaCount();
    var savedLimit = parseInt(localStorage.getItem('formulaPoolLimit') || '0', 10);
    var pool = loadPool();
    if (!pool || pool.length === 0 || savedLimit !== limit) {
        pool = reshufflePool(limit);
        localStorage.setItem('formulaPoolLimit', String(limit));
    }
    var idx = pool.shift();
    var lastIdx = parseInt(localStorage.getItem('lastFormulaIdx') || '-1');
    if (idx === lastIdx && pool.length > 0) {
        var t = idx;
        idx = pool.shift();
        pool.push(t);
        shuffleArray(pool);
    }
    savePool(pool);
    localStorage.setItem('lastFormulaIdx', String(idx));
    return idx;
}

/* ==================== 队列渲染 ==================== */
function ensureFormulaQueue() {
    while (formulaQueue.length < QUEUE_VISIBLE + 1) {
        formulaQueue.push(pickNextFormulaIndex());
    }
}

function applyPos(el, pos) {
    var s = POS_STYLES[pos] || POS_STYLES[POS_STYLES.length - 1];
    var tf = 'translateX(-50%) translate(' + s.x + 'px, ' + s.y + 'vh) scale(' + s.scale + ')';
    el.style.webkitTransform = tf;
    el.style.transform = tf;
    el.style.opacity = String(s.opacity);
    el.style.zIndex = String(s.z);
    el.setAttribute('data-pos', String(pos));
}

function addHitAreas(parent) {
    var parts = [
        { part: 'head',  cls: 'hit-head'  },
        { part: 'chest', cls: 'hit-chest' },
        { part: 'belly', cls: 'hit-belly' },
        { part: 'limbs', cls: 'hit-limbs' },
        { part: 'pulse', cls: 'hit-pulse' }
    ];
    for (var k = 0; k < parts.length; k++) {
        (function(p) {
            var el = document.createElement('div');
            el.className = 'hit-area ' + p.cls;
            el.setAttribute('data-part', p.part);
            el.addEventListener('click', function(ev) {
                ev.stopPropagation();
                onPartClick(p.part, el);
            });
            parent.appendChild(el);
        })(parts[k]);
    }
}

function buildQueuePerson(formulaIdx, pos) {
    var formula = FORMULAS[formulaIdx];
    var div = document.createElement('div');
    div.className = 'queue-person';

    var img = document.createElement('img');
    img.className = 'patient-img';
    img.alt = '';
    img.addEventListener('error', function() { this.style.display = 'none'; });
    img.src = formula.patient || '';
    div.appendChild(img);

    if (pos === 0) addHitAreas(div);

    applyPos(div, pos);
    return div;
}

/* 从空开始填充整个队列（初始化用） */
function fillQueue() {
    queueStage.innerHTML = '';
    formulaQueue = [];
    ensureFormulaQueue();

    var created = [];
    for (var i = QUEUE_VISIBLE - 1; i >= 0; i--) {
        var person = buildQueuePerson(formulaQueue[i], i);
        person.style.transition = 'none';
        person.style.webkitTransition = 'none';
        queueStage.appendChild(person);
        created.push(person);
    }
    requestAnimationFrame(function() {
        created.forEach(function(p) {
            p.style.transition = '';
            p.style.webkitTransition = '';
        });
    });

    currentPatientEl = queueStage.querySelector('.queue-person[data-pos="0"]');

    state = {
        formula: FORMULAS[formulaQueue[0]],
        checked: { head: false, chest: false, belly: false, limbs: false, pulse: false },
        attempts: 0,
        phase: 'look'
    };
    resetUI();
}

/* 队首走人 + 全队列前移 + 队尾补人 */
function advanceQueue() {
    var first = queueStage.querySelector('.queue-person[data-pos="0"]');
    if (first) {
        first.setAttribute('data-pos', 'exit');
        var tfExit = 'translateX(-280%) translateY(18vh) scale(0.55)';
        first.style.webkitTransition = '-webkit-transform 0.65s cubic-bezier(0.55, 0, 0.5, 1), opacity 0.5s ease';
        first.style.transition = 'transform 0.65s cubic-bezier(0.55, 0, 0.5, 1), opacity 0.5s ease';
        first.style.webkitTransform = tfExit;
        first.style.transform = tfExit;
        first.style.opacity = '0';
        first.style.zIndex = '250';
        first.style.pointerEvents = 'none';
        setTimeout(function() { if (first.parentNode) first.parentNode.removeChild(first); }, 700);
    }

    formulaQueue.shift();
    ensureFormulaQueue();

    var moving = queueStage.querySelectorAll('.queue-person:not([data-pos="exit"])');
    for (var i = 0; i < moving.length; i++) {
        var p = moving[i];
        var cur = parseInt(p.getAttribute('data-pos'), 10);
        if (isNaN(cur) || cur < 1) continue;
        var next = cur - 1;

        var img = p.querySelector('img');
        if (img) img.src = FORMULAS[formulaQueue[next]].patient || '';

        if (next === 0) addHitAreas(p);
        applyPos(p, next);
    }

    var tailPos = QUEUE_VISIBLE - 1;
    var newPerson = buildQueuePerson(formulaQueue[tailPos], tailPos + 1);
    newPerson.style.transition = 'none';
    newPerson.style.webkitTransition = 'none';
    queueStage.appendChild(newPerson);
    requestAnimationFrame(function() {
        newPerson.style.transition = '';
        newPerson.style.webkitTransition = '';
        applyPos(newPerson, tailPos);
    });

    currentPatientEl = queueStage.querySelector('.queue-person[data-pos="0"]');
    state = {
        formula: FORMULAS[formulaQueue[0]],
        checked: { head: false, chest: false, belly: false, limbs: false, pulse: false },
        attempts: 0,
        phase: 'look'
    };
    resetUI();
}

function resetUI() {
    symptomPanel.innerHTML = '<span class="placeholder">先点击病人的头、胸、腹、腿进行望诊...</span>';

    var limit = getUsableFormulaCount();
    var idx = formulaQueue[0];
    var pool = [];
    for (var i = 0; i < limit; i++) {
        if (i !== idx) pool.push(FORMULAS[i].name);
    }
    shuffleArray(pool);
    var options = [FORMULAS[idx].name, pool[0], pool[1]];
    shuffleArray(options);

    for (var p = 0; p < optionBtns.length; p++) {
        optionBtns[p].textContent = options[p];
        optionBtns[p].disabled = false;
        optionBtns[p].className = 'option-btn';
    }
    waiting = false;
}

/* ==================== 顶部信息 ==================== */
function renderDiagTop() {
    if (powerText) powerText.textContent = Math.floor(getPower());
    if (coinText) coinText.textContent = getCoins();
    if (queueCountEl) queueCountEl.textContent = queueVisibleCount;

    /* ★ 新增：更新称号 */
    var nameEl = document.getElementById('diagPlayerName');
    if (nameEl && typeof window.getRankName === 'function') {
        nameEl.textContent = window.getRankName(getPower());
    }
}
window.renderDiagTop = renderDiagTop;

/* ==================== 望诊交互 ==================== */
function isLookDone() {
    var c = state.checked;
    return c.head && c.chest && c.belly && c.limbs;
}

function onPartClick(part, el) {
    if (!state) return;
    if (state.checked[part]) return;
    if (part === 'pulse' && state.phase === 'look') {
        showDiagToast('请先完成望诊');
        return;
    }
    state.checked[part] = true;
    el.classList.add('checked');

    if (!currentPatientEl) return;

    var oldHints = currentPatientEl.querySelectorAll('.hint');
    for (var i = 0; i < oldHints.length; i++) {
        if (oldHints[i].getAttribute('data-part') === part) oldHints[i].remove();
    }

    var symptoms = state.formula.s[part] || [];
    var hint = document.createElement('div');
    hint.className = 'hint ' + part + '-hint';
    hint.setAttribute('data-part', part);
    if (symptoms.length === 0) {
        hint.textContent = '（无异常）';
        hint.style.color = '#999';
        hint.style.borderColor = '#ccc';
    } else {
        hint.textContent = symptoms.join('、');
    }
    currentPatientEl.appendChild(hint);

    if (symptoms.length > 0) {
        var ph = symptomPanel.querySelector('.placeholder');
        if (ph) symptomPanel.innerHTML = '';
        for (var j = 0; j < symptoms.length; j++) {
            var span = document.createElement('span');
            span.className = 'sym-item' + (part === 'pulse' ? ' sym-pulse' : '');
            span.textContent = symptoms[j];
            symptomPanel.appendChild(span);
        }
    }

    if (part !== 'pulse' && state.phase === 'look' && isLookDone()) {
        var p = getPower() + 10;
        localStorage.setItem('power', String(p));
        renderDiagTop();
        setTimeout(enterSpeakPhase, 150);
    }

    if (part === 'pulse') {
        state.phase = 'choose';
        var pEl = currentPatientEl.querySelector('.hit-pulse');
        if (pEl) pEl.classList.remove('hint-glow');
        symptomPanel.scrollTop = symptomPanel.scrollHeight;
    }
}

function enterSpeakPhase() {
    state.phase = 'speak';
    if (currentPatientEl) {
        var old = currentPatientEl.querySelector('.speak-bubble');
        if (old) old.remove();
        var bubble = document.createElement('div');
        bubble.className = 'speak-bubble';
        bubble.textContent = '「' + state.formula.speak + '」';
        currentPatientEl.appendChild(bubble);

        var pulseEl = currentPatientEl.querySelector('.hit-pulse');
        if (pulseEl) pulseEl.classList.add('hint-glow');
    }
}

/* ==================== 选方交互 ==================== */
function onOptionClick(btn) {
    if (btn.disabled) return;
    if (!state) return;
    if (waiting) return;
    if (state.attempts >= 2) return;

    if (state.phase === 'look') { showDiagToast('请先完成望诊'); return; }
    if (state.phase === 'speak') { showDiagToast('请先完成切诊'); return; }
    if (state.phase !== 'choose') { showDiagToast('请先完成诊断'); return; }

    var chosen = btn.textContent;
    var correct = state.formula.name;

    if (chosen === correct) {
        btn.classList.add('correct');
        for (var i = 0; i < optionBtns.length; i++) optionBtns[i].disabled = true;
        addCoins(10);
        localStorage.setItem('power', String(getPower() + 20));
        renderDiagTop();
        showCoinGain(10);
        waiting = true;
        setTimeout(function() { nextPatient(); }, 500);
    } else {
        state.attempts++;
        btn.classList.add('wrong');
        btn.disabled = true;

        if (state.attempts >= 2) {
            for (var j = 0; j < optionBtns.length; j++) {
                optionBtns[j].disabled = true;
                if (optionBtns[j].textContent === correct) optionBtns[j].classList.add('correct');
            }
            waiting = true;
            setTimeout(function() {
                showDiagModal('病人生气了！',
                    '两次都诊断错误，病人生气离开。<br>正确方证是：<b>' + correct + '</b>',
                    '下一位病人',
                    function() { closeDiagModal(); nextPatient(); });
            }, 500);
        } else {
            showDiagModal('诊断有误',
                '您还有 <b>1 次</b> 机会，请再仔细看症状，选择正确的方证。',
                '再试一次',
                function() { closeDiagModal(); });
        }
    }
}

function nextPatient() {
    queueVisibleCount = Math.max(0, queueVisibleCount - 1);
    if (queueCountEl) queueCountEl.textContent = queueVisibleCount;
    saveQueueCount();

    if (queueVisibleCount <= 0) {
        var first = queueStage.querySelector('.queue-person[data-pos="0"]');
        if (first) {
            first.setAttribute('data-pos', 'exit');
            var tfExit = 'translateX(-280%) translateY(18vh) scale(0.55)';
            first.style.webkitTransition = '-webkit-transform 0.65s ease, opacity 0.5s ease';
            first.style.transition = 'transform 0.65s ease, opacity 0.5s ease';
            first.style.webkitTransform = tfExit;
            first.style.transform = tfExit;
            first.style.opacity = '0';
            first.style.pointerEvents = 'none';
        }
        setTimeout(function() {
            queueStage.innerHTML = '';
            showNoPatient();
        }, 700);
        return;
    }

    advanceQueue();
}

/* ==================== 无病人遮罩 ==================== */
function showNoPatient() {
    document.getElementById('diagNoPatient').classList.add('active');
    symptomPanel.style.display = 'none';
    document.getElementById('diagOptionsBar').style.display = 'none';
}
function hideNoPatient() {
    document.getElementById('diagNoPatient').classList.remove('active');
    symptomPanel.style.display = '';
    document.getElementById('diagOptionsBar').style.display = '';
}

/* ==================== 提示 / 弹窗 ==================== */
function showDiagToast(msg) {
    var el = document.getElementById('diagToast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'diagToast';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(function() { el.classList.remove('show'); }, 1500);
}

function showCoinGain(n) {
    if (!coinGain) return;
    coinGain.textContent = '+' + n;
    coinGain.classList.remove('show');
    void coinGain.offsetWidth;
    coinGain.classList.add('show');
    setTimeout(function() { coinGain.classList.remove('show'); }, 1200);
}

function showDiagModal(title, html, btnText, callback) {
    modalBox.innerHTML =
        '<div class="modal-title">' + title + '</div>' +
        '<div class="modal-text">' + html + '</div>' +
        '<button class="modal-btn" id="diagModalBtn">' + btnText + '</button>';
    modalOverlay.classList.add('active');
    document.getElementById('diagModalBtn').addEventListener('click', callback);
}

function closeDiagModal() { modalOverlay.classList.remove('active'); }

/* ==================== 暴露给 main.js ==================== */
window.initDiagnose = initDiagnose;

})();