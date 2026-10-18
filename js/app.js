/**
 * ListerCraft AI — Main Application Controller
 * Handles UI interactions, reactive state synchronization, and engine integration
 */

document.addEventListener("DOMContentLoaded", () => {
  // App State
  const state = {
    currentPresetId: "ceramic_dripper",
    currentPlatform: "etsy",
    currentTone: "artisan",
    currentCurrency: "USD",
    socialTheme: "dark",
    loupeActive: false,
    flaws: [
      { id: 1, x: 64, y: 82, label: "Subtle micro crazing at unglazed base foot" }
    ],
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
  const mediaPreviewBox = document.getElementById("mediaPreviewBox");
  const loupeLens = document.getElementById("loupeLens");
  const btnUploadPhoto = document.getElementById("btnUploadPhoto");
  const btnToggleLoupe = document.getElementById("btnToggleLoupe");
  const loupeBtnText = document.getElementById("loupeBtnText");
  const flawPinsContainer = document.getElementById("flawPinsContainer");
  const flawTagsList = document.getElementById("flawTagsList");
  const btnAddFlawPin = document.getElementById("btnAddFlawPin");

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

  // Platform & Tone Elements
  const platformTabs = document.querySelectorAll(".platform-tab");
  const toneChips = document.querySelectorAll(".tone-chip");
  const currPills = document.querySelectorAll(".curr-pill");
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
  const bundleTableBody = document.getElementById("bundleTableBody");

  // Export Buttons
  const btnExportCSV = document.getElementById("btnExportCSV");
  const btnExportEbayCSV = document.getElementById("btnExportEbayCSV");
  const btnExportMarkdown = document.getElementById("btnExportMarkdown");
  const btnPrintQR = document.getElementById("btnPrintQR");

  // Modals & Navigation
  const btnFirstUser = document.getElementById("btnFirstUser");
  const btnHowItWorks = document.getElementById("btnHowItWorks");
  const caseStudyModal = document.getElementById("caseStudyModal");
  const architectureModal = document.getElementById("architectureModal");
  const btnCloseCaseStudy = document.getElementById("btnCloseCaseStudy");
  const btnCloseArch = document.getElementById("btnCloseArch");

  // Batch Studio Elements
  const btnOpenBatch = document.getElementById("btnOpenBatch");
  const batchModal = document.getElementById("batchModal");
  const btnCloseBatch = document.getElementById("btnCloseBatch");
  const batchTotalItems = document.getElementById("batchTotalItems");
  const batchGross = document.getElementById("batchGross");
  const batchNet = document.getElementById("batchNet");
  const batchAvgMargin = document.getElementById("batchAvgMargin");
  const batchTableBody = document.getElementById("batchTableBody");
  const btnExportBatchMasterCSV = document.getElementById("btnExportBatchMasterCSV");

  // Social Story Studio Elements
  const btnOpenSocialCard = document.getElementById("btnOpenSocialCard");
  const socialCardModal = document.getElementById("socialCardModal");
  const btnCloseSocialCard = document.getElementById("btnCloseSocialCard");
  const socialCardPreviewImg = document.getElementById("socialCardPreviewImg");
  const themeChoiceBtns = document.querySelectorAll(".theme-choice-btn");
  const btnDownloadSocialCard = document.getElementById("btnDownloadSocialCard");

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

    // Preset Flaws
    const defaultFlaws = {
      ceramic_dripper: [
        { id: 1, x: 62, y: 80, label: "Natural kiln iron speckling at rim" }
      ],
      vintage_decanter: [
        { id: 1, x: 48, y: 34, label: "Flea-bite bubble inside stopper facet" }
      ],
      leather_jacket: [
        { id: 1, x: 54, y: 62, label: "Natural aviator leather patina at left arm" }
      ],
      merino_blanket: [
        { id: 1, x: 68, y: 48, label: "Hand-spun roving join marker (artisan signature)" }
      ]
    };
    state.flaws = defaultFlaws[presetId] || [];

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

    // Update Inventory Telemetry Card
    const telemetryData = {
      ceramic_dripper: { sku: "SKU-DRIP-082", status: "● In Stock (1 Unit)", channel: "Artisan Studio Batch", bin: "Bin B-2 (Stoneware)" },
      vintage_decanter: { sku: "SKU-DEC-1974", status: "● In Stock (1 Unit)", channel: "Northern CA Estate Sale", bin: "Cabinet MCM-1" },
      leather_jacket: { sku: "SKU-JKT-8240", status: "● In Stock (1 Unit)", channel: "Vintage Curated Archive", bin: "Wardrobe Rack 3" },
      merino_blanket: { sku: "SKU-MER-5065", status: "● Ready to Ship (2 Available)", channel: "Hand-Knit Studio Loom", bin: "Textile Shelf A" }
    };
    const telem = telemetryData[presetId] || { sku: "SKU-CUSTOM", status: "● In Stock (1 Unit)", channel: "Custom Inventory", bin: "Primary Storage" };
    const elSku = document.getElementById("telemetrySku");
    const elStatus = document.getElementById("telemStatus");
    const elChannel = document.getElementById("telemChannel");
    const elBin = document.getElementById("telemBin");
    if (elSku) elSku.textContent = telem.sku;
    if (elStatus) elStatus.textContent = telem.status;
    if (elChannel) elChannel.textContent = telem.channel;
    if (elBin) elBin.textContent = telem.bin;

    renderFlaws();
    renderPlatformView();
    calculateAndRenderFees();
  }

  // Render Flaw Pins & Chips
  function renderFlaws() {
    flawPinsContainer.innerHTML = "";
    flawTagsList.innerHTML = "";

    state.flaws.forEach((flaw, idx) => {
      // Pin on Image
      const pin = document.createElement("div");
      pin.className = "flaw-pin";
      pin.style.left = `${flaw.x}%`;
      pin.style.top = `${flaw.y}%`;
      pin.innerHTML = `<span>${idx + 1}</span><div class="flaw-pin-tooltip">${flaw.label}</div>`;
      flawPinsContainer.appendChild(pin);

      // Flaw Chip
      const chip = document.createElement("div");
      chip.className = "flaw-tag-chip";
      chip.innerHTML = `<span>#${idx + 1}: ${flaw.label}</span><button class="flaw-remove-btn" data-id="${flaw.id}">&times;</button>`;
      flawTagsList.appendChild(chip);
    });

    // Add remove listeners
    flawTagsList.querySelectorAll(".flaw-remove-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id, 10);
        state.flaws = state.flaws.filter(f => f.id !== id);
        renderFlaws();
        showToast("Flaw pin removed from Return-Shield");
      });
    });
  }

  // Sync Pricing Inputs
  function syncPricingInputs() {
    const sym = window.feeCalculator.getSymbol();
    priceRange.value = state.pricing.sellingPrice;
    priceNumber.value = state.pricing.sellingPrice.toFixed(2);
    priceBadge.textContent = `${sym}${state.pricing.sellingPrice.toFixed(2)}`;

    cogsRange.value = state.pricing.cogs;
    cogsNumber.value = state.pricing.cogs.toFixed(2);
    cogsBadge.textContent = `${sym}${state.pricing.cogs.toFixed(2)}`;

    shippingRange.value = state.pricing.shipping;
    shippingNumber.value = state.pricing.shipping.toFixed(2);
    shippingBadge.textContent = `${sym}${state.pricing.shipping.toFixed(2)}`;

    // Update currency symbols across input prefixes
    document.querySelectorAll(".direct-number-input .currency-symbol").forEach(el => {
      el.textContent = sym;
    });
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

    // Update SEO Scorecard Badge
    const scoreTagText = document.getElementById("scoreTagText");
    if (scoreTagText) {
      if (platform === "etsy") scoreTagText.textContent = "13 / 13 Tags Active (≤20 chars)";
      else if (platform === "ebay") scoreTagText.textContent = "80-Char SEO Title & Specifics Active";
      else scoreTagText.textContent = "5 Viral Hashtags & Lifestyle Hook";
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

  // Calculate and Render Fees & Volume Bundles
  function calculateAndRenderFees() {
    const price = state.pricing.sellingPrice;
    const cogs = state.pricing.cogs;
    const shipping = state.pricing.shipping;
    const sym = window.feeCalculator.getSymbol();

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
    etsyGross.textContent = `${sym}${etsyRes.gross.toFixed(2)}`;
    etsyFees.textContent = `-${sym}${etsyRes.totalFees.toFixed(2)}`;
    etsyCosts.textContent = `-${sym}${etsyRes.outlay.toFixed(2)}`;
    etsyNet.textContent = `${sym}${etsyRes.netProfit.toFixed(2)}`;
    etsyMargin.textContent = `${etsyRes.marginPct.toFixed(1)}% Margin`;
    etsyRoi.textContent = `${etsyRes.roiPct.toFixed(1)}% ROI`;

    // Render eBay Card
    ebayCutPct.textContent = `${ebayRes.feePctOfGross.toFixed(1)}% Total Fee`;
    ebayGross.textContent = `${sym}${ebayRes.gross.toFixed(2)}`;
    ebayFees.textContent = `-${sym}${ebayRes.totalFees.toFixed(2)}`;
    ebayCosts.textContent = `-${sym}${ebayRes.outlay.toFixed(2)}`;
    ebayNet.textContent = `${sym}${ebayRes.netProfit.toFixed(2)}`;
    ebayMargin.textContent = `${ebayRes.marginPct.toFixed(1)}% Margin`;
    ebayRoi.textContent = `${ebayRes.roiPct.toFixed(1)}% ROI`;

    // Render Shopify Card
    shopifyCutPct.textContent = `${shopifyRes.feePctOfGross.toFixed(1)}% Card Fee`;
    shopifyGross.textContent = `${sym}${shopifyRes.gross.toFixed(2)}`;
    shopifyFees.textContent = `-${sym}${shopifyRes.totalFees.toFixed(2)}`;
    shopifyCosts.textContent = `-${sym}${shopifyRes.outlay.toFixed(2)}`;
    shopifyNet.textContent = `${sym}${shopifyRes.netProfit.toFixed(2)}`;
    shopifyMargin.textContent = `${shopifyRes.marginPct.toFixed(1)}% Margin`;
    shopifyRoi.textContent = `${shopifyRes.roiPct.toFixed(1)}% ROI`;

    // Volume Bundles
    const bundles = window.feeCalculator.getBundleAnalysis(price, cogs, shipping);
    if (bundleTableBody) {
      bundleTableBody.innerHTML = `
        <tr>
          <td><strong>1-Unit</strong></td>
          <td>${sym}${bundles.tier1.price.toFixed(2)}</td>
          <td><strong style="color: #34d399;">${sym}${bundles.tier1.netProfit.toFixed(2)}</strong></td>
          <td>${bundles.tier1.marginPct.toFixed(1)}%</td>
        </tr>
        <tr>
          <td><strong>2-Pack Bundle</strong> <span class="bundle-savings-tag">${bundles.tier2.savings}</span></td>
          <td>${sym}${bundles.tier2.price.toFixed(2)}</td>
          <td><strong style="color: #34d399;">${sym}${bundles.tier2.netProfit.toFixed(2)}</strong></td>
          <td>${bundles.tier2.marginPct.toFixed(1)}%</td>
        </tr>
        <tr>
          <td><strong>4-Pack Collector</strong> <span class="bundle-savings-tag">${bundles.tier4.savings}</span></td>
          <td>${sym}${bundles.tier4.price.toFixed(2)}</td>
          <td><strong style="color: #34d399;">${sym}${bundles.tier4.netProfit.toFixed(2)}</strong></td>
          <td>${bundles.tier4.marginPct.toFixed(1)}%</td>
        </tr>
      `;
    }

    // Advisor Callout
    const advice = window.feeCalculator.getPricingAdvice(price, cogs, shipping, etsyRes);
    advisorTitle.textContent = advice.title;
    advisorBody.textContent = advice.body;
  }

  // Upload Custom Photo Click Trigger
  if (btnUploadPhoto && imageUploadInput) {
    btnUploadPhoto.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      imageUploadInput.click();
    });
  }

  // Interactive 2.5x Flaw Loupe
  btnToggleLoupe.addEventListener("click", () => {
    state.loupeActive = !state.loupeActive;
    btnToggleLoupe.classList.toggle("active", state.loupeActive);
    if (loupeBtnText) {
      loupeBtnText.textContent = state.loupeActive ? "Loupe Active (ON)" : "2.5x Flaw Loupe";
    }
    if (state.loupeActive) {
      loupeLens.style.backgroundImage = `url('${mainProductImage.src}')`;
      showToast("2.5x Loupe active — Move cursor over product photo");
    } else {
      loupeLens.style.display = "none";
    }
  });

  mediaPreviewBox.addEventListener("mousemove", (e) => {
    if (!state.loupeActive) return;
    const rect = mediaPreviewBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensRadius = 65; // 130px diameter
    loupeLens.style.left = `${x - lensRadius}px`;
    loupeLens.style.top = `${y - lensRadius}px`;

    const zoom = 2.5;
    const bgX = (x * zoom) - lensRadius;
    const bgY = (y * zoom) - lensRadius;

    loupeLens.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
    loupeLens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  });

  mediaPreviewBox.addEventListener("mouseleave", () => {
    if (state.loupeActive) {
      loupeLens.style.display = "none";
    }
  });

  mediaPreviewBox.addEventListener("mouseenter", () => {
    if (state.loupeActive) {
      loupeLens.style.display = "block";
      loupeLens.style.backgroundImage = `url('${mainProductImage.src}')`;
    }
  });

  // Add Flaw Pin Trigger
  btnAddFlawPin.addEventListener("click", () => {
    const flawDesc = prompt("Enter specific condition or flaw note to disclose for Return-Shield™ protection:", "Slight hairline surface rub on bottom underside");
    if (flawDesc && flawDesc.trim()) {
      const newFlaw = {
        id: Date.now(),
        x: 50,
        y: 50,
        label: flawDesc.trim()
      };
      state.flaws.push(newFlaw);
      renderFlaws();
      showToast("Flaw pin added to Return-Shield — Re-generating copy with disclosure");
      
      // Update listings with the new flaw transparency
      const generated = window.gemmaEngine.generateAllListings(getFormSpecs(), state.flaws);
      state.listingData = generated;
      renderPlatformView();
    }
  });

  // Tone Chip Clicks
  toneChips.forEach(chip => {
    chip.addEventListener("click", () => {
      toneChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      state.currentTone = chip.dataset.tone;
      window.gemmaEngine.setTone(state.currentTone);

      // Re-generate copy with active persona
      state.specs = getFormSpecs();
      const generated = window.gemmaEngine.generateAllListings(state.specs, state.flaws);
      state.listingData = generated;
      renderPlatformView();
      showToast(`Switched AI Voice to: ${chip.textContent.trim()}`);
    });
  });

  // Currency Selector Pills
  currPills.forEach(pill => {
    pill.addEventListener("click", () => {
      currPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const curr = pill.dataset.currency;
      state.currentCurrency = curr;
      window.feeCalculator.setCurrency(curr);
      syncPricingInputs();
      calculateAndRenderFees();
      showToast(`Marketplace currency switched to ${curr}`);
    });
  });

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
        if (state.loupeActive) {
          loupeLens.style.backgroundImage = `url('${event.target.result}')`;
        }
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
      const generated = window.gemmaEngine.generateAllListings(state.specs, state.flaws);
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
    priceBadge.textContent = `${window.feeCalculator.getSymbol()}${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  priceNumber.addEventListener("input", (e) => {
    const val = Math.max(0, parseFloat(e.target.value) || 0);
    state.pricing.sellingPrice = val;
    priceRange.value = val;
    priceBadge.textContent = `${window.feeCalculator.getSymbol()}${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  cogsRange.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    state.pricing.cogs = val;
    cogsNumber.value = val.toFixed(2);
    cogsBadge.textContent = `${window.feeCalculator.getSymbol()}${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  cogsNumber.addEventListener("input", (e) => {
    const val = Math.max(0, parseFloat(e.target.value) || 0);
    state.pricing.cogs = val;
    cogsRange.value = val;
    cogsBadge.textContent = `${window.feeCalculator.getSymbol()}${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  shippingRange.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    state.pricing.shipping = val;
    shippingNumber.value = val.toFixed(2);
    shippingBadge.textContent = `${window.feeCalculator.getSymbol()}${val.toFixed(2)}`;
    calculateAndRenderFees();
  });

  shippingNumber.addEventListener("input", (e) => {
    const val = Math.max(0, parseFloat(e.target.value) || 0);
    state.pricing.shipping = val;
    shippingRange.value = val;
    shippingBadge.textContent = `${window.feeCalculator.getSymbol()}${val.toFixed(2)}`;
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

  // Modal: First Real User Case Study
  btnFirstUser.addEventListener("click", () => {
    caseStudyModal.classList.add("open");
  });

  btnCloseCaseStudy.addEventListener("click", () => {
    caseStudyModal.classList.remove("open");
  });

  caseStudyModal.addEventListener("click", (e) => {
    if (e.target === caseStudyModal) caseStudyModal.classList.remove("open");
  });

  // Modal: Architecture
  btnHowItWorks.addEventListener("click", () => {
    architectureModal.classList.add("open");
  });

  btnCloseArch.addEventListener("click", () => {
    architectureModal.classList.remove("open");
  });

  architectureModal.addEventListener("click", (e) => {
    if (e.target === architectureModal) architectureModal.classList.remove("open");
  });

  // Modal: Batch CSV Studio
  btnOpenBatch.addEventListener("click", () => {
    const metrics = window.batchProcessor.getAggregatedMetrics();
    batchTotalItems.textContent = `${metrics.count} Items`;
    batchGross.textContent = `$${metrics.totalGross.toFixed(2)}`;
    batchNet.textContent = `$${metrics.totalNet.toFixed(2)}`;
    batchAvgMargin.textContent = `${metrics.avgMargin.toFixed(1)}%`;

    batchTableBody.innerHTML = window.batchProcessor.items.map(item => {
      const fee = 0.20 + (item.price * 0.065) + (item.price * 0.03) + 0.25;
      const net = item.price - fee - item.cogs - item.shipping;
      const margin = (net / item.price) * 100;
      return `
        <tr>
          <td><code>SKU-${item.id}</code></td>
          <td><strong>${item.title}</strong></td>
          <td>${item.category}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${item.cogs.toFixed(2)}</td>
          <td>$${fee.toFixed(2)}</td>
          <td><strong style="color: #34d399;">$${net.toFixed(2)}</strong></td>
          <td>${margin.toFixed(1)}%</td>
          <td><span style="color: #38bdf8;">● ${item.status}</span></td>
        </tr>
      `;
    }).join("");

    batchModal.classList.add("open");
  });

  btnCloseBatch.addEventListener("click", () => {
    batchModal.classList.remove("open");
  });

  batchModal.addEventListener("click", (e) => {
    if (e.target === batchModal) batchModal.classList.remove("open");
  });

  btnExportBatchMasterCSV.addEventListener("click", () => {
    window.batchProcessor.exportMasterCSV();
    showToast("Master Batch Catalog CSV exported!");
  });

  // Modal: Social Story & Viral Drop Studio
  btnOpenSocialCard.addEventListener("click", () => {
    renderSocialPreview();
    socialCardModal.classList.add("open");
  });

  function renderSocialPreview() {
    state.specs = getFormSpecs();
    const copy = state.listingData.shopify ? state.listingData.shopify.copy : state.listingData.etsy.copy;
    const dataUrl = window.socialCardGenerator.renderCard(state.specs, state.pricing, copy, state.socialTheme);
    socialCardPreviewImg.src = dataUrl;
  }

  themeChoiceBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      themeChoiceBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.socialTheme = btn.dataset.style;
      renderSocialPreview();
    });
  });

  btnDownloadSocialCard.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = socialCardPreviewImg.src;
    a.download = `listercraft_story_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("1080x1920 Story Card downloaded!");
  });

  btnCloseSocialCard.addEventListener("click", () => {
    socialCardModal.classList.remove("open");
  });

  socialCardModal.addEventListener("click", (e) => {
    if (e.target === socialCardModal) socialCardModal.classList.remove("open");
  });

  // Escape key closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      caseStudyModal.classList.remove("open");
      architectureModal.classList.remove("open");
      batchModal.classList.remove("open");
      socialCardModal.classList.remove("open");
    }
  });

  // Initial Boot
  loadPreset("ceramic_dripper");
});
