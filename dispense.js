(function() {
'use strict';

/* ==================== 仓库 / 铜币 ==================== */
function getWarehouse() {
    try {
        return JSON.parse(localStorage.getItem('warehouse')) ||
            { herbs: {}, seeds: {}, materials: {}, processed: {} };
    } catch(e) {
        return { herbs: {}, seeds: {}, materials: {}, processed: {} };
    }
}
function saveWarehouse(w) { localStorage.setItem('warehouse', JSON.stringify(w)); }

var warehouse = getWarehouse();
var processedInventory = warehouse.processed;
function saveProcessed() {
    warehouse.processed = processedInventory;
    saveWarehouse(warehouse);
}
function getCoins() { return parseInt(localStorage.getItem('coins') || 0); }
function setCoins(n) { localStorage.setItem('coins', String(n)); }

/* ==================== 处方显示名映射 ==================== */
var DISPLAY_MAP = {
    '麻黄饮片': '麻黄', '桂枝饮片': '桂枝', '杏仁饮片': '杏仁',
    '炙甘草': '炙甘草', '芍药饮片': '芍药', '生姜饮片': '生姜',
    '干姜饮片': '干姜', '大枣饮片': '大枣', '葛根饮片': '葛根',
    '细辛饮片': '细辛', '柴胡饮片': '柴胡', '黄芩饮片': '黄芩',
    '知母饮片': '知母', '炮附子': '附子', '炒白术': '白术',
    '大黄饮片': '大黄', '厚朴饮片': '厚朴', '枳实饮片': '枳实',
    '猪苓饮片': '猪苓', '当归饮片': '当归', '泽泻饮片': '泽泻',
    '栀子饮片': '栀子', '半夏饮片': '半夏', '茯苓饮片': '茯苓',
    '五味子饮片': '五味子', '茵陈饮片': '茵陈', '人参饮片': '人参',
    '黄连饮片': '黄连', '通草饮片': '通草', '碎石膏': '石膏',
    '芒硝': '芒硝', '淡豆豉': '淡豆豉', '饴糖': '饴糖', '粳米': '粳米'
};
function dispName(name) {
    return DISPLAY_MAP[name] || name;
}

/* ==================== 处方数据（35 方） ==================== */
var PRESCRIPTIONS = [
    /* ==================== 原有 20 方 ==================== */
    { name: '麻黄汤', herbs: [
        { name: '麻黄饮片', amount: 3 },
        { name: '桂枝饮片', amount: 2 },
        { name: '杏仁饮片', amount: 3 },
        { name: '炙甘草', amount: 1 }
    ]},
    { name: '桂枝汤', herbs: [
        { name: '桂枝饮片', amount: 3 },
        { name: '芍药饮片', amount: 3 },
        { name: '炙甘草', amount: 2 },
        { name: '生姜饮片', amount: 3 },
        { name: '大枣饮片', amount: 3 }
    ]},
    { name: '葛根汤', herbs: [
        { name: '葛根饮片', amount: 3 },
        { name: '麻黄饮片', amount: 3 },
        { name: '桂枝饮片', amount: 2 },
        { name: '芍药饮片', amount: 2 },
        { name: '炙甘草', amount: 2 },
        { name: '生姜饮片', amount: 3 },
        { name: '大枣饮片', amount: 3 }
    ]},
    { name: '小青龙汤', herbs: [
        { name: '麻黄饮片', amount: 3 },
        { name: '芍药饮片', amount: 3 },
        { name: '细辛饮片', amount: 3 },
        { name: '干姜饮片', amount: 3 },
        { name: '炙甘草', amount: 3 },
        { name: '桂枝饮片', amount: 3 },
        { name: '五味子饮片', amount: 3 },
        { name: '半夏饮片', amount: 3 }
    ]},
    { name: '大青龙汤', herbs: [
        { name: '麻黄饮片', amount: 4 },
        { name: '桂枝饮片', amount: 2 },
        { name: '炙甘草', amount: 2 },
        { name: '杏仁饮片', amount: 3 },
        { name: '生姜饮片', amount: 3 },
        { name: '大枣饮片', amount: 3 },
        { name: '碎石膏', amount: 3 }
    ]},
    { name: '小柴胡汤', herbs: [
        { name: '柴胡饮片', amount: 4 },
        { name: '黄芩饮片', amount: 3 },
        { name: '人参饮片', amount: 3 },
        { name: '半夏饮片', amount: 3 },
        { name: '炙甘草', amount: 3 },
        { name: '生姜饮片', amount: 3 },
        { name: '大枣饮片', amount: 3 }
    ]},
    { name: '大柴胡汤', herbs: [
        { name: '柴胡饮片', amount: 4 },
        { name: '黄芩饮片', amount: 3 },
        { name: '芍药饮片', amount: 3 },
        { name: '半夏饮片', amount: 3 },
        { name: '生姜饮片', amount: 3 },
        { name: '枳实饮片', amount: 3 },
        { name: '大枣饮片', amount: 3 },
        { name: '大黄饮片', amount: 2 }
    ]},
    { name: '白虎汤', herbs: [
        { name: '知母饮片', amount: 3 },
        { name: '碎石膏', amount: 4 },
        { name: '炙甘草', amount: 1 },
        { name: '粳米', amount: 3 }
    ]},
    { name: '小承气汤', herbs: [
        { name: '大黄饮片', amount: 3 },
        { name: '枳实饮片', amount: 3 },
        { name: '厚朴饮片', amount: 2 }
    ]},
    { name: '大承气汤', herbs: [
        { name: '大黄饮片', amount: 3 },
        { name: '厚朴饮片', amount: 3 },
        { name: '枳实饮片', amount: 3 },
        { name: '芒硝', amount: 2 }
    ]},
    { name: '调胃承气汤', herbs: [
        { name: '大黄饮片', amount: 3 },
        { name: '芒硝', amount: 2 },
        { name: '炙甘草', amount: 2 }
    ]},
    { name: '理中汤', herbs: [
        { name: '人参饮片', amount: 3 },
        { name: '干姜饮片', amount: 3 },
        { name: '炙甘草', amount: 3 },
        { name: '炒白术', amount: 3 }
    ]},
    { name: '四逆汤', herbs: [
        { name: '炮附子', amount: 1 },
        { name: '干姜饮片', amount: 2 },
        { name: '炙甘草', amount: 2 }
    ]},
    { name: '真武汤', herbs: [
        { name: '茯苓饮片', amount: 3 },
        { name: '芍药饮片', amount: 3 },
        { name: '生姜饮片', amount: 3 },
        { name: '炒白术', amount: 2 },
        { name: '炮附子', amount: 1 }
    ]},
    { name: '五苓散', herbs: [
        { name: '猪苓饮片', amount: 2 },
        { name: '泽泻饮片', amount: 3 },
        { name: '炒白术', amount: 2 },
        { name: '茯苓饮片', amount: 2 },
        { name: '桂枝饮片', amount: 2 }
    ]},
    { name: '半夏泻心汤', herbs: [
        { name: '半夏饮片', amount: 3 },
        { name: '黄芩饮片', amount: 3 },
        { name: '干姜饮片', amount: 3 },
        { name: '人参饮片', amount: 3 },
        { name: '炙甘草', amount: 3 },
        { name: '黄连饮片', amount: 1 },
        { name: '大枣饮片', amount: 3 }
    ]},
    { name: '栀子豉汤', herbs: [
        { name: '栀子饮片', amount: 2 },
        { name: '淡豆豉', amount: 3 }
    ]},
    { name: '茵陈蒿汤', herbs: [
        { name: '茵陈饮片', amount: 3 },
        { name: '栀子饮片', amount: 2 },
        { name: '大黄饮片', amount: 2 }
    ]},
    { name: '当归四逆汤', herbs: [
        { name: '当归饮片', amount: 3 },
        { name: '桂枝饮片', amount: 3 },
        { name: '芍药饮片', amount: 3 },
        { name: '细辛饮片', amount: 3 },
        { name: '炙甘草', amount: 2 },
        { name: '通草饮片', amount: 2 },
        { name: '大枣饮片', amount: 3 }
    ]},
    { name: '小建中汤', herbs: [
        { name: '桂枝饮片', amount: 3 },
        { name: '芍药饮片', amount: 3 },
        { name: '炙甘草', amount: 2 },
        { name: '生姜饮片', amount: 3 },
        { name: '大枣饮片', amount: 3 },
        { name: '饴糖', amount: 2 }
    ]},

    /* ==================== 新增 15 方（可用现有药材组方） ==================== */
    { name: '桂枝加葛根汤', herbs: [
        { name: '桂枝饮片', amount: 3 },
        { name: '芍药饮片', amount: 3 },
        { name: '炙甘草', amount: 2 },
        { name: '生姜饮片', amount: 3 },
        { name: '大枣饮片', amount: 3 },
        { name: '葛根饮片', amount: 4 }
    ]},
    { name: '麻黄附子细辛汤', herbs: [
        { name: '麻黄饮片', amount: 2 },
        { name: '炮附子', amount: 1 },
        { name: '细辛饮片', amount: 2 }
    ]},
    { name: '葛根芩连汤', herbs: [
        { name: '葛根饮片', amount: 4 },
        { name: '黄芩饮片', amount: 3 },
        { name: '黄连饮片', amount: 3 },
        { name: '炙甘草', amount: 2 }
    ]},
    { name: '越婢汤', herbs: [
        { name: '麻黄饮片', amount: 4 },
        { name: '碎石膏', amount: 4 },
        { name: '生姜饮片', amount: 3 },
        { name: '大枣饮片', amount: 3 },
        { name: '炙甘草', amount: 2 }
    ]},
    { name: '柴胡桂枝汤', herbs: [
        { name: '柴胡饮片', amount: 4 },
        { name: '黄芩饮片', amount: 2 },
        { name: '人参饮片', amount: 2 },
        { name: '半夏饮片', amount: 3 },
        { name: '桂枝饮片', amount: 2 },
        { name: '芍药饮片', amount: 2 },
        { name: '炙甘草', amount: 2 },
        { name: '生姜饮片', amount: 2 },
        { name: '大枣饮片', amount: 3 }
    ]},
    { name: '白虎加人参汤', herbs: [
        { name: '知母饮片', amount: 3 },
        { name: '碎石膏', amount: 4 },
        { name: '炙甘草', amount: 1 },
        { name: '粳米', amount: 3 },
        { name: '人参饮片', amount: 2 }
    ]},
    { name: '大黄甘草汤', herbs: [
        { name: '大黄饮片', amount: 3 },
        { name: '炙甘草', amount: 2 }
    ]},
    { name: '甘草干姜汤', herbs: [
        { name: '炙甘草', amount: 4 },
        { name: '干姜饮片', amount: 2 }
    ]},
    { name: '通脉四逆汤', herbs: [
        { name: '炮附子', amount: 1 },
        { name: '干姜饮片', amount: 3 },
        { name: '炙甘草', amount: 2 }
    ]},
    { name: '苓桂术甘汤', herbs: [
        { name: '茯苓饮片', amount: 4 },
        { name: '桂枝饮片', amount: 3 },
        { name: '炒白术', amount: 2 },
        { name: '炙甘草', amount: 2 }
    ]},
    { name: '麻黄加术汤', herbs: [
        { name: '麻黄饮片', amount: 3 },
        { name: '桂枝饮片', amount: 2 },
        { name: '炙甘草', amount: 1 },
        { name: '杏仁饮片', amount: 3 },
        { name: '炒白术', amount: 4 }
    ]},
    { name: '桂枝附子汤', herbs: [
        { name: '桂枝饮片', amount: 4 },
        { name: '炮附子', amount: 1 },
        { name: '生姜饮片', amount: 3 },
        { name: '大枣饮片', amount: 3 },
        { name: '炙甘草', amount: 2 }
    ]},
    { name: '白术附子汤', herbs: [
        { name: '炒白术', amount: 2 },
        { name: '炮附子', amount: 1 },
        { name: '炙甘草', amount: 1 },
        { name: '生姜饮片', amount: 1 },
        { name: '大枣饮片', amount: 2 }
    ]},
    { name: '甘草附子汤', herbs: [
        { name: '炙甘草', amount: 2 },
        { name: '炮附子', amount: 1 },
        { name: '炒白术', amount: 2 },
        { name: '桂枝饮片', amount: 4 }
    ]},
    { name: '甘草泻心汤', herbs: [
        { name: '炙甘草', amount: 4 },
        { name: '黄芩饮片', amount: 3 },
        { name: '人参饮片', amount: 3 },
        { name: '干姜饮片', amount: 3 },
        { name: '黄连饮片', amount: 1 },
        { name: '大枣饮片', amount: 3 },
        { name: '半夏饮片', amount: 3 }
    ]}
];

/* ==================== 元素 ==================== */
var orderTitleEl, orderListEl, plateGridEl, stockListEl, btnPack;
var coinTextEl, bagModalEl, bagNameEl;
var dispBound = false;

var currentOrderIndex = 0;
var currentOrder = null;
var plate = {};
var allPlates = {};

/* ==================== 初始化 ==================== */
function initDispense() {
    /* ★ 每次进入页面都重新从 localStorage 读取 */
    warehouse = getWarehouse();
    processedInventory = warehouse.processed;

    orderTitleEl = document.getElementById('dispOrderTitle');
    orderListEl = document.getElementById('dispOrderList');
    plateGridEl = document.getElementById('dispPlateGrid');
    stockListEl = document.getElementById('dispStockList');
    btnPack = document.getElementById('btnDispPack');
    coinTextEl = document.getElementById('dispCoinText');
    bagModalEl = document.getElementById('dispBagModal');
    bagNameEl = document.getElementById('dispBagName');

    if (!dispBound) {
        bindDispenseEvents();
        dispBound = true;
    }

    try {
        allPlates = JSON.parse(localStorage.getItem('dispensePlates')) || {};
    } catch(e) { allPlates = {}; }

    currentOrderIndex = parseInt(localStorage.getItem('currentPrescriptionIndex') || 0);
    if (isNaN(currentOrderIndex) || currentOrderIndex < 0 || currentOrderIndex >= PRESCRIPTIONS.length) {
        currentOrderIndex = 0;
    }
    currentOrder = JSON.parse(JSON.stringify(PRESCRIPTIONS[currentOrderIndex]));
    plate = allPlates[currentOrderIndex] || {};

    updateCoinDisplay();
    renderAll();
}

function updateCoinDisplay() {
    if (coinTextEl) coinTextEl.textContent = getCoins();
}

/* ==================== 事件绑定 ==================== */
function bindDispenseEvents() {
    document.getElementById('btnDispBack').addEventListener('click', function() {
        window.switchPage('main');
    });
    document.getElementById('btnDispPrevOrder').addEventListener('click', prevOrder);
    document.getElementById('btnDispNextOrder').addEventListener('click', nextOrder);
    btnPack.addEventListener('click', onPack);
    document.getElementById('dispBagConfirm').addEventListener('click', function() {
        bagModalEl.classList.remove('active');
        plate = {};
        savePlate();
        /* ★ 打包完成后自动切到下一张方子 */
        nextOrder();
    });
}

/* ==================== 切换处方 ==================== */
function prevOrder() {
    var idx = currentOrderIndex - 1;
    if (idx < 0) idx = PRESCRIPTIONS.length - 1;
    loadOrder(idx);
}
function nextOrder() {
    var idx = currentOrderIndex + 1;
    if (idx >= PRESCRIPTIONS.length) idx = 0;
    loadOrder(idx);
}
function loadOrder(index) {
    allPlates[currentOrderIndex] = plate;
    savePlates();
    currentOrderIndex = index;
    localStorage.setItem('currentPrescriptionIndex', String(currentOrderIndex));
    currentOrder = JSON.parse(JSON.stringify(PRESCRIPTIONS[index]));
    plate = allPlates[currentOrderIndex] || {};
    renderAll();
}
function savePlates() {
    localStorage.setItem('dispensePlates', JSON.stringify(allPlates));
}
function savePlate() {
    allPlates[currentOrderIndex] = plate;
    var keys = Object.keys(allPlates);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (!allPlates[k] || Object.keys(allPlates[k]).length === 0) delete allPlates[k];
    }
    savePlates();
}

/* ==================== 渲染 ==================== */
function renderAll() {
    renderOrder();
    renderPlate();
    renderStock();
    checkReady();
}

function renderOrder() {
    orderTitleEl.textContent = '📜 ' + currentOrder.name;
    orderListEl.innerHTML = '';
    for (var i = 0; i < currentOrder.herbs.length; i++) {
        (function(h) {
            var got = plate[h.name] || 0;
            var div = document.createElement('div');
            div.className = 'disp-order-item' + (got === h.amount ? ' done' : '');
            div.innerHTML = '<span>' + dispName(h.name) + '</span><span class="cnt">' + got + ' / ' + h.amount + '</span>';
            orderListEl.appendChild(div);
        })(currentOrder.herbs[i]);
    }
}

function renderPlate() {
    plateGridEl.innerHTML = '';
    var keys = Object.keys(plate);
    for (var i = 0; i < keys.length; i++) {
        (function(name) {
            var count = plate[name];
            if (count <= 0) return;
            var div = document.createElement('div');
            div.className = 'disp-plate-herb';
            var img = document.createElement('img');
            img.src = 'images/processed/' + encodeURI(name) + '.webp';
            img.addEventListener('error', function() {
                this.style.display = 'none';
                var span = document.createElement('span');
                span.style.fontSize = '20px';
                span.textContent = '🌿';
                div.insertBefore(span, div.firstChild);
            });
            div.appendChild(img);
            var nm = document.createElement('span');
            nm.className = 'pname';
            nm.textContent = name;
            div.appendChild(nm);
            var cnt = document.createElement('span');
            cnt.className = 'pcount';
            cnt.textContent = '×' + count;
            div.appendChild(cnt);
            div.addEventListener('click', function() { removeFromPlate(name); });
            plateGridEl.appendChild(div);
        })(keys[i]);
    }
}

function renderStock() {
    stockListEl.innerHTML = '';
    var keys = Object.keys(processedInventory).filter(function(k) { return processedInventory[k] > 0; });
    if (keys.length === 0) {
        stockListEl.innerHTML = '<div style="text-align:center;color:#999;padding:20px;font-size:13px;">库存为空，去炮制药材吧</div>';
        return;
    }
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
        (function(name) {
            var count = processedInventory[name];
            var div = document.createElement('div');
            div.className = 'disp-stock-item';
            var img = document.createElement('img');
            img.src = 'images/processed/' + encodeURI(name) + '.webp';
            img.addEventListener('error', function() {
                this.style.display = 'none';
            });
            div.appendChild(img);
            var info = document.createElement('div');
            info.className = 'sinfo';
            var nm = document.createElement('div');
            nm.className = 'sname';
            nm.textContent = dispName(name);
            info.appendChild(nm);
            var cnt = document.createElement('div');
            cnt.className = 'scount';
            cnt.textContent = '剩余 ' + count + ' 份';
            info.appendChild(cnt);
            div.appendChild(info);
            div.addEventListener('click', function() { addToPlate(name); });
            stockListEl.appendChild(div);
        })(keys[i]);
    }
}

/* ==================== 药盘操作 ==================== */
function addToPlate(name) {
    if (!currentOrder) return;
    var need = null;
    for (var i = 0; i < currentOrder.herbs.length; i++) {
        if (currentOrder.herbs[i].name === name) { need = currentOrder.herbs[i]; break; }
    }
    if (!need) return;
    var current = plate[name] || 0;
    if (current >= need.amount) return;
    if ((processedInventory[name] || 0) <= 0) return;
    if (window.playSound) window.playSound('click');

    processedInventory[name] -= 1;
    plate[name] = current + 1;
    saveProcessed();
    savePlate();
    renderAll();
}

function removeFromPlate(name) {
    if ((plate[name] || 0) <= 0) return;
    plate[name] -= 1;
    processedInventory[name] = (processedInventory[name] || 0) + 1;
    if (plate[name] === 0) delete plate[name];
    saveProcessed();
    savePlate();
    renderAll();
}

function checkReady() {
    if (!currentOrder) return;
    var ok = true;
    for (var i = 0; i < currentOrder.herbs.length; i++) {
        var h = currentOrder.herbs[i];
        if ((plate[h.name] || 0) !== h.amount) { ok = false; break; }
    }
    btnPack.disabled = !ok;
}

/* ==================== 打包 ==================== */
function onPack() {
    if (!currentOrder) return;
    for (var i = 0; i < currentOrder.herbs.length; i++) {
        var h = currentOrder.herbs[i];
        if ((plate[h.name] || 0) !== h.amount) return;
    }
    if (window.playSound) window.playSound('success');
    var bag = {
        id: 'bag_' + Date.now(),
        name: currentOrder.name,
        herbs: currentOrder.herbs.map(function(h) { return h.name + ' ×' + h.amount; }),
        createdAt: Date.now()
    };
    var bags = [];
    try { bags = JSON.parse(localStorage.getItem('medicineBags') || '[]'); } catch(e) {}
    bags.push(bag);
    localStorage.setItem('medicineBags', JSON.stringify(bags));

    setCoins(getCoins() + 50);
    updateCoinDisplay();

    /* 更新药包弹窗（假设药包图是 images/medicine-bag.webp，命名不对或没有也能跑） */
    bagNameEl.textContent = bag.name;
    var bagImgEl = document.getElementById('dispBagImg');
    if (bagImgEl) {
        bagImgEl.style.display = 'block';
        bagImgEl.src = 'images/medicine-bag.webp';
        bagImgEl.onerror = function() { this.style.display = 'none'; };
    }

    bagModalEl.classList.add('active');
}

/* ==================== 暴露给 main.js ==================== */
window.initDispense = initDispense;

})();