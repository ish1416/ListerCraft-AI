/**
 * ListerCraft AI — Main Application Controller
 * Handles UI interactions, reactive state synchronization, and engine integration
 */

document.addEventListener("DOMContentLoaded", () => {
  // App State
  const state = {
    currentPresetId: "ceramic_dripper",
    currentPlatform: "etsy",
    specs: {},
    pricing: {
      sellingPrice: 38.00,
      cogs: 8.00,
      shipping: 5.50
    },
    listingData: {},
    feeAnalysis: {}
  };

  // DOM Elements
  const presetCards = document.querySelectorAll(".preset-card");
  const mainProductImage = document.getElementById("mainProductImage");
  const imageUploadInput = document.getElementById("imageUploadInput");
  const productForm = document.getElementById("productForm");
  const btnResetForm = document.getElementById("btnResetForm");

  // Inputs
  const itemTitleInput = document.getElementById("itemTitle");
  const itemCategoryInput = document.getElementById("itemCategory");
  const itemConditionInput = document.getElementById("itemCondition");
  const itemMaterialsInput = document.getElementById("itemMaterials");
  const itemDimensionsInput = document.getElementById("itemDimensions");
  const itemEraInput = document.getElementById("itemEra");
  const itemAudienceInput = document.getElementById("itemAudience");

  // Platform & Output Elements
  const platformTabs = document.querySelectorAll(".platform-tab");
  const platformMetaCard = document.getElementById("platformMetaCard");
  const listingOutputText = document.getElementById("listingOutputText");
  const wordCounter = document.getElementById("wordCounter");
  const etsyTagsSection = document.getElementById("etsyTagsSection");
  const tagCloud = document.getElementById("tagCloud");
  const btnCopyTags = document.getElementById("btnCopyTags");
  const btnCopyListing = document.getElementById("btnCopyListing");

  // Audio Elements
  const btnSpeak = document.getElementById("btnSpeak");
  const audioWaveformBar = document.getElementById("audioWaveformBar");
  const btnStopAudio = document.getElementById("btnStopAudio");

  // Fee & Calc Elements
  const priceRange = document.getElementById("priceRange");
  const priceNumber = document.getElementById("priceNumber");
  const priceBadge = document.getElementById("priceBadge");

  const cogsRange = document.getElementById("cogsRange");
  const cogsNumber = document.getElementById("cogsNumber");
  const cogsBadge = document.getElementById("cogsBadge");

  const shippingRange = document.getElementById("shippingRange");
  const shippingNumber = document.getElementById("shippingNumber");
  const shippingBadge = document.getElementById("shippingBadge");

  // Fee Cards
  const etsyCutPct = document.getElementById("etsyCutPct");
  const etsyGross = document.getElementById("etsyGross");
  const etsyFees = document.getElementById("etsyFees");
  const etsyCosts = document.getElementById("etsyCosts");
  const etsyNet = document.getElementById("etsyNet");
  const etsyMargin = document.getElementById("etsyMargin");
  const etsyRoi = document.getElementById("etsyRoi");

  const ebayCutPct = document.getElementById("ebayCutPct");
  const ebayGross = document.getElementById("ebayGross");
  const ebayFees = document.getElementById("ebayFees");
  const ebayCosts = document.getElementById("ebayCosts");
  const ebayNet = document.getElementById("ebayNet");
  const ebayMargin = document.getElementById("ebayMargin");
  const ebayRoi = document.getElementById("ebayRoi");

  const shopifyCutPct = document.getElementById("shopifyCutPct");
  const shopifyGross = document.getElementById("shopifyGross");
  const shopifyFees = document.getElementById("shopifyFees");
  const shopifyCosts = document.getElementById("shopifyCosts");
  const shopifyNet = document.getElementById("shopifyNet");
  const shopifyMargin = document.getElementById("shopifyMargin");
  const shopifyRoi = document.getElementById("shopifyRoi");

  const advisorTitle = document.getElementById("advisorTitle");
  const advisorBody = document.getElementById("advisorBody");

  // Export Buttons
  const btnExportCSV = document.getElementById("btnExportCSV");
  const btnExportEbayCSV = document.getElementById("btnExportEbayCSV");
  const btnExportMarkdown = document.getElementById("btnExportMarkdown");
  const btnPrintQR = document.getElementById("btnPrintQR");

  // Modals & Toast
  const btnFirstUser = document.getElementById("btnFirstUser");
  const btnHowItWorks = document.getElementById("btnHowItWorks");
  const caseStudyModal = document.getElementById("caseStudyModal");
  const architectureModal = document.getElementById("architectureModal");
  const btnCloseCaseStudy = document.getElementById("btnCloseCaseStudy");
  const btnCloseArch = document.getElementById("btnCloseArch");
  const toastNotification = document.getElementById("toastNotification");

  // Show Toast Helper
  function showToast(message) {
    const toastMsg = toastNotification.querySelector(".toast-msg");
    if (toastMsg) toastMsg.textContent = message;
    toastNotification.classList.add("show");
    setTimeout(() => {
      toastNotification.classList.remove("show");
    }, 2800);
  }

  // Read Form Specs
  function getFormSpecs() {
    return {
      title: itemTitleInput.value.trim(),
      category: itemCategoryInput.value,
      condition: itemConditionInput.value,
      materials: itemMaterialsInput.value.trim(),
      dimensions: itemDimensionsInput.value.trim(),
      era: itemEraInput.value.trim(),
      audience: itemAudienceInput.value.trim()
    };
  }

  // Load Preset
  function loadPreset(presetId) {
    const preset = PRODUCT_PRESETS[presetId];
    if (!preset) return;

    state.currentPresetId = presetId;
    state.specs = {
      title: preset.name,
      category: preset.category,
      condition: preset.condition,
      materials: preset.materials,
      dimensions: preset.dimensions,
      era: preset.era,
      audience: preset.audience
    };

    // Populate inputs
    itemTitleInput.value = preset.name;
    itemCategoryInput.value = preset.category;
    itemConditionInput.value = preset.condition;
    itemMaterialsInput.value = preset.materials;
    itemDimensionsInput.value = preset.dimensions;
    itemEraInput.value = preset.era;
    itemAudienceInput.value = preset.audience;

    // Image
    mainProductImage.src = preset.image;

    // Pricing
    state.pricing.sellingPrice = preset.pricing.sellingPrice;
    state.pricing.cogs = preset.pricing.cogs;
    state.pricing.shipping = preset.pricing.shipping;

    syncPricingInputs();

    // Listings
    state.listingData = {
      etsy: preset.etsy,
      ebay: preset.ebay,
      shopify: preset.shopify
    };

    // Update active preset card styling
    presetCards.forEach(card => {
      card.classList.toggle("active", card.dataset.id === presetId);
    });

    renderPlatformView();
    calculateAndRenderFees();
  }

  // Sync Pricing Inputs
  function syncPricingInputs() {
    priceRange.value = state.pricing.sellingPrice;
    priceNumber.value = state.pricing.sellingPrice.toFixed(2);
    priceBadge.textContent = `$${state.pricing.sellingPrice.toFixed(2)}`;

    cogsRange.value = state.pricing.cogs;
    cogsNumber.value = state.pricing.cogs.toFixed(2);
    cogsBadge.textContent = `$${state.pricing.cogs.toFixed(2)}`;

    shippingRange.value = state.pricing.shipping;
    shippingNumber.value = state.pricing.shipping.toFixed(2);
    shippingBadge.textContent = `$${state.pricing.shipping.toFixed(2)}`;
  }

  // Render Platform View (Etsy, eBay, Shopify)
  function renderPlatformView() {
    const platform = state.currentPlatform;
    const data = state.listingData[platform];
    if (!data) return;

    // Meta Card Render
    if (platform === "etsy") {
      platformMetaCard.innerHTML = `
        <div class="meta-row">
          <span style="color: #fbbf24; font-weight: 700;">🌿 Etsy Marketplace Optimized Title</span>
          <span class="meta-char-badge safe">${data.title.length} chars (High SEO Impact)</span>
        </div>
        <div class="meta-title-preview">${data.title}</div>
      `;
      etsyTagsSection.style.display = "block";
      renderEtsyTags(data.tags || []);
    } else if (platform === "ebay") {
      const isOver80 = data.title.length > 80;
      platformMetaCard.innerHTML = `
        <div class="meta-row">
          <span style="color: #38bdf8; font-weight: 700;">🏷️ eBay PowerSeller 80-Char SEO Title</span>
          <span class="meta-char-badge ${isOver80 ? 'danger' : 'safe'}">${data.title.length} / 80 characters</span>
        </div>
        <div class="meta-title-preview">${data.title}</div>
      `;
      etsyTagsSection.style.display = "none";
    } else {
      platformMetaCard.innerHTML = `
        <div class="meta-row">
          <span style="color: #34d399; font-weight: 700;">🛍️ Shopify Lifestyle Brand Headline</span>
          <span class="meta-char-badge safe">Direct Brand Copy</span>
        </div>
        <div class="meta-title-preview">${data.title}</div>
      `;
      etsyTagsSection.style.display = "none";
    }

    // Set Textarea Copy
    listingOutputText.value = data.copy;
    updateWordCounter(data.copy);
  }

  // Render Etsy 13 Tags
  function renderEtsyTags(tags) {
    tagCloud.innerHTML = "";
    tags.forEach(tag => {
      const pill = document.createElement("span");
      pill.className = "tag-pill";
      pill.innerHTML = `${tag} <span class="tag-chars">(${tag.length}/20)</span>`;
      pill.title = "Click to copy individual tag";
      pill.addEventListener("click", () => {
        navigator.clipboard.writeText(tag);
        showToast(`Copied tag: "${tag}"`);
      });
      tagCloud.appendChild(pill);
    });
  }

  // Word Counter
  function updateWordCounter(text) {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCounter.textContent = `${words} words | ${chars.toLocaleString()} characters`;
  }

  // Calculate and Render Fees
  function calculateAndRenderFees() {
    const price = state.pricing.sellingPrice;
    const cogs = state.pricing.cogs;
    const shipping = state.pricing.shipping;

    const etsyRes = window.feeCalculator.calculateEtsy(price, cogs, shipping);
    const ebayRes = window.feeCalculator.calculateEbay(price, cogs, shipping);
    const shopifyRes = window.feeCalculator.calculateShopify(price, cogs, shipping);

    state.feeAnalysis = {
      etsy: etsyRes,
      ebay: ebayRes,
      shopify: shopifyRes
    };

    // Render Etsy Card
    etsyCutPct.textContent = `${etsyRes.feePctOfGross.toFixed(1)}% Total Fee`;
    etsyGross.textContent = `$${etsyRes.gross.toFixed(2)}`;
    etsyFees.textContent = `-$${etsyRes.totalFees.toFixed(2)}`;
    etsyCosts.textContent = `-$${etsyRes.outlay.toFixed(2)}`;
    etsyNet.textContent = `$${etsyRes.netProfit.toFixed(2)}`;
    etsyMargin.textContent = `${etsyRes.marginPct.toFixed(1)}% Margin`;
    etsyRoi.textContent = `${etsyRes.roiPct.toFixed(1)}% ROI`;

    // Render eBay Card
    ebayCutPct.textContent = `${ebayRes.feePctOfGross.toFixed(1)}% Total Fee`;
    ebayGross.textContent = `$${ebayRes.gross.toFixed(2)}`;
    ebayFees.textContent = `-$${ebayRes.totalFees.toFixed(2)}`;
    ebayCosts.textContent = `-$${ebayRes.outlay.toFixed(2)}`;
    ebayNet.textContent = `$${ebayRes.netProfit.toFixed(2)}`;
    ebayMargin.textContent = `${ebayRes.marginPct.toFixed(1)}% Margin`;
    ebayRoi.textContent = `${ebayRes.roiPct.toFixed(1)}% ROI`;

    // Render Shopify Card
    shopifyCutPct.textContent = `${shopifyRes.feePctOfGross.toFixed(1)}% Card Fee`;
    shopifyGross.textContent = `$${shopifyRes.gross.toFixed(2)}`;
    shopifyFees.textContent = `-$${shopifyRes.totalFees.toFixed(2)}`;
    shopifyCosts.textContent = `-$${shopifyRes.outlay.toFixed(2)}`;
    shopifyNet.textContent = `$${shopifyRes.netProfit.toFixed(2)}`;
    shopifyMargin.textContent = `${shopifyRes.marginPct.toFixed(1)}% Margin`;
    shopifyRoi.textContent = `${shopifyRes.roiPct.toFixed(1)}% ROI`;

    // Advisor Callout
    const advice = window.feeCalculator.getPricingAdvice(price, cogs, shipping, etsyRes);
    advisorTitle.textContent = advice.title;
    advisorBody.textContent = advice.body;
  }

  // Preset Card Clicks
  presetCards.forEach(card => {
    card.addEventListener("click", () => {
      loadPreset(card.dataset.id);
    });
  });

  // Platform Tab Clicks
  platformTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      platformTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.currentPlatform = tab.dataset.platform;
      renderPlatformView();
    });
  });

  // Custom Image Upload
  imageUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        mainProductImage.src = event.target.result;
        presetCards.forEach(c => c.classList.remove("active"));
        showToast("Custom photo loaded into Product Studio");
      };
      reader.readAsDataURL(file);
    }
  });

  // Form Submit: Generate with Gemma 2
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    state.specs = getFormSpecs();

    const btnGenerate = document.getElementById("btnGenerate");
    btnGenerate.style.opacity = "0.7";
    btnGenerate.querySelector(".btn-text").textContent = "Gemma 2 Generating...";

    setTimeout(() => {
      const generated = window.gemmaEngine.generateAllListings(state.specs);
      state.listingData = generated;

      renderPlatformView();
      calculateAndRenderFees();

      btnGenerate.style.opacity = "1";
      btnGenerate.querySelector(".btn-text").textContent = "Generate Multi-Platform Listings";
      showToast("Listings generated across Etsy, eBay & Shopify!");
    }, 450);
  });

  // Textarea input
  listingOutputText.addEventListener("input", (e) => {
    const val = e.target.value;
    updateWordCounter(val);
    if (state.listingData[state.currentPlatform]) {
      state.listingData[state.currentPlatform].copy = val;
    }
  });

  // Sliders & Pricing Inputs Synchronization
  priceRange.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    state.pricing.sellingPrice = val;
    priceNumber.value = val.toFixed(2);
    priceBadge.textContent = `$${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  priceNumber.addEventListener("input", (e) => {
    const val = Math.max(0, parseFloat(e.target.value) || 0);
    state.pricing.sellingPrice = val;
    priceRange.value = val;
    priceBadge.textContent = `$${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  cogsRange.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    state.pricing.cogs = val;
    cogsNumber.value = val.toFixed(2);
    cogsBadge.textContent = `$${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  cogsNumber.addEventListener("input", (e) => {
    const val = Math.max(0, parseFloat(e.target.value) || 0);
    state.pricing.cogs = val;
    cogsRange.value = val;
    cogsBadge.textContent = `$${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  shippingRange.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    state.pricing.shipping = val;
    shippingNumber.value = val.toFixed(2);
    shippingBadge.textContent = `$${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  shippingNumber.addEventListener("input", (e) => {
    const val = Math.max(0, parseFloat(e.target.value) || 0);
    state.pricing.shipping = val;
    shippingRange.value = val;
    shippingBadge.textContent = `$${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  // Copy All Listing Copy
  btnCopyListing.addEventListener("click", () => {
    const text = listingOutputText.value;
    navigator.clipboard.writeText(text);
    showToast("Listing description copied to clipboard!");
  });

  // Copy Comma-Separated Tags
  btnCopyTags.addEventListener("click", () => {
    const tags = state.listingData.etsy.tags || [];
    const text = tags.join(", ");
    navigator.clipboard.writeText(text);
    showToast("All 13 Etsy tags copied as comma-separated string!");
  });

  // Audio Speech Narration
  btnSpeak.addEventListener("click", () => {
    const text = listingOutputText.value;
    window.gemmaEngine.speakText(
      text,
      () => {
        audioWaveformBar.style.display = "flex";
      },
      () => {
        audioWaveformBar.style.display = "none";
      }
    );
  });

  btnStopAudio.addEventListener("click", () => {
    window.gemmaEngine.stopSpeaking();
    audioWaveformBar.style.display = "none";
  });

  // Export Buttons
  btnExportCSV.addEventListener("click", () => {
    window.exportEngine.exportEtsyCSV(state.specs, state.listingData, state.pricing);
    showToast("Etsy CSV exported successfully!");
  });

  btnExportEbayCSV.addEventListener("click", () => {
    window.exportEngine.exportEbayCSV(state.specs, state.listingData, state.pricing);
    showToast("eBay CSV exported successfully!");
  });

  btnExportMarkdown.addEventListener("click", () => {
    window.exportEngine.exportMarkdown(state.specs, state.listingData, state.pricing, state.feeAnalysis);
    showToast("Listing Markdown dossier exported!");
  });

  btnPrintQR.addEventListener("click", () => {
    window.exportEngine.printInventoryQR(state.specs, state.pricing);
  });

  // Reset Button
  btnResetForm.addEventListener("click", () => {
    loadPreset("ceramic_dripper");
    showToast("Product Studio reset to default showcase");
  });

  // Modal Triggers
  btnFirstUser.addEventListener("click", () => {
    caseStudyModal.classList.add("open");
  });

  btnCloseCaseStudy.addEventListener("click", () => {
    caseStudyModal.classList.remove("open");
  });

  caseStudyModal.addEventListener("click", (e) => {
    if (e.target === caseStudyModal) caseStudyModal.classList.remove("open");
  });

  btnHowItWorks.addEventListener("click", () => {
    architectureModal.classList.add("open");
  });

  btnCloseArch.addEventListener("click", () => {
    architectureModal.classList.remove("open");
  });

  architectureModal.addEventListener("click", (e) => {
    if (e.target === architectureModal) architectureModal.classList.remove("open");
  });

  // Escape key closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      caseStudyModal.classList.remove("open");
      architectureModal.classList.remove("open");
    }
  });

  // Initial Boot
  loadPreset("ceramic_dripper");
});
