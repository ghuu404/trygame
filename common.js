/* common.js — 全局数据层 */
const CFG = {
  MAX_STAMINA: 5,
  KEY: { stamina:'bc_stamina', coins:'bc_coins', bag:'bc_bag', slices:'bc_slices',
         seeds:'bc_seeds', plots:'bc_plots', level:'bc_level', exp:'bc_exp', tips:'bc_tips' }
};
const LEVEL_TABLE = [
  { lv:1, expNeed:2, bagCap:30 },
  { lv:2, expNeed:3, bagCap:50 },
  { lv:3, expNeed:5, bagCap:80 },
  { lv:4, expNeed:8, bagCap:120 },
  { lv:5, expNeed:0, bagCap:200 }
];
const Store = {
  get(k, d) { try { const r = localStorage.getItem(k); return r === null ? d : JSON.parse(r); } catch(e){ return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};
const Player = {
  getStamina() { return Math.min(Store.get(CFG.KEY.stamina, CFG.MAX_STAMINA), CFG.MAX_STAMINA); },
  setStamina(v){ Store.set(CFG.KEY.stamina, Math.max(0, Math.min(v, CFG.MAX_STAMINA))); },
  useStamina(n=1){ const s=this.getStamina(); if(s<n) return false; this.setStamina(s-n); return true; },
  getCoins() { return Store.get(CFG.KEY.coins, 0); },
  addCoins(n){ Store.set(CFG.KEY.coins, Math.max(0, this.getCoins()+n)); },
  spendCoins(n){ const c=this.getCoins(); if(c<n) return false; Store.set(CFG.KEY.coins, c-n); return true; },
  getBag() { return Store.get(CFG.KEY.bag, {}); },
  bagTotal() { return Object.values(this.getBag()).reduce((a,b)=>a+b, 0); },
  addToBag(name, qty=1) {
    const bag=this.getBag(); const space=this.getBagCap()-this.bagTotal();
    const real=Math.max(0, Math.min(qty, space)); if(real<=0) return 0;
    bag[name]=(bag[name]||0)+real; Store.set(CFG.KEY.bag, bag); return real;
  },
  removeFromBag(name, qty=1) {
    const bag=this.getBag(); if((bag[name]||0)<qty) return false;
    bag[name]-=qty; if(bag[name]<=0) delete bag[name]; Store.set(CFG.KEY.bag, bag); return true;
  },
  getSlices(){ return Store.get(CFG.KEY.slices, {}); },
  addSlice(name, qty=1){ const s=this.getSlices(); s[name]=(s[name]||0)+qty; Store.set(CFG.KEY.slices, s); },
  getLevel(){ return Store.get(CFG.KEY.level, 1); },
  getExp(){ return Store.get(CFG.KEY.exp, 0); },
  getBagCap(){ const row=LEVEL_TABLE.find(r=>r.lv===this.getLevel()); return row?row.bagCap:LEVEL_TABLE[0].bagCap; },
  getExpNeed(){ const row=LEVEL_TABLE.find(r=>r.lv===this.getLevel()); return row?row.expNeed:0; },
  addExp(n){ let lv=this.getLevel(), exp=this.getExp()+n, leveled=false;
    while(true){ const row=LEVEL_TABLE.find(r=>r.lv===lv); if(!row||row.expNeed<=0) break;
      if(exp>=row.expNeed){ exp-=row.expNeed; lv+=1; leveled=true; } else break; }
    Store.set(CFG.KEY.level, lv); Store.set(CFG.KEY.exp, exp); return { leveled, newLevel: lv }; },
  getTips(){ return Store.get(CFG.KEY.tips, 3); },
  useTip(){ const t=this.getTips(); if(t<=0) return false; Store.set(CFG.KEY.tips, t-1); return true; }
};
const HERB_DB = {
  '桂枝':{area:'forest',emoji:'🌿'},'茯苓':{area:'forest',emoji:'🍄'},'葛根':{area:'forest',emoji:'🥕'},
  '黄连':{area:'forest',emoji:'🌼'},'人参':{area:'forest',emoji:'🫚'},'细辛':{area:'forest',emoji:'🌱'},
  '猪苓':{area:'forest',emoji:'🍄'},'厚朴':{area:'forest',emoji:'🪵'},'枳实':{area:'forest',emoji:'🍊'},
  '麻黄':{area:'mountain',emoji:'🌾'},'杏仁':{area:'mountain',emoji:'🌰'},'柴胡':{area:'mountain',emoji:'🍃'},
  '黄芩':{area:'mountain',emoji:'🌻'},'知母':{area:'mountain',emoji:'🌿'},'附子':{area:'mountain',emoji:'🍠'},
  '白术':{area:'mountain',emoji:'🌾'},'大黄':{area:'mountain',emoji:'🪵'},'当归':{area:'mountain',emoji:'🌿'},
  '五味子':{area:'mountain',emoji:'🫐'},'芍药':{area:'field',emoji:'🌸'},'甘草':{area:'field',emoji:'🍂'},
  '生姜':{area:'field',emoji:'🫚'},'大枣':{area:'field',emoji:'🍎'},'半夏':{area:'field',emoji:'🌰'},
  '茵陈':{area:'field',emoji:'🌿'},'泽泻':{area:'field',emoji:'🌱'},'栀子':{area:'field',emoji:'🍋'},
  '通草':{area:'field',emoji:'🌿'},'干姜':{area:'field',emoji:'🫚'},'粳米':{area:'field',emoji:'🌾'},
  '石膏':{area:'mine',emoji:'🪨'},'芒硝':{area:'mine',emoji:'💎'},
  '淡豆豉':{area:'workshop',emoji:'🫘'},'饴糖':{area:'workshop',emoji:'🍯'}
};
function getHerbsByArea(area) {
  return Object.entries(HERB_DB).filter(([_,v]) => v.area === area).map(([name,v]) => ({name, ...v}));
}
