(function () {
'use strict';

var SOUNDS = {
    click:   'sounds/click.mp3',
    success: 'sounds/success.mp3',
    fail:    'sounds/fail.mp3',
    pick:    'sounds/pick.mp3',
    bag:     'sounds/bag.mp3',
    coin:    'sounds/coin.mp3'
};

var MUTE_KEY = 'soundMuted';
var unlocked = false;
var cache = {};

function isMuted() { return localStorage.getItem(MUTE_KEY) === '1'; }
function setMuted(m) {
    localStorage.setItem(MUTE_KEY, m ? '1' : '0');
    updateToggleUI();
}
function toggleMute() { setMuted(!isMuted()); }

function unlock() {
    if (unlocked) return;
    unlocked = true;
    /* 用一个空音频播一次，触发浏览器的音频权限解锁 */
    try {
        var a = new Audio();
        a.volume = 0;
        a.play().catch(function () {});
    } catch (e) {}
}

function preload() {
    Object.keys(SOUNDS).forEach(function (k) {
        try {
            var a = new Audio();
            a.src = SOUNDS[k];
            a.preload = 'auto';
            cache[k] = a;
        } catch (e) {}
    });
}

function play(name) {
    if (isMuted()) return;
    if (!unlocked) unlock();
    var base = cache[name];
    if (!base) return;
    try {
        var a = base.cloneNode();
        a.volume = 0.75;
        a.play().catch(function () {});
    } catch (e) {}
}

/* 更新所有页面的喇叭按钮图标 */
function updateToggleUI() {
    var btns = document.querySelectorAll('.sound-toggle');
    var muted = isMuted();
    for (var i = 0; i < btns.length; i++) {
        btns[i].textContent = muted ? '🔇' : '🔊';
        btns[i].setAttribute('data-muted', muted ? '1' : '0');
    }
}

/* 首次任意点击/触摸自动解锁 */
document.addEventListener('touchstart', unlock, { once: true, passive: true });
document.addEventListener('click', unlock, { once: true });

window.playSound = play;
window.isSoundMuted = isMuted;
window.setSoundMuted = setMuted;
window.toggleSoundMute = toggleMute;
window.updateSoundToggleUI = updateToggleUI;

/* 页面加载后预加载音频 */
window.addEventListener('load', function () {
    preload();
    updateToggleUI();
});

})();