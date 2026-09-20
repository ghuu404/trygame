(function() {
'use strict';
console.log('MAIN.JS V2026-09-20 LOADED');

/* ==================== 常量 ==================== */
var MAX_STAMINA = 5;
var STAMINA_RECOVER_MS = 10 * 60 * 1000;
var UNLOCK_POWER = 100;

var SHOP_ITEMS = [
    { category: 'materials', name: '黄酒',   display: '黄酒',   price: 4, icon: '🍶' },
    { category: 'materials', name: '蜂蜜',   display: '蜂蜜',   price: 5, icon: '🍯' },
    { category: 'materials', name: '盐',     display: '盐',     price: 2, icon: '🧂' },
    { category: 'materials', name: '姜汁',   display: '姜汁',   price: 4, icon: '🫚' },
    { category: 'materials', name: '醋',     display: '醋',     price: 3, icon: '🍾' },
    { category: 'materials', name: '清水',   display: '清水',   price: 1, icon: '💧' },
    { category: 'materials', name: '白矾',   display: '白矾',   price: 3, icon: '⬜' },
    { category: 'materials', name: '麦麸',   display: '麦麸',   price: 2, icon: '🌾' },
    { category: 'materials', name: '米泔水', display: '米泔水', price: 2, icon: '🍚' },
    { category: 'materials', name: '甘草水', display: '甘草水', price: 5, icon: '🍵' },
    { category: 'materials', name: '石灰水', display: '石灰水', price: 2, icon: '🥛' },
    { category: 'materials', name: '黑豆汁', display: '黑豆汁', price: 6, icon: '🫘' },
    { category: 'seeds', name: '芍药', display: '芍药种子', price: 3, icon: '🌸' },
    { category: 'seeds', name: '甘草', display: '甘草种子', price: 2, icon: '🌿' },
    { category: 'seeds', name: '生姜', display: '生姜种子', price: 1, icon: '🫚' },
    { category: 'seeds', name: '大枣', display: '大枣种子', price: 1, icon: '🍇' },
    { category: 'seeds', name: '粳米', display: '粳米种子', price: 1, icon: '🌾' },
    { category: 'seeds', name: '半夏', display: '半夏种子', price: 3, icon: '🌱' },
    { category: 'seeds', name: '泽泻', display: '泽泻种子', price: 4, icon: '💧' },
    { category: 'seeds', name: '栀子', display: '栀子种子', price: 2, icon: '🌼' },
    { category: 'herbs', name: '饴糖',   display: '饴糖',   price: 4, icon: '🍬' },
    { category: 'herbs', name: '淡豆豉', display: '淡豆豉', price: 3, icon: '🫘' }
];

/* ==================== 图片兜底工具（替代内联 onerror） ==================== */
/* 纯隐藏：用于 .auto-hide / .collect-book-item img 等 */
window.bindImgFallback = function(root) {
    var container = root || document;
    var imgs = container.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
        (function(img) {
            if (img._fbBound) return;
            img._fbBound = true;
            var hideImg = function() { img.style.display = 'none'; };
            if (img.complete && img.naturalWidth === 0) { hideImg(); return; }
            img.addEventListener('error', hideImg);
        })(imgs[i]);
    }
};

/* 隐藏自身 + 显示后面的兄弟元素（用来切 emoji 兜底）：用于商店 / 抓药药盘 */
window.bindImgWithSiblingFallback = function(root) {
    var container = root || document;
    var imgs = container.querySelectorAll('img[data-fallback]');
    for (var i = 0; i < imgs.length; i++) {
        (function(img) {
            if (img._fbSibBound) return;
            img._fbSibBound = true;
            var sib = img.nextElementSibling;
            var onErr = function() {
                img.style.display = 'none';
                if (sib) sib.style.display = 'block';
            };
            if (img.complete && img.naturalWidth === 0) { onErr(); return; }
            img.addEventListener('error', onErr);
        })(imgs[i]);
    }
};

/* ==================== 页面切换 ==================== */
function switchPage(name) {
    /* ① 先查目标页面是否存在 */
    var target = document.getElementById('page-' + name);
    if (!target) {
        console.warn('[switchPage] 页面不存在: page-' + name);
        return;   /* 目标不存在 → 直接退出，绝不清 active */
    }

    /* ② 确认存在了才清空所有 active */
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }

    /* ③ 给目标页面加上 active */
    target.classList.add('active');

    /* ④ 各页面的初始化 */
    if (name === 'main') renderMainTop();
    if (name === 'diagnose' && typeof window.initDiagnose === 'function') window.initDiagnose();
    if (name === 'collect' && window.initCollect) window.initCollect();
    if (name === 'process' && window.initProcess) window.initProcess();
    if (name === 'dispense' && window.initDispense) window.initDispense();
}
window.switchPage = switchPage;

/* ==================== 图片首次加载后绑定 ==================== */
function bindImageFallback() {
    window.bindImgFallback(document);
}

/* ==================== 仓库 / 医力 / 体力 / 铜币 ==================== */
var WAREHOUSE_KEY = 'warehouse';
function getWarehouse() {
    try {
        return JSON.parse(localStorage.getItem(WAREHOUSE_KEY)) ||
            { herbs: {}, seeds: {}, materials: {}, processed: {} };
    } catch(e) {
        return { herbs: {}, seeds: {}, materials: {}, processed: {} };
    }
}
window.getWarehouse = getWarehouse;

function getPower() {
    var v = localStorage.getItem('power');
    return v ? parseFloat(v) : 1;
}
window.getPower = getPower;

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
window.getStamina = getStamina;
window.MAX_STAMINA = MAX_STAMINA;

function getCoins() { return parseInt(localStorage.getItem('coins') || 0); }
function addCoins(n) {
    var t = getCoins() + n;
    localStorage.setItem('coins', String(t));
    return t;
}
window.getCoins = getCoins;
window.addCoins = addCoins;

/* ==================== 主页面渲染 ==================== */
function renderMainTop() {
    var el = document.getElementById('mainCoinText');
    if (el) el.textContent = getCoins();
    el = document.getElementById('mainPowerText');
    if (el) el.textContent = Math.floor(getPower());
    el = document.getElementById('mainStaminaText');
    if (el) el.textContent = getStamina() + ' / ' + MAX_STAMINA;

    var unlocked = getPower() >= UNLOCK_POWER;
    var spots = document.querySelectorAll('.spot');
    for (var i = 0; i < spots.length; i++) {
        var m = spots[i].getAttribute('data-module');
        if (m === 'diagnose') { spots[i].classList.remove('locked'); continue; }
        if (unlocked) spots[i].classList.remove('locked');
        else spots[i].classList.add('locked');
    }
}

/* ==================== 主页面弹窗 ==================== */
function showMainModal(title, html, btnText, callback) {
    var el = document.getElementById('mainModalContent');
    el.innerHTML =
        '<div class="modal-title">' + title + '</div>' +
        '<div class="modal-text">' + html + '</div>' +
        '<button class="modal-btn" id="mainModalBtn">' + btnText + '</button>';
    document.getElementById('mainModalOverlay').classList.add('active');
    document.getElementById('mainModalBtn').addEventListener('click', function() {
        document.getElementById('mainModalOverlay').classList.remove('active');
        if (callback) callback();
    });
}

/* ==================== 签到 ==================== */
var MAX_SIGN_DAYS = 7;

/* 从 SHOP_ITEMS 里动态取素材池和种子池，跟商店共用一份数据，避免重复维护 */
var ALL_MATERIALS = SHOP_ITEMS.filter(function (i) { return i.category === 'materials'; })
    .map(function (i) { return i.name; });
var SEED_POOL = SHOP_ITEMS.filter(function (i) { return i.category === 'seeds'; })
    .map(function (i) { return i.name; });

function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}
function yesterdayStr() {
    var d = new Date(Date.now() - 86400000);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}
function getSignState() {
    return {
        lastDate: localStorage.getItem('signLastDate') || '',
        day: parseInt(localStorage.getItem('signDay') || 0, 10) || 0,
        materialIdx: parseInt(localStorage.getItem('signMaterialIdx') || 0, 10) || 0,
        seedIdx: parseInt(localStorage.getItem('signSeedIdx') || 0, 10) || 0
    };
}
function saveSignState(s) {
    localStorage.setItem('signLastDate', s.lastDate);
    localStorage.setItem('signDay', String(s.day));
    localStorage.setItem('signMaterialIdx', String(s.materialIdx));
    localStorage.setItem('signSeedIdx', String(s.seedIdx));
}
function isSignedToday() { return getSignState().lastDate === todayStr(); }

function getNextSignDay() {
    var s = getSignState();
    if (s.lastDate === todayStr()) return s.day;
    if (s.lastDate === yesterdayStr()) return (s.day % MAX_SIGN_DAYS) + 1;
    return 1;
}

/* ★ 签到奖励表：铜币全部翻倍，第 3 天送素材、第 5 天加倍金币、第 7 天送种子 */
function getSignReward(day, state) {
    var r = { coins: 0, material: null, materialCount: 0, seed: null, seedCount: 0 };
    switch (day) {
        case 1: r.coins = 10; break;
        case 2: r.coins = 10; break;
        case 3:
            r.material = ALL_MATERIALS[state.materialIdx % ALL_MATERIALS.length];
            r.materialCount = 5;   /* ★ 第 3 天送辅料 ×5 */
            break;
        case 4: r.coins = 10; break;
        case 5: r.coins = 20; break;
        case 6: r.coins = 16; break;
        case 7:
            r.coins = 20;
            r.seed = SEED_POOL[state.seedIdx % SEED_POOL.length];
            r.seedCount = 3;
            break;
    }
    return r;
}

function addItem(category, name, count) {
    if (!name || count <= 0) return;
    var w = getWarehouse();
    if (!w[category]) w[category] = {};
    w[category][name] = (w[category][name] || 0) + count;
    localStorage.setItem(WAREHOUSE_KEY, JSON.stringify(w));
}

function openSignModal() {
    var state = getSignState();
    var signed = isSignedToday();
    var nextDay = getNextSignDay();

    var html = '<div class="modal-title">📅 每日签到</div>';
    html += '<div class="sign-grid">';
    for (var d = 1; d <= MAX_SIGN_DAYS; d++) {
        var reward = getSignReward(d, state);
        var txt = '';
        if (reward.coins) txt += '💰' + reward.coins;
        if (reward.material) txt += (txt ? '<br>' : '') + reward.material + '×' + reward.materialCount;
        if (reward.seed) txt += (txt ? '<br>' : '') + reward.seed + '种×' + reward.seedCount;

        var cls = 'sign-day';
        if (state.lastDate && d <= state.day) cls += ' claimed';
        if (!signed && d === nextDay) cls += ' active';

        html += '<div class="' + cls + '">' +
            '<div class="day-label">第' + d + '天</div>' +
            '<div class="reward">' + txt + '</div>' +
        '</div>';
    }
    html += '</div>';

    if (signed) {
        html += '<div style="font-size:13px;color:#666;margin-bottom:10px;">今日已签到，明天再来～</div>';
        html += '<button class="modal-btn secondary close-modal-btn">关闭</button>';
    } else {
        var r = getSignReward(nextDay, state);
        var desc = [];
        if (r.coins) desc.push(r.coins + ' 铜币');
        if (r.material) desc.push(r.material + ' ×' + r.materialCount);
        if (r.seed) desc.push(r.seed + '种子 ×' + r.seedCount);
        html += '<div style="font-size:13px;color:#8b5e3c;margin-bottom:10px;">今日签到可得：' + desc.join(' + ') + '</div>';
        html += '<button class="modal-btn" id="signConfirmBtn">立即签到</button>';
        html += '<button class="modal-btn secondary close-modal-btn">取消</button>';
    }

    document.getElementById('mainModalContent').innerHTML = html;
    document.getElementById('mainModalOverlay').classList.add('active');

    var closeBtn = document.querySelector('#mainModalContent .close-modal-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            document.getElementById('mainModalOverlay').classList.remove('active');
        });
    }
    var okBtn = document.getElementById('signConfirmBtn');
    if (okBtn) okBtn.addEventListener('click', doSign);
}

function doSign() {
    var state = getSignState();
    if (state.lastDate === todayStr()) { alert('今日已签到'); return; }

    var newDay;
    if (state.lastDate === yesterdayStr()) newDay = (state.day % MAX_SIGN_DAYS) + 1;
    else newDay = 1;

    var r = getSignReward(newDay, state);
    var msg = [];

    if (r.coins) {
        addCoins(r.coins);
        msg.push('💰 +' + r.coins + ' 铜币');
    }
    if (r.material) {
        addItem('materials', r.material, r.materialCount);
        state.materialIdx++;
        msg.push('🎁 ' + r.material + ' ×' + r.materialCount);
    }
    if (r.seed) {
        addItem('seeds', r.seed, r.seedCount);
        state.seedIdx++;
        msg.push('🌱 ' + r.seed + '种子 ×' + r.seedCount);
    }

    state.lastDate = todayStr();
    state.day = newDay;
    saveSignState(state);

    renderMainTop();

    var html = '<div class="modal-title">🎉 签到成功</div>' +
        '<div style="font-size:15px;color:#33691e;font-weight:bold;margin:14px 0;line-height:1.8;">' +
            msg.join('<br>') +
        '</div>' +
        '<button class="modal-btn" id="signAfterBtn">知道了</button>';
    document.getElementById('mainModalContent').innerHTML = html;
    document.getElementById('mainModalOverlay').classList.add('active');
    document.getElementById('signAfterBtn').addEventListener('click', function () {
        document.getElementById('mainModalOverlay').classList.remove('active');
    });
}

/* ==================== 仓库 ==================== */
function openWarehouse() {
    var w = getWarehouse();
    var html = '<div class="modal-title">📦 仓库</div>';

    var sections = [
        { key: 'herbs',     title: '🌿 药材', path: 'images/herbs/' },
        { key: 'seeds',     title: '🌱 种子', path: 'images/seeds/' },
        { key: 'materials', title: '🍯 辅料', path: 'images/materials/' },
        { key: 'processed', title: '⚗️ 饮片', path: 'images/processed/' }
    ];

    for (var i = 0; i < sections.length; i++) {
        var sec = sections[i];
        var items = w[sec.key] || {};
        var keys = Object.keys(items).filter(function (k) { return items[k] > 0; });

        html += '<div class="wh-section">' + sec.title + '</div>';

        if (keys.length === 0) {
            html += '<div class="wh-empty">暂无</div>';
            continue;
        }

        html += '<div class="wh-grid">';
        for (var j = 0; j < keys.length; j++) {
            var name = keys[j];
            var count = items[name];
            html += '<div class="wh-item">' +
                '<img class="auto-hide" src="' + sec.path + encodeURI(name) + '.webp" alt="">' +
                '<div class="wh-name">' + name + '</div>' +
                '<div class="wh-count">x' + count + '</div>' +
            '</div>';
        }
        html += '</div>';
    }

    html += '<button class="modal-btn secondary close-modal-btn" style="margin-top:14px;">关闭</button>';

    document.getElementById('mainModalContent').innerHTML = html;
    document.getElementById('mainModalOverlay').classList.add('active');

    /* 图片加载失败自动隐藏 */
    window.bindImgFallback(document.getElementById('mainModalContent'));

    /* 关闭按钮 */
    var closeBtn = document.querySelector('#mainModalContent .close-modal-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            document.getElementById('mainModalOverlay').classList.remove('active');
        });
    }
}
/* ==================== 商店（图片走 data-fallback 属性） ==================== */
function openShop() {
    var html = '<div class="modal-title">🛒 商店</div>';
    html += '<div class="shop-coins">💰 当前铜币：<span>' + getCoins() + '</span></div>';

    html += '<div class="shop-section">🍯 辅料</div><div class="shop-grid">';
    SHOP_ITEMS.filter(function(i) { return i.category === 'materials'; }).forEach(function(item) {
        var idx = SHOP_ITEMS.indexOf(item);
        var canBuy = getCoins() >= item.price;
        html += '<div class="shop-item">' +
            '<img data-fallback src="images/materials/' + item.name + '.webp" style="width:40px;height:40px;object-fit:contain;">' +
            '<span class="item-icon" style="display:none;">' + item.icon + '</span>' +
            '<span class="item-name">' + item.display + '</span>' +
            '<span class="item-price">💰 ' + item.price + '</span>' +
            '<button class="shop-buy" data-buy-index="' + idx + '" ' + (canBuy ? '' : 'disabled') + '>购买</button></div>';
    });
    html += '</div>';

    html += '<div class="shop-section">🌱 种子</div><div class="shop-grid">';
    SHOP_ITEMS.filter(function(i) { return i.category === 'seeds'; }).forEach(function(item) {
        var idx = SHOP_ITEMS.indexOf(item);
        var canBuy = getCoins() >= item.price;
        html += '<div class="shop-item">' +
            '<img data-fallback src="images/seeds/' + item.name + '.webp" style="width:40px;height:40px;object-fit:contain;">' +
            '<span class="item-icon" style="display:none;">' + item.icon + '</span>' +
            '<span class="item-name">' + item.display + '</span>' +
            '<span class="item-price">💰 ' + item.price + '</span>' +
            '<button class="shop-buy" data-buy-index="' + idx + '" ' + (canBuy ? '' : 'disabled') + '>购买</button></div>';
    });
    html += '</div>';

    html += '<div class="shop-section">🌿 药材</div><div class="shop-grid">';
    SHOP_ITEMS.filter(function(i) { return i.category === 'herbs'; }).forEach(function(item) {
        var idx = SHOP_ITEMS.indexOf(item);
        var canBuy = getCoins() >= item.price;
        html += '<div class="shop-item">' +
            '<img data-fallback src="images/herbs/' + item.name + '.webp" style="width:40px;height:40px;object-fit:contain;">' +
            '<span class="item-icon" style="display:none;">' + item.icon + '</span>' +
            '<span class="item-name">' + item.display + '</span>' +
            '<span class="item-price">💰 ' + item.price + '</span>' +
            '<button class="shop-buy" data-buy-index="' + idx + '" ' + (canBuy ? '' : 'disabled') + '>购买</button></div>';
    });
    html += '</div>';

    html += '<button class="modal-btn secondary close-modal-btn" style="margin-top:14px;">关闭</button>';

    document.getElementById('mainModalContent').innerHTML = html;
    document.getElementById('mainModalOverlay').classList.add('active');

    /* 绑定图片兜底 */
    window.bindImgWithSiblingFallback(document.getElementById('mainModalContent'));

    var closeBtns = document.querySelectorAll('#mainModalContent .close-modal-btn');
    for (var c = 0; c < closeBtns.length; c++) {
        closeBtns[c].addEventListener('click', function() {
            document.getElementById('mainModalOverlay').classList.remove('active');
        });
    }

    var buyBtns = document.querySelectorAll('#mainModalContent .shop-buy');
    for (var b = 0; b < buyBtns.length; b++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(btn.getAttribute('data-buy-index'));
                buyItem(idx);
            });
        })(buyBtns[b]);
    }
}

function buyItem(idx) {
    var item = SHOP_ITEMS[idx];
    if (!item) return;
    if (getCoins() < item.price) { alert('铜币不足！'); return; }
    var cur = getCoins();
    localStorage.setItem('coins', String(cur - item.price));

    var w = getWarehouse();
    if (item.category === 'herbs') {
        w.processed[item.name] = (w.processed[item.name] || 0) + 1;
    } else {
        if (!w[item.category]) w[item.category] = {};
        w[item.category][item.name] = (w[item.category][item.name] || 0) + 1;
    }
    localStorage.setItem(WAREHOUSE_KEY, JSON.stringify(w));

    renderMainTop();
    openShop();
}

/* ==================== 主页面事件 ==================== */
function bindMainEvents() {
    var spots = document.querySelectorAll('.spot');
    for (var i = 0; i < spots.length; i++) {
        (function(el) {
            el.addEventListener('click', function() {
                var m = el.getAttribute('data-module');
                if (el.classList.contains('locked')) {
                    showMainModal('模块未解锁',
                        '医力达到 <b>' + UNLOCK_POWER + '</b> 即可解锁此模块。<br>当前医力：<b>' + Math.floor(getPower()) + '</b>',
                        '知道了', null);
                    return;
                }
                if (m === 'diagnose') switchPage('diagnose');
                else if (m === 'collect') switchPage('collect');
                else if (m === 'process') switchPage('process');
                else if (m === 'dispense') switchPage('dispense');
                else showMainModal('敬请期待', '这个模块还在开发中，先去行医吧～', '知道了', null);
            });
        })(spots[i]);
    }

    var placeholders = [
    { id: 'btnMedBook', title: '医书' },
    { id: 'btnHerbBook', title: '药书' }
];
for (var j = 0; j < placeholders.length; j++) {
    (function(item) {
        var el = document.getElementById(item.id);
        if (el) el.addEventListener('click', function() {
            showMainModal(item.title, '这个功能还在开发中～', '知道了', null);
        });
    })(placeholders[j]);
}

/* ★ 仓库绑定 */
var whBtn = document.getElementById('btnWarehouse');
if (whBtn) whBtn.addEventListener('click', openWarehouse);

/* ★ 签到绑定 */
var signBtn = document.getElementById('btnSign');
if (signBtn) signBtn.addEventListener('click', openSignModal);

var shopBtn = document.getElementById('btnShop');
if (shopBtn) shopBtn.addEventListener('click', openShop);
}

/* ==================== 初始化 ==================== */
bindImageFallback();
bindMainEvents();
renderMainTop();

/* 启动兜底：确保至少有一个页面可见 */
(function ensureSomethingVisible() {
    if (!document.querySelector('.page.active')) {
        var m = document.getElementById('page-main');
        if (m) {
            m.classList.add('active');
            console.warn('[startup] page-main 缺失 active，已自动补回');
        }
    }
})();

/* ==================== localStorage 旧数据迁移 ==================== */
(function migrateProcessed() {
    var MAP = {
        '桂枝(切片)':'桂枝饮片', '麻黄(去节)':'麻黄饮片', '山杏(去皮尖)':'杏仁饮片',
        '甘草(切片)':'炙甘草', '甘草(蜜炙)':'炙甘草', '芍药(切片)':'芍药饮片',
        '生姜(切片)':'生姜饮片', '干姜(切片)':'干姜饮片', '大枣(擘)':'大枣饮片',
        '葛根(切片)':'葛根饮片', '细辛(切段)':'细辛饮片', '柴胡(切片)':'柴胡饮片',
        '黄芩(切片)':'黄芩饮片', '知母(去毛)':'知母饮片', '厚朴(去皮)':'厚朴饮片',
        '枳实(切片)':'枳实饮片', '猪苓(去皮)':'猪苓饮片', '茯苓(切块)':'茯苓饮片',
        '泽泻(切片)':'泽泻饮片', '栀子(擘)':'栀子饮片', '五味子(晒干)':'五味子饮片',
        '茵陈(切片)':'茵陈饮片', '姜半夏':'半夏饮片', '姜炙厚朴':'厚朴饮片',
        '盐炙泽泻':'泽泻饮片', '酒洗大黄':'大黄饮片', '酒洗当归':'当归饮片',
        '炒焦山杏':'杏仁饮片', '麻黄':'麻黄饮片', '桂枝':'桂枝饮片',
        '杏仁':'杏仁饮片', '柴胡':'柴胡饮片', '黄芩':'黄芩饮片',
        '细辛':'细辛饮片', '茯苓':'茯苓饮片', '黄连':'黄连饮片'
    };
    try {
        var w = JSON.parse(localStorage.getItem('warehouse') || '{}');
        if (!w.processed) return;
        var out = {}, changed = false;
        Object.keys(w.processed).forEach(function(k) {
            var nk = MAP[k] || k;
            if (nk !== k) changed = true;
            out[nk] = (out[nk] || 0) + w.processed[k];
        });
        if (changed) {
            w.processed = out;
            localStorage.setItem('warehouse', JSON.stringify(w));
            console.log('[migrate] 已把旧饮片名迁移到新版');
        }
    } catch(e) {}
})();

setInterval(function() {
    if (document.getElementById('page-main').classList.contains('active')) renderMainTop();
    if (document.getElementById('page-diagnose').classList.contains('active') && typeof window.renderDiagTop === 'function') window.renderDiagTop();
}, 60000);

})();