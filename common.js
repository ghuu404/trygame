/* ================================================================
 * common.js — 重生之我是赤脚医生 · 全局数据层
 * ================================================================ */

const CFG = {
  MAX_STAMINA: 5,
  KEY: {
    stamina: 'bc_stamina',
    coins:   'bc_coins',
    bag:     'bc_bag',
    slices:  'bc_slices',
    seeds:   'bc_seeds',
    plots:   'bc_plots',
    level:   'bc_level',
    exp:     'bc_exp',
    tips:    'bc_tips'
  }
};

const LEVEL_TABLE = [
  { lv: 1, expNeed: 2, bagCap: 30  },
  { lv: 2, expNeed: 3, bagCap: 50  },
  { lv: 3, expNeed: 5, bagCap: 80  },
  { lv: 4, expNeed: 8, bagCap: 120 },
  { lv: 5, expNeed: 0, bagCap: 200 }
];

const Store = {
  get(key, def) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? def : JSON.parse(raw);
    } catch (e) { return def; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

const Player = {
  getStamina()      { return Math.min(Store.get(CFG.KEY.stamina, CFG.MAX_STAMINA), CFG.MAX_STAMINA); },
  setStamina(v)     { Store.set(CFG.KEY.stamina, Math.max(0, Math.min(v, CFG.MAX_STAMINA))); },
  useStamina(n = 1) { const s = this.getStamina(); if (s < n) return false; this.setStamina(s - n); return true; },

  getCoins()  { return Store.get(CFG.KEY.coins, 0); },
  addCoins(n) { Store.set(CFG.KEY.coins, Math.max(0, this.getCoins() + n)); },
  spendCoins(n) {
    const c = this.getCoins();
    if (c < n) return false;
    Store.set(CFG.KEY.coins, c - n);
    return true;
  },

  getBag()     { return Store.get(CFG.KEY.bag, {}); },
  bagTotal()   { return Object.values(this.getBag()).reduce((a, b) => a + b, 0); },
  bagHas(name) { return (this.getBag()[name] || 0) > 0; },
  addToBag(name, qty = 1) {
    const bag = this.getBag();
    const space = this.getBagCap() - this.bagTotal();
    const real = Math.max(0, Math.min(qty, space));
    if (real <= 0) return 0;
    bag[name] = (bag[name] || 0) + real;
    Store.set(CFG.KEY.bag, bag);
    return real;
  },
  removeFromBag(name, qty = 1) {
    const bag = this.getBag();
    if ((bag[name] || 0) < qty) return false;
    bag[name] -= qty;
    if (bag[name] <= 0) delete bag[name];
    Store.set(CFG.KEY.bag, bag);
    return true;
  },

  getSlices() { return Store.get(CFG.KEY.slices, {}); },
  addSlice(name, qty = 1) {
    const s = this.getSlices();
    s[name] = (s[name] || 0) + qty;
    Store.set(CFG.KEY.slices, s);
  },

  getLevel() { return Store.get(CFG.KEY.level, 1); },
  getExp()   { return Store.get(CFG.KEY.exp, 0); },
  getBagCap() {
    const row = LEVEL_TABLE.find(r => r.lv === this.getLevel());
    return row ? row.bagCap : LEVEL_TABLE[0].bagCap;
  },
  getExpNeed() {
    const row = LEVEL_TABLE.find(r => r.lv === this.getLevel());
    return row ? row.expNeed : 0;
  },
  addExp(n) {
    let lv = this.getLevel(), exp = this.getExp() + n, leveled = false;
    while (true) {
      const row = LEVEL_TABLE.find(r => r.lv === lv);
      if (!row || row.expNeed <= 0) break;
      if (exp >= row.expNeed) { exp -= row.expNeed; lv += 1; leveled = true; }
      else break;
    }
    Store.set(CFG.KEY.level, lv);
    Store.set(CFG.KEY.exp, exp);
    return { leveled, newLevel: lv };
  },

  getTips() { return Store.get(CFG.KEY.tips, 3); },
  useTip()  { const t = this.getTips(); if (t <= 0) return false; Store.set(CFG.KEY.tips, t - 1); return true; }
};

const HERB_DB = {
  '桂枝':   { area:'forest',   emoji:'🌿', plantable:false, process:'去皮',       aux:'无',     cat:'净制切制', formula:'桂枝汤',                 simple:'刮去粗皮' },
  '茯苓':   { area:'forest',   emoji:'🍄', plantable:false, process:'无需炮制',   aux:'无',     cat:'无需炮制', formula:'五苓散',                 simple:'无' },
  '葛根':   { area:'forest',   emoji:'🥕', plantable:false, process:'切片',       aux:'无',     cat:'净制切制', formula:'葛根汤',                 simple:'切片' },
  '黄连':   { area:'forest',   emoji:'🌼', plantable:false, process:'无需炮制',   aux:'无',     cat:'无需炮制', formula:'半夏泻心汤',             simple:'无' },
  '人参':   { area:'forest',   emoji:'🫚', plantable:false, process:'无需炮制',   aux:'无',     cat:'无需炮制', formula:'理中汤',                 simple:'无' },
  '细辛':   { area:'forest',   emoji:'🌱', plantable:false, process:'无需炮制',   aux:'无',     cat:'无需炮制', formula:'小青龙汤',               simple:'无' },
  '猪苓':   { area:'forest',   emoji:'🍄', plantable:false, process:'去皮',       aux:'无',     cat:'净制切制', formula:'五苓散',                 simple:'刮去外皮' },
  '厚朴':   { area:'forest',   emoji:'🪵', plantable:false, process:'姜炙',       aux:'生姜汁', cat:'液体辅料', formula:'栀子厚朴汤',             simple:'姜汁拌炒' },
  '枳实':   { area:'forest',   emoji:'🍊', plantable:false, process:'炙',         aux:'无',     cat:'火制',     formula:'大承气汤、栀子厚朴汤',   simple:'水浸→去瓤→炒黄' },

  '麻黄':   { area:'mountain', emoji:'🌾', plantable:false, process:'去节',       aux:'无',     cat:'净制切制', formula:'麻黄汤、小青龙汤',       simple:'摘除节部' },
  '杏仁':   { area:'mountain', emoji:'🌰', plantable:false, process:'熬（炒）',   aux:'无',     cat:'火制',     formula:'大陷胸丸',           
