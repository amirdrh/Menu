/* script.js - logic for building the menu, filtering, searching and simple order */
const menuData = {
  "☕ بر پایه قهوه": [
    {name:"اسپرسو (۲۰–۸۵ روبوستا)"},
    {name:"اسپرسو ۱۰۰ روبوستا"},
    {name:"اسپرسو (۵۰–۵۰)"},
    {name:"اسپرسو ۱۰۰ عربیکا"},
    {name:"آمریکانو"},
    {name:"قهوه عربی (دله)"}
  ],
  "🥛 بر پایه شیر": [
    {name:"لته (شیر + اسپرسو)"},
    {name:"لته فندق"},
    {name:"لته آیریش"},
    {name:"لته وانیل"},
    {name:"لته نارگیل"},
    {name:"لته زعفران"},
    {name:"کارامل ماکیاتو"},
    {name:"موکا"},
    {name:"کاپوچینو"},
    {name:"کاپوچینو کاراملی"},
    {name:"کاپوچینو فندق"},
    {name:"کاپوچینو گلد"},
    {name:"کاپو سوخته"},
    {name:"هات چاکلت"},
    {name:"ماسالا"},
    {name:"شیر کاکائو"},
    {name:"شیر عسل دارچین"},
    {name:"شیر گرم"}
  ],
  "🍵 چای": [
    {name:"چای"},
    {name:"چای نبات"},
    {name:"چای دارچین"},
    {name:"چای نعنا"},
    {name:"چای زعفران"},
    {name:"چای کرک"}
  ],
  "☕ ترک": [
    {name:"قهوه ترک (مدیوم و دارک)"},
    {name:"قهوه یونانی"}
  ],
  "🧊 آیس": [
    {name:"آیس اسپرسو (دبل اسپرسو + یخ)"},
    {name:"آیس آمریکانو"},
    {name:"آیس لته"},
    {name:"آیس لته فندقی"},
    {name:"آیس لته آیریش"},
    {name:"آیس لته وانیل"},
    {name:"آیس لته نارگیل"},
    {name:"آیس لته کوکی"},
    {name:"آیس کارامل ماکیاتو"},
    {name:"آیس موکا"},
    {name:"آیس کاپوچینو"}
  ],
  "🍨 بر پایه بستنی": [
    {name:"شیک اسپرسو"},
    {name:"شیک وانیل"},
    {name:"شیک کارامل"},
    {name:"شیک شکلات"},
    {name:"شیک موکا"},
    {name:"شیک کارامل وانیلی"},
    {name:"آفوگاتو وانیلی"},
    {name:"آفوگاتو شکلاتی"}
  ],
  "🍰 کیک‌های روز": [
    {name:"چیزکیک"},
    {name:"تیرامیسو"},
    {name:"کوکی"}
  ]
};

const menuEl = document.getElementById('menu');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('search');
const orderListEl = document.getElementById('orderList');
const orderCountEl = document.getElementById('orderCount');
const checkoutBtn = document.getElementById('checkoutBtn');

let order = [];

// Build category filter options
function populateCategoryFilter(){
  Object.keys(menuData).forEach(cat=>{
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// Render menu
function renderMenu(filterCat = 'all', query = ''){
  menuEl.innerHTML = '';
  const categoryTpl = document.getElementById('categoryTpl');
  const itemTpl = document.getElementById('itemTpl');

  Object.entries(menuData).forEach(([cat, items])=>{
    if(filterCat !== 'all' && filterCat !== cat) return;
    const catNode = categoryTpl.content.cloneNode(true);
    catNode.querySelector('.category-title').textContent = cat;
    const list = catNode.querySelector('.items');

    items.forEach(it=>{
      const name = it.name;
      if(query && !name.includes(query)) return;
      const itemNode = itemTpl.content.cloneNode(true);
      itemNode.querySelector('.item-name').textContent = name;
      itemNode.querySelector('.item-desc').textContent = ''; // reserved for descriptions/prices
      const addBtn = itemNode.querySelector('.add-btn');
      addBtn.addEventListener('click', ()=>{
        addToOrder(name);
      });
      list.appendChild(itemNode);
    });

    // only append if has items (in case search filtered out all)
    if(list.children.length) menuEl.appendChild(catNode);
  });
}

// Order functions
function addToOrder(name){
  order.push(name);
  updateOrderUI();
}

function updateOrderUI(){
  orderListEl.innerHTML = '';
  order.forEach((name, idx)=>{
    const li = document.createElement('li');
    li.textContent = name;

    const remove = document.createElement('button');
    remove.textContent = '×';
    remove.title = 'حذف';
    remove.style.border='none';
    remove.style.background='transparent';
    remove.style.cursor='pointer';
    remove.addEventListener('click', ()=>{ order.splice(idx,1); updateOrderUI(); });

    li.appendChild(remove);
    orderListEl.appendChild(li);
  });
  orderCountEl.textContent = order.length;
}

// Events
categoryFilter.addEventListener('change', ()=> renderMenu(categoryFilter.value, searchInput.value.trim()));
searchInput.addEventListener('input', ()=> renderMenu(categoryFilter.value, searchInput.value.trim()));
checkoutBtn.addEventListener('click', ()=>{
  if(order.length===0){
    alert('سبد شما خالی است.');
    return;
  }
  // For demo: prepare a message to send via WhatsApp (user can edit the phone in the HTML)
  const msg = encodeURIComponent('سلام! سفارش من:\n' + order.map((s,i)=>`${i+1}. ${s}`).join('\n'));
  // phone number in footer is placeholder — user should replace with real number
  window.open('https://wa.me/000000000000?text=' + msg, '_blank');
});

// Init
populateCategoryFilter();
renderMenu();
