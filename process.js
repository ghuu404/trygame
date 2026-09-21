(function() {
'use strict';

/* ==================== 仓库 ==================== */
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
var inventory = warehouse.herbs;
var materialInventory = warehouse.materials;
var processedInventory = warehouse.processed;
function saveInventory() { warehouse.herbs = inventory; saveWarehouse(warehouse); }
function saveMaterial()  { warehouse.materials = materialInventory; saveWarehouse(warehouse); }
function saveProcessed() { warehouse.processed = processedInventory; saveWarehouse(warehouse); }

function getCoins() { return parseInt(localStorage.getItem('coins') || 0); }
function setCoins(n) { localStorage.setItem('coins', String(n)); }

/* ==================== 工具 / 辅料 ==================== */
var TOOLS_LEFT = {
    cut:    { name: '切刀', icon: '🔪' },
    scrape: { name: '刮刀', icon: '🪒' },
    peel:   { name: '镊子', icon: '🥢' },
    remove: { name: '针挑', icon: '📌' },
    smash:  { name: '研钵', icon: '🥣' },
    break:  { name: '手擘', icon: '🤲' }
};
var TOOLS_RIGHT = {
    fry:    { name: '炒锅', icon: '🍳' },
    fire:   { name: '火炉', icon: '🔥' },
    wash:   { name: '水洗', icon: '💧' },
    dry:    { name: '晒干', icon: '☀️' }
};
var MATERIALS = {
    '黄酒':    { icon: '🍶', price: 4 },
    '蜂蜜':    { icon: '🍯', price: 5 },
    '盐':      { icon: '🧂', price: 2 },
    '姜汁':    { icon: '🫚', price: 4 },
    '醋':      { icon: '🍾', price: 3 },
    '清水':    { icon: '💧', price: 1 },
    '白矾':    { icon: '⬜', price: 3 },
    '麦麸':    { icon: '🌾', price: 2 },
    '米泔水':  { icon: '🍚', price: 2 },
    '甘草水':  { icon: '🍵', price: 5 },
    '石灰水':  { icon: '🥛', price: 2 },
    '黑豆汁':  { icon: '🫘', price: 6 }
};

/* ==================== 炮制规则（多路径版） ==================== */
var HERB_PROCESSES = {
    '桂枝': { routes: [
        { name: '切片', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '桂枝饮片' }
    ]},
    '麻黄': { routes: [
        { name: '去节', steps: [ {tool:'wash'}, {tool:'remove'} ], result: '麻黄饮片' }
    ]},
    '山杏': { routes: [
        { name: '去皮尖', steps: [ {tool:'wash'}, {tool:'peel'} ], result: '杏仁饮片' }
    ]},
    '甘草': { routes: [
        { name: '蜜炙', steps: [ {tool:'wash'}, {tool:'cut'}, {material:'蜂蜜'} ], result: '炙甘草' }
    ]},
    '芍药': { routes: [
        { name: '切片', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '芍药饮片' }
    ]},
    /* ★ 生姜：两条炮炙途径 ★ */
    '生姜': { routes: [
        { name: '切片 → 生姜饮片', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '生姜饮片' },
        { name: '晒干 → 干姜饮片', steps: [ {tool:'wash'}, {tool:'dry'} ], result: '干姜饮片' }
    ]},
    '干姜': { routes: [
        { name: '切片', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '干姜饮片' }
    ]},
    '大枣': { routes: [
        { name: '擘开', steps: [ {tool:'wash'}, {tool:'break'} ], result: '大枣饮片' }
    ]},
    '葛根': { routes: [
        { name: '切片', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '葛根饮片' }
    ]},
    '细辛': { routes: [
        { name: '切段', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '细辛饮片' }
    ]},
    '柴胡': { routes: [
        { name: '切片', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '柴胡饮片' }
    ]},
    '黄芩': { routes: [
        { name: '切片', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '黄芩饮片' }
    ]},
    '知母': { routes: [
        { name: '去毛', steps: [ {tool:'wash'}, {tool:'scrape'} ], result: '知母饮片' }
    ]},
    '附子': { routes: [
        { name: '炮制', steps: [ {tool:'wash'}, {tool:'fire'}, {tool:'peel'} ], result: '炮附子' }
    ]},
    '白术': { routes: [
        { name: '炒制', steps: [ {tool:'wash'}, {tool:'cut'}, {tool:'fry'} ], result: '炒白术' }
    ]},
    '大黄': { routes: [
        { name: '酒洗', steps: [ {tool:'wash'}, {material:'黄酒'} ], result: '大黄饮片' }
    ]},
    '厚朴': { routes: [
        { name: '姜炙', steps: [ {tool:'wash'}, {tool:'scrape'}, {material:'姜汁'} ], result: '厚朴饮片' }
    ]},
    '枳实': { routes: [
        { name: '炒制', steps: [ {tool:'wash'}, {tool:'cut'}, {tool:'fry'} ], result: '枳实饮片' }
    ]},
    '猪苓': { routes: [
        { name: '去皮', steps: [ {tool:'wash'}, {tool:'scrape'} ], result: '猪苓饮片' }
    ]},
    '当归': { routes: [
        { name: '酒洗', steps: [ {tool:'wash'}, {material:'黄酒'} ], result: '当归饮片' }
    ]},
    '泽泻': { routes: [
        { name: '盐炙', steps: [ {tool:'wash'}, {tool:'cut'}, {material:'盐'} ], result: '泽泻饮片' }
    ]},
    '栀子': { routes: [
        { name: '擘开', steps: [ {tool:'wash'}, {tool:'break'} ], result: '栀子饮片' }
    ]},
    '半夏': { routes: [
        { name: '姜制', steps: [ {material:'清水'}, {material:'白矾'}, {material:'姜汁'} ], result: '半夏饮片' }
    ]},
    '茯苓': { routes: [
        { name: '切块', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '茯苓饮片' }
    ]},
    '五味子': { routes: [
        { name: '晒干', steps: [ {tool:'wash'}, {tool:'dry'} ], result: '五味子饮片' }
    ]},
    '茵陈': { routes: [
        { name: '切片', steps: [ {tool:'wash'}, {tool:'cut'} ], result: '茵陈饮片' }
    ]},
    '人参': { routes: [
        { name: '水洗', steps: [ {tool:'wash'} ], result: '人参饮片' }
    ]},
    '黄连': { routes: [
        { name: '水洗', steps: [ {tool:'wash'} ], result: '黄连饮片' }
    ]},
    '通草': { routes: [
        { name: '水洗', steps: [ {tool:'wash'} ], result: '通草饮片' }
    ]},
    '石膏': { routes: [
        { name: '碎', steps: [ {tool:'smash'} ], result: '碎石膏' }
    ]},
    '芒硝': { routes: [
        { name: '（无需炮制）', steps: [], result: '芒硝' }
    ]},
    '粳米': { routes: [
        { name: '（无需炮制）', steps: [], result: '粳米' }
    ]}
};

/* ==================== 元素 ==================== */
var herbRowTop, herbRowBottom, leftTools, rightTools;
var stageHerbImg, stageEmoji, stageEl, counterHerb, stepListEl;
var btnFinish, btnCancel, modalOverlayEl, modalBoxEl, coinTextEl;
var procBound = false;

var currentHerb = null;      /* 正在炮制的生药名 */
var currentRoute = null;     /* 选中的路径对象 */
var currentProcessed = null; /* 完成后产物名 */
var stepIndex = 0;

/* ==================== 初始化 ==================== */
function initProcess() {
    /* ★ 每次进入页面都重新从 localStorage 读取 */
    warehouse = getWarehouse();
    inventory = warehouse.herbs;
    materialInventory = warehouse.materials;
    processedInventory = warehouse.processed;

    herbRowTop = document.getElementById('procHerbRowTop');
    herbRowBottom = document.getElementById('procHerbRowBottom');
    leftTools = document.getElementById('procLeftTools');
    rightTools = document.getElementById('procRightTools');
    stageHerbImg = document.getElementById('procStageHerbImg');
    stageEmoji = document.getElementById('procStageEmoji');
    stageEl = document.getElementById('procStage');
    counterHerb = document.getElementById('procCounterHerb');
    stepListEl = document.getElementById('procStepList');
    btnFinish = document.getElementById('btnProcFinish');
    btnCancel = document.getElementById('btnProcCancel');
    modalOverlayEl = document.getElementById('procModalOverlay');
    modalBoxEl = document.getElementById('procModalBox');
    coinTextEl = document.getElementById('procCoinText');

    if (!procBound) {
        bindProcessEvents();
        procBound = true;
    }
    renderHerbRows();
    renderTools();
    updateCoinDisplay();
    stageHerbImg.style.display = 'none';
    stageEmoji.style.display = 'none';
}

function updateCoinDisplay() {
    if (coinTextEl) coinTextEl.textContent = getCoins();
}

function bindProcessEvents() {
    document.getElementById('btnProcBack').addEventListener('click', function() {
        window.switchPage('main');
    });
    document.getElementById('btnProcManual').addEventListener('click', showManual);
    document.getElementById('btnProcShop').addEventListener('click', openShop);
    btnFinish.addEventListener('click', onFinish);
    btnCancel.addEventListener('click', onCancel);
}

/* ==================== 渲染药材栏 ==================== */
function renderHerbRows() {
    var allHerbs = Object.keys(inventory).filter(function(n) { return inventory[n] > 0; }).sort();
    var mid = Math.ceil(allHerbs.length / 2);
    renderRow(herbRowTop, allHerbs.slice(0, mid));
    renderRow(herbRowBottom, allHerbs.slice(mid));
}

function renderRow(rowEl, herbs) {
    rowEl.innerHTML = '';
    if (herbs.length === 0) {
        var slot = document.createElement('div');
        slot.className = 'proc-herb-slot empty';
        slot.textContent = '仓库暂无药材，先去采药吧';
        slot.style.width = '100%';
        rowEl.appendChild(slot);
        return;
    }
    for (var i = 0; i < herbs.length; i++) {
        (function(name) {
            var slot = document.createElement('div');
            slot.className = 'proc-herb-slot';
            if (currentHerb === name) slot.classList.add('selected');
            var img = document.createElement('img');
            img.src = 'images/herbs/' + encodeURI(name) + '.webp';
            img.addEventListener('error', function() { this.style.display = 'none'; });
            slot.appendChild(img);
            var nm = document.createElement('span');
            nm.className = 'ph-name';
            nm.textContent = name;
            slot.appendChild(nm);
            var cnt = document.createElement('span');
            cnt.className = 'ph-count';
            cnt.textContent = 'x' + inventory[name];
            slot.appendChild(cnt);
            slot.addEventListener('click', function() { selectHerb(name); });
            rowEl.appendChild(slot);
        })(herbs[i]);
    }
}

/* ==================== 渲染工具 / 辅料 ==================== */
function renderTools() {
    leftTools.innerHTML = '';
    renderToolBtns(leftTools, TOOLS_LEFT);
    renderToolBtns(leftTools, TOOLS_RIGHT);
    rightTools.innerHTML = '';
    renderMaterialBtns();
}

function renderToolBtns(container, toolsObj) {
    var keys = Object.keys(toolsObj);
    for (var i = 0; i < keys.length; i++) {
        (function(key) {
            var tool = toolsObj[key];
            var btn = document.createElement('div');
            btn.className = 'proc-tool-btn';
            var img = document.createElement('img');
            img.src = 'images/tools/' + key + '.webp';
            img.addEventListener('error', function() {
                this.style.display = 'none';
                var span = document.createElement('span');
                span.style.fontSize = '22px';
                span.textContent = tool.icon;
                btn.insertBefore(span, btn.firstChild);
            });
            btn.appendChild(img);
            var name = document.createElement('span');
            name.textContent = tool.name;
            btn.appendChild(name);
            btn.addEventListener('click', function() { useTool(key); });
            container.appendChild(btn);
        })(keys[i]);
    }
}

function renderMaterialBtns() {
    var names = Object.keys(MATERIALS);
    for (var i = 0; i < names.length; i++) {
        (function(name) {
            var info = MATERIALS[name];
            var count = materialInventory[name] || 0;
            var btn = document.createElement('div');
            btn.className = 'proc-material-btn' + (count <= 0 ? ' out' : '');
            var img = document.createElement('img');
            img.src = 'images/materials/' + encodeURI(name) + '.webp';
            img.addEventListener('error', function() {
                this.style.display = 'none';
                var span = document.createElement('span');
                span.style.fontSize = '22px';
                span.textContent = info.icon;
                btn.insertBefore(span, btn.firstChild);
            });
            btn.appendChild(img);
            var nm = document.createElement('span');
            nm.textContent = name;
            btn.appendChild(nm);
            var cnt = document.createElement('span');
            cnt.className = 'pm-count';
            cnt.textContent = 'x' + count;
            btn.appendChild(cnt);
            btn.addEventListener('click', function() { useMaterial(name); });
            rightTools.appendChild(btn);
        })(names[i]);
    }
}

/* ==================== 舞台图片 ==================== */
function setStageImg(imgName, herbName, isProcessed) {
    stageHerbImg.style.display = 'none';
    stageEmoji.style.display = 'none';
    stageHerbImg.src = '';
    if (!imgName) return;

    var candidates = [];
    if (isProcessed) {
        candidates.push('images/processed/' + imgName + '.webp');
        if (herbName && herbName !== imgName) {
            candidates.push('images/herbs/' + herbName + '.webp');
        }
    } else {
        candidates.push('images/herbs/' + imgName + '.webp');
    }

    var idx = 0;
    stageHerbImg.onerror = function() {
        idx++;
        if (idx < candidates.length) {
            this.src = candidates[idx];
        } else {
            this.style.display = 'none';
            stageEmoji.style.display = 'block';
            stageEmoji.textContent = '🌿';
        }
    };
    stageHerbImg.onload = function() {
        this.style.display = 'block';
        stageEmoji.style.display = 'none';
    };
    stageHerbImg.src = candidates[0];
}

/* ==================== 步骤列表 ==================== */
function renderStepList() {
    stepListEl.innerHTML = '';
    if (!currentHerb || !currentRoute) return;
    if (currentRoute.steps.length === 0) {
        stepListEl.innerHTML = '<span class="step-todo">无需炮制</span>';
        return;
    }
    var html = '';
    for (var i = 0; i < currentRoute.steps.length; i++) {
        var s = currentRoute.steps[i];
        var label = s.tool
            ? (TOOLS_LEFT[s.tool] || TOOLS_RIGHT[s.tool]).name
            : s.material;
        var cls = i < stepIndex ? 'step-done' : (i === stepIndex ? 'step-active' : 'step-todo');
        var mark = i < stepIndex ? '✓ ' : (i === stepIndex ? '▶ ' : '· ');
        html += '<span class="' + cls + '">' + mark + label + '</span>';
        if (i < currentRoute.steps.length - 1) html += ' → ';
    }
    stepListEl.innerHTML = html;
}

/* ==================== 选药材 ==================== */
function selectHerb(name) {
    if (currentHerb) { showProcModal('提示', '操作台上已有药材。', true); return; }
    if (inventory[name] <= 0) { showProcModal('提示', '库存不足！', true); return; }
    var proc = HERB_PROCESSES[name];
    if (!proc) { showProcModal('提示', '这个药材暂时不支持炮制。', true); return; }

    if (proc.routes.length === 1) {
        beginHerb(name, 0);
    } else {
        chooseRoute(name, proc);
    }
}

/* ==================== 多路径时弹选择框 ==================== */
function chooseRoute(name, proc) {
    var html = '<div style="margin-bottom:10px;color:#5a3e2b;text-align:center;">【' + name + '】有多种炮制途径，请选择：</div>';
    for (var i = 0; i < proc.routes.length; i++) {
        (function(r, idx) {
            var stepDesc;
            if (r.steps.length === 0) {
                stepDesc = '无需炮制';
            } else {
                stepDesc = r.steps.map(function(s) {
                    return s.tool ? (TOOLS_LEFT[s.tool] || TOOLS_RIGHT[s.tool]).name : s.material;
                }).join(' → ');
            }
            html += '<button class="modal-btn route-pick" data-idx="' + idx + '" ' +
                'style="text-align:left;padding:10px 14px;line-height:1.3;">' +
                '<div style="font-size:15px;font-weight:bold;">' + r.name + '</div>' +
                '<div style="font-size:11px;font-weight:normal;color:#7a5c3a;margin-top:3px;">' +
                    stepDesc + ' → ' + r.result +
                '</div>' +
            '</button>';
        })(proc.routes[i], i);
    }
    html += '<button class="modal-btn" id="routeCancel" ' +
            'style="background:#e0e0e0;border-color:#999;color:#555;">取消</button>';

    modalBoxEl.innerHTML = '<div class="modal-title">选择炮制途径</div>' +
        '<div style="text-align:left;font-size:12px;line-height:1.6;">' + html + '</div>';
    modalOverlayEl.classList.add('active');

    var btns = modalBoxEl.querySelectorAll('.route-pick');
    for (var k = 0; k < btns.length; k++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(btn.getAttribute('data-idx'));
                modalOverlayEl.classList.remove('active');
                beginHerb(name, idx);
            });
        })(btns[k]);
    }
    var cancelBtn = document.getElementById('routeCancel');
    if (cancelBtn) cancelBtn.addEventListener('click', function() {
        modalOverlayEl.classList.remove('active');
    });
}

/* ==================== 正式开始炮制 ==================== */
function beginHerb(name, routeIndex) {
    var proc = HERB_PROCESSES[name];
    if (!proc) return;
    var route = proc.routes[routeIndex];
    if (!route) return;
    if (currentHerb) { showProcModal('提示', '操作台上已有药材。', true); return; }
    if (inventory[name] <= 0) { showProcModal('提示', '库存不足！', true); return; }

    inventory[name] -= 1;
    saveInventory();
    currentHerb = name;
    currentRoute = route;
    currentProcessed = null;
    stepIndex = 0;

    if (route.steps.length === 0) {
        /* 零步药材：直接显示饮片图 */
        setStageImg(route.result, name, true);
        btnFinish.disabled = false;
    } else {
        setStageImg(name, name, false);
        btnFinish.disabled = true;
    }
    counterHerb.textContent = '生药：' + name + (route.name && proc.routes.length > 1 ? ' · ' + route.name : '');
    btnCancel.disabled = false;
    renderStepList();
    renderHerbRows();
}

/* ==================== 用工具 / 辅料 ==================== */
function useTool(key) {
    if (!currentHerb) { showProcModal('提示', '请先选择药材。', true); return; }
    if (currentProcessed) { showProcModal('提示', '已完成，点"收好"。', true); return; }
    if (!currentRoute || currentRoute.steps.length === 0) {
        if (window.playSound) window.playSound('click');
        showProcModal('提示', '【' + currentHerb + '】无需炮制。', true);
        return;
    }
    var step = currentRoute.steps[stepIndex];
    if (!step) return;
    if (!step.tool || step.tool !== key) {
        var want = step.tool ? (TOOLS_LEFT[step.tool] || TOOLS_RIGHT[step.tool]).name : step.material;
        showProcModal('提示', '当前步骤需要：' + want, true);
        return;
    }
    playToolAnim(key, function() { advanceStep(); });
}

function useMaterial(name) {
    if (!currentHerb) { showProcModal('提示', '请先选择药材。', true); return; }
    if (currentProcessed) { showProcModal('提示', '已完成，点"收好"。', true); return; }
    if (!currentRoute || currentRoute.steps.length === 0) {
        showProcModal('提示', '【' + currentHerb + '】无需炮制。', true);
        return;
    }
    var step = currentRoute.steps[stepIndex];
    if (!step) return;
    if (!step.material || step.material !== name) {
        var want = step.tool ? (TOOLS_LEFT[step.tool] || TOOLS_RIGHT[step.tool]).name : step.material;
        showProcModal('提示', '当前步骤需要：' + want, true);
        return;
    }
    if (!materialInventory[name] || materialInventory[name] <= 0) {
        showProcModal('辅料不足', '【' + name + '】已用完。\n请点击"购买辅料"补充。', true);
        return;
    }
    materialInventory[name] -= 1;
    saveMaterial();
    renderTools();
    playMaterialAnim(name, function() { advanceStep(); });
}

function advanceStep() {
    if (!currentRoute) return;
    stepIndex++;
    if (stepIndex >= currentRoute.steps.length) {
        currentProcessed = currentRoute.result;
        setStageImg(currentRoute.result, currentHerb, true);
        counterHerb.textContent = '炮制品：' + currentRoute.result;
        btnFinish.disabled = false;
    } else {
        setStageImg(currentHerb, currentHerb, false);
        counterHerb.textContent = '炮制中：' + currentHerb;
    }
    renderStepList();
}

/* ==================== 动画 ==================== */
function playToolAnim(key, callback) {
    var tool = TOOLS_LEFT[key] || TOOLS_RIGHT[key];
    var el = document.createElement('div');
    el.className = 'proc-stage-anim';
    var img = document.createElement('img');
    img.src = 'images/tools/' + key + '.webp';
    img.style.width = '60px';
    img.style.height = '60px';
    img.style.objectFit = 'contain';
    img.addEventListener('error', function() {
        this.style.display = 'none';
        var span = document.createElement('span');
        span.style.fontSize = '40px';
        span.textContent = tool.icon;
        el.appendChild(span);
    });
    el.appendChild(img);
    el.style.top = '-60px';
    el.style.left = '50%';
    el.style.webkitTransform = 'translateX(-50%)';
    el.style.transform = 'translateX(-50%)';
    el.style.opacity = '0';
    stageEl.appendChild(el);
    requestAnimationFrame(function() {
        el.style.top = '8px';
        el.style.opacity = '1';
    });
    setTimeout(function() { stageHerbImg.classList.add('proc-shake'); }, 350);
    setTimeout(function() {
        stageHerbImg.classList.remove('proc-shake');
        el.style.top = '-60px';
        el.style.opacity = '0';
    }, 700);
    setTimeout(function() { el.remove(); if (callback) callback(); }, 1100);
}

function playMaterialAnim(name, callback) {
    var info = MATERIALS[name];
    var el = document.createElement('div');
    el.className = 'proc-stage-anim';
    var img = document.createElement('img');
    img.src = 'images/materials/' + encodeURI(name) + '.webp';
    img.style.width = '60px';
    img.style.height = '60px';
    img.style.objectFit = 'contain';
    img.addEventListener('error', function() {
        this.style.display = 'none';
        var span = document.createElement('span');
        span.style.fontSize = '40px';
        span.textContent = info.icon;
        el.appendChild(span);
    });
    el.appendChild(img);
    el.style.right = '-60px';
    el.style.top = '50%';
    el.style.opacity = '0';
    stageEl.appendChild(el);
    requestAnimationFrame(function() {
        el.style.right = '15px';
        el.style.top = '30%';
        el.style.opacity = '1';
    });
    setTimeout(function() { el.style.opacity = '0'; stageHerbImg.classList.add('proc-shake'); }, 600);
    setTimeout(function() { stageHerbImg.classList.remove('proc-shake'); }, 1000);
    setTimeout(function() { el.remove(); if (callback) callback(); }, 1200);
}

/* ==================== 收好 / 放弃 ==================== */
function onFinish() {
    if (!currentHerb || !currentRoute) return;
    if (window.playSound) window.playSound('success');
    var resultName = currentRoute.result;
    processedInventory[resultName] = (processedInventory[resultName] || 0) + 10;
    saveProcessed();
    resetStage();
}

function onCancel() {
    if (currentHerb) {
        inventory[currentHerb] = (inventory[currentHerb] || 0) + 1;
        saveInventory();
    }
    resetStage();
}

function resetStage() {
    currentHerb = null;
    currentRoute = null;
    currentProcessed = null;
    stepIndex = 0;
    stageHerbImg.style.display = 'none';
    stageEmoji.style.display = 'none';
    counterHerb.textContent = '请选择药材';
    stepListEl.innerHTML = '';
    btnFinish.disabled = true;
    btnCancel.disabled = true;
    renderHerbRows();
}

/* ==================== 说明书 ==================== */
function showManual() {
    var html = '<h4 style="color:#33691e;margin-bottom:6px;">🌿 药材炮制指南</h4>';
    var keys = Object.keys(HERB_PROCESSES);
    for (var i = 0; i < keys.length; i++) {
        (function(herb) {
            var proc = HERB_PROCESSES[herb];
            for (var ri = 0; ri < proc.routes.length; ri++) {
                var route = proc.routes[ri];
                if (route.steps.length === 0) {
                    html += '<div style="font-size:12px;"><b>' + herb + '</b>：无需炮制 → ' + route.result + '</div>';
                    continue;
                }
                var steps = [];
                for (var j = 0; j < route.steps.length; j++) {
                    var s = route.steps[j];
                    if (s.tool) {
                        var t = TOOLS_LEFT[s.tool] || TOOLS_RIGHT[s.tool];
                        steps.push(t.name);
                    } else {
                        steps.push(s.material);
                    }
                }
                var prefix = proc.routes.length > 1
                    ? '<b>' + herb + '</b>（' + route.name + '）：'
                    : '<b>' + herb + '</b>：';
                html += '<div style="font-size:12px;">' + prefix + steps.join(' → ') + ' → ' + route.result + '</div>';
            }
        })(keys[i]);
    }
    showProcModal('炮制说明书', html, true, true);
}

/* ==================== 购买辅料 ==================== */
function openShop() {
    var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;">';
    var names = Object.keys(MATERIALS);
    for (var i = 0; i < names.length; i++) {
        (function(name) {
            var info = MATERIALS[name];
            var count = materialInventory[name] || 0;
            html += '<div style="background:#f0e6d8;border:2px solid #aed581;border-radius:14px;padding:10px 6px;display:flex;flex-direction:column;align-items:center;">' +
                '<img class="auto-hide" src="images/materials/' + encodeURI(name) + '.webp" style="width:50px;height:50px;object-fit:contain;">' +
                '<div style="font-size:14px;font-weight:bold;color:#33691e;margin-top:4px;">' + name + '</div>' +
                '<div style="font-size:13px;font-weight:bold;color:#c62828;display:flex;align-items:center;justify-content:center;gap:2px;">' +
                    '<img class="auto-hide" src="images/icon-coin.webp" style="width:14px;height:14px;object-fit:contain;">' +
                    '<span>' + info.price + '</span>' +
                '</div>' +
                '<div class="shop-stock" style="font-size:11px;color:#777;">库存：' + count + '</div>' +
                '<button class="proc-shop-buy" data-material="' + name + '" data-price="' + info.price + '" style="width:100%;padding:6px 0;border:2px solid #558b2f;border-radius:18px;background:#aed581;color:#33691e;font-weight:bold;font-size:13px;cursor:pointer;font-family:inherit;margin-top:4px;">购买</button>' +
            '</div>';
        })(names[i]);
    }
    html += '</div>';
    showProcModal('🛒 购买辅料', html, true, false);

    window.bindImgFallback(modalBoxEl);

    setTimeout(function() {
        var btns = modalBoxEl.querySelectorAll('.proc-shop-buy');
        for (var k = 0; k < btns.length; k++) {
            (function(btn) {
                btn.addEventListener('click', function() {
                    var mat = btn.getAttribute('data-material');
                    var price = parseInt(btn.getAttribute('data-price'));
                    var cur = getCoins();
                    if (cur < price) { alert('铜币不足'); return; }
                    setCoins(cur - price);
                    updateCoinDisplay();
                    materialInventory[mat] = (materialInventory[mat] || 0) + 1;
                    saveMaterial();
                    renderTools();
                    var card = btn.parentElement;
                    card.querySelector('.shop-stock').textContent = '库存：' + materialInventory[mat];
                });
            })(btns[k]);
        }
    }, 50);
}

/* ==================== 弹窗 ==================== */
function showProcModal(title, html, noButton, isManual) {
    var inner = '<div class="modal-title">' + title + '</div>';
    if (isManual) {
        inner += '<div style="text-align:left;font-size:12px;line-height:1.6;max-height:55vh;overflow-y:auto;">' + html + '</div>';
    } else {
        inner += '<div class="modal-text">' + html + '</div>';
    }
    inner += '<button class="modal-btn" id="procModalOk">确定</button>';
    modalBoxEl.innerHTML = inner;
    modalOverlayEl.classList.add('active');
    document.getElementById('procModalOk').addEventListener('click', function() {
        modalOverlayEl.classList.remove('active');
    });
}

/* ==================== 暴露给 main.js ==================== */
window.initProcess = initProcess;

})();