/*************************************************
 * GLOBAL STATE
 *************************************************/
window.CONFIG = {};
window.supabaseClient = null;

/*************************************************
 * LOAD CONFIG + INIT SUPABASE
 *************************************************/
fetch("./config.json")
  .then(r => r.json())
  .then(config => {

    window.CONFIG = config;

    applyBranding();
    applyTheme();
    applyLinks();

    // 🔑 Creiamo UNA sola istanza globale Supabase
    window.supabaseClient = window.supabase.createClient(
      CONFIG.supabase.url,
      CONFIG.supabase.anonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      }
    );

  })
  .catch(err => {
    console.error("Errore caricamento config:", err);
  });

/*************************************************
 * APPLY BRANDING
 *************************************************/
function applyBranding() {

  const brandName = document.getElementById("brandName");
  if (brandName && CONFIG.branding?.sellerName) {
    brandName.textContent = CONFIG.branding.sellerName;
  }

  const brandLogo = document.getElementById("brandLogo");
  if (brandLogo && CONFIG.branding?.logo) {
    brandLogo.src = CONFIG.branding.logo;
  }

  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle && CONFIG.branding?.sellerName) {
    pageTitle.textContent =
      CONFIG.branding.sellerName + " – Catalogo";
  }

  const developerName = document.getElementById("developerName");
  const developerLink = document.getElementById("developerLink");

  if (developerName && CONFIG.developer?.name) {
    developerName.textContent = CONFIG.developer.name;
  }

  if (developerLink && CONFIG.developer?.link) {
    developerLink.href = CONFIG.developer.link;
  }
}

/*************************************************
 * APPLY THEME
 *************************************************/
function applyTheme() {

  if (CONFIG.theme?.primaryColor) {
    document.documentElement.style.setProperty(
      "--primary",
      CONFIG.theme.primaryColor
    );
  }

  if (CONFIG.theme?.secondaryColor) {
    document.documentElement.style.setProperty(
      "--secondary",
      CONFIG.theme.secondaryColor
    );
  }
}

/*************************************************
 * APPLY LINKS
 *************************************************/
function applyLinks() {

  setLink("tiktokLink", CONFIG.social?.tiktok);
  setLink("whatsappLink", CONFIG.social?.whatsapp);
  setLink("paypalLink", CONFIG.social?.paypal);
  setLink("revolutLink", CONFIG.social?.revolut);

}

/*************************************************
 * HELPER
 *************************************************/
function setLink(id, url) {
  const el = document.getElementById(id);
  if (!el) return;

  if (url && url.trim() !== "") {
    el.href = url;
  } else {
    el.style.display = "none";
  }
}