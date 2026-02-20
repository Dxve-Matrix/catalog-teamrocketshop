/*************************************************
 * WAIT FOR CONFIG
 *************************************************/
let supabaseClient = null;

function waitForConfig(callback) {
  const check = setInterval(() => {
    if (window.CONFIG && window.CONFIG.supabase?.url) {
      clearInterval(check);
      callback();
    }
  }, 50);
}

waitForConfig(() => {

  supabaseClient = window.supabase.createClient(
    CONFIG.supabase.url,
    CONFIG.supabase.anonKey
  );

  loadProducts();
});

/*************************************************
 * LOAD PRODUCTS (CON FILTRI)
 *************************************************/
async function loadProducts() {

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "Caricamento...";

  const search = document.getElementById("catalogSearch")?.value?.trim() || "";
  const tcg = document.getElementById("filterTCG")?.value || "";
  const language = document.getElementById("filterLanguage")?.value || "";
  const type = document.getElementById("filterType")?.value || "";

  let url = "https://vsomlptqztbnjntedhva.supabase.co/rest/v1/products?select=*";

  url += "&visible=eq.true";
  url += "&is_mystery=eq.false";
  
  if (tcg) url += `&tcg=eq.${tcg}`;
  if (language) url += `&language=eq.${language}`;
  if (type) url += `&product_type=eq.${type}`;
  if (search) url += `&name=ilike.*${search}*`;

  url += "&order=created_at.desc";

  const res = await fetch(url, {
    headers: {
      apikey: CONFIG.supabase.anonKey,
      Authorization: "Bearer " + CONFIG.supabase.anonKey
    }
  });

  if (res.status !== 200) {
    console.error("Errore REST:", res.status);
    grid.innerHTML = "<p>Errore caricamento prodotti</p>";
    return;
  }

  const data = await res.json();

  if (!data || data.length === 0) {
    grid.innerHTML = "<p style='opacity:.6'>Nessun prodotto trovato</p>";
    return;
  }

  renderProducts(data);
}


/*************************************************
 * RENDER CARD
 *************************************************/
function renderProducts(products) {

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach(p => {

    const card = document.createElement("div");
    card.className = "tcg-card";

    const imgSrc = p.image || "images/placeholder.webp";

    card.innerHTML = `
      <div style="text-align:center">
        <div style="
          height:200px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        ">
          <img
            src="${imgSrc}"
            style="max-width:100%; max-height:100%; object-fit:contain;"
          >
        </div>

        <h3 style="margin:12px 0 6px">${p.name}</h3>
        <div style="font-weight:700">€${p.price}</div>
      </div>
    `;

    grid.appendChild(card);
  });

}
