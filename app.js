const $ = (s) => document.querySelector(s);
const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
let activeCategory = "Semua";
let cart = JSON.parse(localStorage.getItem("didin_cart") || "[]");
const config = window.STORE_CONFIG || {};
const products = window.PRODUCTS || [];
const wa = String(config.whatsappNumber || "").replace(/\D/g,"");
const waReady = wa.length >= 10 && wa !== "6280000000000";

function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
function waLink(message){return `https://wa.me/${wa}?text=${encodeURIComponent(message)}`}
function safeText(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderProducts(){
  const query=$("#searchInput").value.trim().toLowerCase();
  let list=products.filter(p=>(activeCategory==="Semua"||p.game===activeCategory)&&`${p.name} ${p.game} ${p.description}`.toLowerCase().includes(query));
  const sort=$("#sortSelect").value;
  if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);
  $("#productGrid").innerHTML=list.map(p=>`<article class="product-card">
    <div class="product-art ${safeText(p.tone)}">${p.image?`<img class="product-photo" src="${safeText(p.image)}" alt="${safeText(p.name)}">`:""}<span class="game-label">${safeText(p.game)}</span><span class="game-emoji">${safeText(p.emoji)}</span>${p.badge?`<span class="product-badge">${safeText(p.badge)}</span>`:""}<span class="art-id">DS / ${safeText(p.id.toUpperCase())}</span></div>
    <div class="product-info"><div class="product-meta"><span>${safeText(p.level)}</span><span class="${p.stock>0?"in-stock":"out-stock"}">${p.stock>0?`Stok ${p.stock}`:"Habis"}</span></div>
    <h3>${safeText(p.name)}</h3><p>${safeText(p.description)}</p><div class="product-bottom"><div><b>${rupiah(p.price)}</b>${p.oldPrice?`<del>${rupiah(p.oldPrice)}</del>`:""}</div><button class="add-btn" data-add="${safeText(p.id)}" ${p.stock<=0?"disabled":""} aria-label="Tambah ${safeText(p.name)}">＋</button></div></div></article>`).join("");
  $("#emptyState").classList.toggle("hidden",list.length!==0);
}
function saveCart(){localStorage.setItem("didin_cart",JSON.stringify(cart));renderCart();$("#cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0)}
function renderCart(){
  const items=cart.map(x=>({...x,product:products.find(p=>p.id===x.id)})).filter(x=>x.product);
  $("#cartItems").innerHTML=items.length?items.map(x=>`<div class="cart-item"><div class="mini-art ${safeText(x.product.tone)}">${safeText(x.product.emoji)}</div><div class="cart-item-info"><b>${safeText(x.product.name)}</b><small>${rupiah(x.product.price)}</small><div class="qty"><button data-qty="${x.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${x.id}" data-delta="1">＋</button><button class="remove" data-remove="${x.id}">Hapus</button></div></div><b>${rupiah(x.product.price*x.qty)}</b></div>`).join(""):`<div class="cart-empty"><span>🛒</span><h3>Keranjang masih kosong</h3><p>Yuk, pilih akun game favoritmu.</p><button class="btn ghost" id="browseProducts">Jelajahi produk</button></div>`;
  const total=items.reduce((n,x)=>n+x.product.price*x.qty,0);$("#cartTotal").textContent=rupiah(total);
}
function openCart(){$("#cartOverlay").classList.remove("hidden");document.body.classList.add("locked")}
function closeCart(){$("#cartOverlay").classList.add("hidden");document.body.classList.remove("locked")}
$("#productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const p=products.find(x=>x.id===b.dataset.add);if(!p||p.stock<1)return;const item=cart.find(x=>x.id===p.id);if(item){if(item.qty>=p.stock){toast("Jumlah melebihi stok yang tersedia.");return}item.qty++}else cart.push({id:p.id,qty:1});saveCart();toast("Produk ditambahkan ke keranjang.")});
$("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(r)cart=cart.filter(x=>x.id!==r.dataset.remove);if(q){const item=cart.find(x=>x.id===q.dataset.qty),p=products.find(x=>x.id===q.dataset.qty);if(item){item.qty+=Number(q.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==q.dataset.qty);if(p&&item.qty>p.stock){item.qty=p.stock;toast("Jumlah dibatasi sesuai stok.")}}}saveCart()});
$("#cartItems").addEventListener("click",e=>{if(e.target.id==="browseProducts"){closeCart();$("#produk").scrollIntoView({behavior:"smooth"})}});
$("#openCart").onclick=openCart;$("#closeCart").onclick=closeCart;$("#cartOverlay").addEventListener("click",e=>{if(e.target.id==="cartOverlay")closeCart()});
$("#checkoutBtn").onclick=()=>{if(!cart.length){toast("Keranjang masih kosong.");return}if(!waReady){toast("Admin belum mengatur nomor WhatsApp. Hubungi pemilik toko.");return}
const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return p?`- ${p.name} x${x.qty} — ${rupiah(p.price*x.qty)}`:""}).filter(Boolean);
const total=cart.reduce((n,x)=>{const p=products.find(y=>y.id===x.id);return n+(p?p.price*x.qty:0)},0);
const msg=`Halo ${config.storeName||"Didin Store"}, saya ingin memesan akun berikut:\n${lines.join("\n")}\n\nTotal sementara: ${rupiah(total)}\nMohon konfirmasi stok, detail akun, dan metode pembayaran.`;
window.open(waLink(msg),"_blank","noopener");};
$("#searchInput").addEventListener("input",renderProducts);$("#sortSelect").addEventListener("change",renderProducts);
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
const contactMsg="Halo Didin Store, saya ingin bertanya tentang produk akun game.";
$("#contactAdmin").href=waReady?waLink(contactMsg):"#";$("#footerWhatsApp").href=waReady?waLink(contactMsg):"#";
if(!waReady){$("#contactAdmin").addEventListener("click",e=>{e.preventDefault();toast("Atur nomor WhatsApp admin di file config.js terlebih dahulu.")});$("#footerWhatsApp").addEventListener("click",e=>{e.preventDefault();toast("Atur nomor WhatsApp admin di file config.js terlebih dahulu.")})}
$("#themeToggle").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("didin_theme",document.body.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("didin_theme")==="light")document.body.classList.add("light");
$("#menuToggle").onclick=()=>document.querySelector(".desktop-nav").classList.toggle("nav-open");
document.querySelectorAll(".desktop-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".desktop-nav").classList.remove("nav-open")));
$("#year").textContent=new Date().getFullYear();renderProducts();saveCart();
