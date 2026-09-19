/* ============================================================
   shop-data.js —— 商店共享数据
   被 index.html、process.html 等页面引用。
   以后要改商品、价格、上架顺序，只改这一个文件。
   ============================================================ */
(function () {

    /* 分类定义（决定商店弹窗里分区的顺序、标题、图片路径） */
    var SHOP_CATEGORIES = [
        { key: 'herbs',     title: '🌿 药材', path: 'images/herbs/' },
        { key: 'materials', title: '🍯 辅料', path: 'images/materials/' },
        { key: 'seeds',     title: '🌱 种子', path: 'images/seeds/' }
    ];

    /* 商品列表
       - category：对应仓库的 key（herbs / seeds / materials）
       - name    ：入仓的 key，同时是图片文件名
       - display ：商店里显示的名字
       - price   ：售价（铜币）
       - icon    ：图片加载失败时的 emoji 兜底 */
    var SHOP_ITEMS = [
        /* 药材 */
        { category: 'herbs', name: '饴糖',   display: '饴糖',   price: 3, icon: '🍬' },
        { category: 'herbs', name: '淡豆豉', display: '淡豆豉', price: 3, icon: '🫘' },
        /* 辅料 */
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
        /* 种子 */
        { category: 'seeds', name: '芍药', display: '芍药种子', price: 3, icon: '🌸' },
        { category: 'seeds', name: '甘草', display: '甘草种子', price: 2, icon: '🌿' },
        { category: 'seeds', name: '生姜', display: '生姜种子', price: 1, icon: '🫚' },
        { category: 'seeds', name: '大枣', display: '大枣种子', price: 1, icon: '🍇' },
        { category: 'seeds', name: '粳米', display: '粳米种子', price: 1, icon: '🌾' },
        { category: 'seeds', name: '半夏', display: '半夏种子', price: 3, icon: '🌱' },
        { category: 'seeds', name: '泽泻', display: '泽泻种子', price: 4, icon: '💧' },
        { category: 'seeds', name: '栀子', display: '栀子种子', price: 2, icon: '🌼' }
    ];

    /* 挂到 window，供各页面读取 */
    window.SHOP_CATEGORIES = SHOP_CATEGORIES;
    window.SHOP_ITEMS = SHOP_ITEMS;

})();