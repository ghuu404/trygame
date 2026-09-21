(function() {
'use strict';

/* ==================== 常量 ==================== */
var MAX_STAMINA = 5;
var STAMINA_RECOVER_MS = 10 * 60 * 1000;
var SLOT_MAX = 7;
var TARGET_GROUPS = 6;
var CARDS_PER_HERB = 6;

/* ==================== 药材池 ==================== */
var AREAS = {
    forest: {
        name: '丛林',
        bg: 'images/forest-bg.webp',
        herbs: ['桂枝','茯苓','葛根','黄连','人参','细辛','厚朴','枳实','猪苓']
    },
    mountain: {
        name: '山地',
        bg: 'images/mountain-bg.webp',
        herbs: ['麻黄','山杏','柴胡','黄芩','知母','附子','白术','大黄','当归','五味子','石膏','芒硝']
    },
    field: {
        name: '田野',
        bg: 'images/field-bg.webp',
        herbs: ['芍药','甘草','生姜','大枣','半夏','茵陈','泽泻','栀子','通草','粳米']
    }
};
var AREA_WEEDS = {
    forest:   ['杂草','枯枝','落叶'],
    mountain: ['碎石','枯草','荆棘','岩苔'],
    field:    ['野蒿','烂草','稻茬','野花']
};

/* ==================== 仓库/体力/铜币 ==================== */
function getWarehouse() {
    try {
        return JSON.parse(localStorage.getItem('warehouse')) ||
            { herbs: {}, seeds: {}, materials: {}, processed: {} };
    } catch(e) {
        return { herbs: {}, seeds: {}, materials: {}, processed: {} };
    }
}
function saveWarehouse(w) { localStorage.setItem('warehouse', JSON.stringify(w)); }
function addHerb(name, count) {
    var w = getWarehouse();
    w.herbs[name] = (w.herbs[name] || 0) + count;
    saveWarehouse(w);
}
function getStamina() {
    var now = Date.now();
    var stamina = parseInt(localStorage.getItem('stamina') || MAX_STAMINA);
    var lastTime = parseInt(localStorage.getItem('staminaTime') || now);
    if (stamina >= MAX_STAMINA) {
        localStorage.setItem('staminaTime', String(now));
        localStorage.setItem('stamina', String(MAX_STAMINA));
        return MAX_STAMINA;
    }
    var elapsed = now - lastTime;
    if (elapsed >= STAMINA_RECOVER_MS) {
        var gained = Math.floor(elapsed / STAMINA_RECOVER_MS);
        stamina = Math.min(MAX_STAMINA, stamina + gained);
        var remainder = elapsed % STAMINA_RECOVER_MS;
        localStorage.setItem('staminaTime', String(now - remainder));
    }
    localStorage.setItem('stamina', String(stamina));
    return stamina;
}
function setStamina(v) {
    v = Math.max(0, Math.min(v, MAX_STAMINA));
    localStorage.setItem('stamina', String(v));
    localStorage.setItem('staminaTime', String(Date.now()));
}
function getCoins() { return parseInt(localStorage.getItem('coins') || 0); }

/* ==================== 元素 ==================== */
var cardAreaEl, slotBarEl, startModalEl;
var staminaTextEl, coinTextEl, groupTextEl, startStaminaEl;
var modalOverlayEl, modalBoxEl;
var collectBound = false;

var slot = [];
var allCards = [];
var collectedGroups = 0;
var gameActive = false;
var currentArea = 'forest';

/* ==================== 初始化 ==================== */
function initCollect() {
    cardAreaEl = document.getElementById('collectCardArea');
    slotBarEl = document.getElementById('collectSlotBar');
    startModalEl = document.getElementById('collectStartModal');
    staminaTextEl = document.getElementById('collectStaminaText');
    coinTextEl = document.getElementById('collectCoinText');
    groupTextEl = document.getElementById('collectGroupText');
    startStaminaEl = document.getElementById('collectStartStamina');
    modalOverlayEl = document.getElementById('collectModalOverlay');
    modalBoxEl = document.getElementById('collectModalBox');

    if (!collectBound) {
        bindCollectEvents();
        collectBound = true;
    }
    applyAreaBackground();
    renderCollectTop();
    openCollectStartModal();
}

function renderCollectTop() {
    if (staminaTextEl) staminaTextEl.textContent = getStamina();
    if (coinTextEl) coinTextEl.textContent = getCoins();
    if (groupTextEl) groupTextEl.textContent = collectedGroups;
}

function applyAreaBackground() {
    var bg = AREAS[currentArea].bg;
    var page = document.getElementById('page-collect');
    if (page) page.style.backgroundImage = 'url("' + bg + '")';
}

/* ==================== 事件绑定 ==================== */
function bindCollectEvents() {
    // 返回
    document.getElementById('collectBack').addEventListener('click', function() {
        window.switchPage('main');
    });
    document.getElementById('btnCollectBackStart').addEventListener('click', function() {
        startModalEl.classList.remove('active');
        window.switchPage('main');
    });

    // 开始
    document.getElementById('btnCollectStart').addEventListener('click', function() {
        startModalEl.classList.remove('active');
        tryStart();
    });

    // 区域
    var areaBtns = document.querySelectorAll('#collectAreaBar .area-btn');
    for (var i = 0; i < areaBtns.length; i++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                switchArea(btn.getAttribute('data-area'));
            });
        })(areaBtns[i]);
    }

    // 底部按钮
    document.getElementById('btnCollectBook').addEventListener('click', showBook);
    document.getElementById('btnCollectHint').addEventListener('click', showHint);
    document.getElementById('btnCollectShuffle').addEventListener('click', shuffleCards);
}

/* ==================== 游戏流程 ==================== */
function openCollectStartModal() {
    if (startStaminaEl) startStaminaEl.textContent = getStamina();
    if (startModalEl) startModalEl.classList.add('active');
}

function switchArea(area) {
    if (currentArea === area) return;
    currentArea = area;
    var btns = document.querySelectorAll('#collectAreaBar .area-btn');
    for (var i = 0; i < btns.length; i++) {
        if (btns[i].getAttribute('data-area') === area) btns[i].classList.add('active');
        else btns[i].classList.remove('active');
    }
    applyAreaBackground();
    if (gameActive) {
        gameActive = false;
        slot = [];
        collectedGroups = 0;
        renderCollectTop();
        renderSlot();
        cardAreaEl.innerHTML = '';
        allCards = [];
        showCollectToast('切换至' + AREAS[area].name + '，已重置本局', 'good');
    }
    openCollectStartModal();
}

function tryStart() {
    var s = getStamina();
    if (s < 1) {
        showCollectToast('体力不足，休息一会儿吧', 'bad');
        return;
    }
    setStamina(s - 1);
    renderCollectTop();
    slot = [];
    collectedGroups = 0;
    gameActive = true;
    renderCollectTop();
    renderSlot();
    var list = generateCardList();
    setTimeout(function() { layoutCards(list); }, 20);
}

function isWeed(name) {
    for (var k in AREA_WEEDS) {
        if (AREA_WEEDS[k].indexOf(name) !== -1) return true;
    }
    return false;
}

function generateCardList() {
    var herbs = AREAS[currentArea].herbs;
    var list = [];
    for (var i = 0; i < herbs.length; i++) {
        for (var j = 0; j < CARDS_PER_HERB; j++) list.push(herbs[i]);
    }

    /* 用本区域的杂草池，数量按药材数算（9→3、12→4、10→4） */
    var pool = AREA_WEEDS[currentArea].slice();
    var weedTypes = Math.min(Math.ceil(herbs.length / 3), pool.length);

    /* 从池子里随机抽 weedTypes 种，避免每次都固定出同几样 */
    for (var w = pool.length - 1; w > 0; w--) {
        var r = Math.floor(Math.random() * (w + 1));
        var tmp = pool[w]; pool[w] = pool[r]; pool[r] = tmp;
    }

    for (var k = 0; k < weedTypes; k++) {
        var weedName = pool[k];
        for (var m = 0; m < CARDS_PER_HERB; m++) list.push(weedName);
    }

    /* 整体洗牌 */
    for (var p = list.length - 1; p > 0; p--) {
        var q = Math.floor(Math.random() * (p + 1));
        var t = list[p]; list[p] = list[q]; list[q] = t;
    }
    return list;
}

function layoutCards(cardList) {
    cardAreaEl.innerHTML = '';
    allCards = [];
    var w = cardAreaEl.clientWidth;
    var h = cardAreaEl.clientHeight;
    var cw = 42, ch = 52;
    for (var i = 0; i < cardList.length; i++) {
        var el = document.createElement('div');
        el.className = 'collect-card';
        var name = cardList[i];
        var img = document.createElement('img');
        img.src = 'images/herbs/' + name + '.webp';
        img.addEventListener('error', function() { this.style.display = 'none'; });
        el.appendChild(img);
        var x = Math.random() * (w - cw);
        var y = Math.random() * (h - ch);
        var z = Math.floor(Math.random() * 999) + 1;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.zIndex = z;
        (function(e, n) {
            e.addEventListener('click', function() {
                if (!e.classList.contains('blocked')) clickCard(e, n);
            });
        })(el, name);
        cardAreaEl.appendChild(el);
        allCards.push({ el: el, x: x, y: y, z: z, name: name });
    }
    updateBlocked();
}

function updateBlocked() {
    for (var i = 0; i < allCards.length; i++) allCards[i].el.classList.remove('blocked');
    for (var a = 0; a < allCards.length; a++) {
        var A = allCards[a];
        if (A.el.style.opacity === '0') continue;
        for (var b = 0; b < allCards.length; b++) {
            if (a === b) continue;
            var B = allCards[b];
            if (B.el.style.opacity === '0') continue;
            if (B.z > A.z && overlap(A, B)) {
                A.el.classList.add('blocked');
                break;
            }
        }
    }
}

function overlap(a, b) {
    var aw = 42, ah = 52;
    var ox = Math.max(0, Math.min(a.x + aw, b.x + aw) - Math.max(a.x, b.x));
    var oy = Math.max(0, Math.min(a.y + ah, b.y + ah) - Math.max(a.y, b.y));
    return (ox * oy) > (aw * ah * 0.25);
}

function clickCard(el, name) {
    if (!gameActive) return;
    if (slot.length >= SLOT_MAX) {
        showCollectToast('卡槽已满，整理一下', 'bad');
        return;
    }
    if (window.playSound) window.playSound('click');
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    setTimeout(function() { updateBlocked(); }, 250);
    slot.push(name);
    renderSlot();
    checkMatch();
}

function checkMatch() {
    var counts = {};
    for (var i = 0; i < slot.length; i++) {
        counts[slot[i]] = (counts[slot[i]] || 0) + 1;
    }
    for (var name in counts) {
        if (counts[name] >= 3) {
            var removed = 0;
            slot = slot.filter(function(n) {
                if (n === name && removed < 3) { removed++; return false; }
                return true;
            });
            renderSlot();
            if (isWeed(name)) {
                if (window.playSound) window.playSound('fail');
                showCollectToast('这是杂草，扔掉了', 'bad');
                return;
            }
            addHerb(name, 3);
            if (window.playSound) window.playSound('pick');
            collectedGroups++;
            renderCollectTop();
            showCollectToast('采得 ' + name + ' ×3', 'good');
            setTimeout(checkWin, 350);
            return;
        }
    }
}

function checkWin() {
    if (collectedGroups >= TARGET_GROUPS) {
        gameActive = false;
        if (window.playSound) window.playSound('success'); 
        showCollectModal(
            '🎉 收获满满！',
            '本局收集了 ' + collectedGroups + ' 组药材<br>是否继续采药？<br><span style="color:#8b5e3c;">继续将消耗 1 点体力</span>',
            [
                { text: '继续采药（⚡1）', callback: function() { closeCollectModal(); tryStart(); } },
                { text: '返回主页', secondary: true, callback: function() { window.switchPage('main'); } }
            ]
        );
    }
}

function renderSlot() {
    slotBarEl.innerHTML = '';
    for (var i = 0; i < SLOT_MAX; i++) {
        var s = document.createElement('div');
        s.className = 'collect-slot';
        if (i < slot.length) {
            var img = document.createElement('img');
            img.src = 'images/herbs/' + slot[i] + '.webp';
            img.addEventListener('error', function() { this.style.display = 'none'; });
            s.appendChild(img);
        } else {
            s.classList.add('empty');
        }
        slotBarEl.appendChild(s);
    }
}

function shuffleCards() {
    if (!gameActive) return;
    var w = cardAreaEl.clientWidth;
    var h = cardAreaEl.clientHeight;
    var cw = 42, ch = 52;
    for (var i = 0; i < allCards.length; i++) {
        var A = allCards[i];
        if (A.el.style.opacity === '0') continue;
        var x = Math.random() * (w - cw);
        var y = Math.random() * (h - ch);
        var z = Math.floor(Math.random() * 999) + 1;
        A.x = x; A.y = y; A.z = z;
        A.el.style.left = x + 'px';
        A.el.style.top = y + 'px';
        A.el.style.zIndex = z;
    }
    updateBlocked();
    showCollectToast('卡片已重新打乱', 'good');
}

/* ==================== 药书 / 提示 ==================== */
function showBook() {
    var herbs = AREAS[currentArea].herbs;
    var html = '<div style="font-size:13px;color:#8b5e3c;margin-bottom:6px;">当前区域：' + AREAS[currentArea].name + '</div>';
    html += '<div id="collectBookGrid">';
    for (var i = 0; i < herbs.length; i++) {
        var n = herbs[i];
        html += '<div class="collect-book-item">' +
            '<img class="auto-hide" src="images/herbs/' + n + '.webp">' +
            '<div class="cb-name">' + n + '</div></div>';
    }
    html += '</div>';
    showCollectModal('📖 中药图鉴', html, [
        { text: '关闭', secondary: true, callback: closeCollectModal }
    ]);
    /* 渲染完后统一绑定 */
    window.bindImgFallback(document.getElementById('collectBookGrid'));
}
function showHint() {
    var counts = {};
    for (var i = 0; i < slot.length; i++) counts[slot[i]] = (counts[slot[i]] || 0) + 1;
    var bestName = null, bestCount = 0;
    for (var name in counts) {
        if (!isWeed(name) && counts[name] > bestCount) {
            bestCount = counts[name]; bestName = name;
        }
    }
    var msg = bestName
        ? '你卡槽里有 ' + bestCount + ' 个「' + bestName + '」<br>再找 ' + (3 - bestCount) + ' 个即可消除'
        : '卡槽为空，试试点击卡片开始采集吧';
    showCollectModal('💡 提示', msg, [
        { text: '知道了', secondary: true, callback: closeCollectModal }
    ]);
}

/* ==================== 弹窗 / 提示 ==================== */
function showCollectModal(title, html, buttons) {
    var inner = '<div class="modal-title">' + title + '</div>' +
                '<div class="modal-text">' + html + '</div>';
    for (var i = 0; i < buttons.length; i++) {
        inner += '<button class="modal-btn ' + (buttons[i].secondary ? 'secondary' : '') +
                 '" data-i="' + i + '">' + buttons[i].text + '</button>';
    }
    modalBoxEl.innerHTML = inner;
    modalOverlayEl.classList.add('active');
    var btns = modalBoxEl.querySelectorAll('.modal-btn');
    for (var j = 0; j < btns.length; j++) {
        (function(btn, idx) {
            btn.addEventListener('click', function() {
                if (buttons[idx].callback) buttons[idx].callback();
            });
        })(btns[j], j);
    }
}
function closeCollectModal() { modalOverlayEl.classList.remove('active'); }

function showCollectToast(msg, type) {
    var old = document.querySelector('.collect-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'collect-toast' + (type ? ' ' + type : '');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.classList.add('show'); });
    setTimeout(function() {
        t.classList.remove('show');
        setTimeout(function() { t.remove(); }, 300);
    }, 1400);
}

/* ==================== 暴露给 main.js ==================== */
window.initCollect = initCollect;

})();