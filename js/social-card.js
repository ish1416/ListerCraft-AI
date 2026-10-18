/**
 * ListerCraft AI — Social Media Story & Promo Card Generator
 * Renders high-converting 9:16 aesthetic product cards to HTML5 Canvas and exports PNG
 */

class SocialCardGenerator {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1080;
    this.canvas.height = 1920;
    this.ctx = this.canvas.getContext("2d");
  }

  renderCard(specs, pricing, platformCopy, style = "dark") {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Background themes
    if (style === "terracotta") {
      ctx.fillStyle = "#1e1410";
      ctx.fillRect(0, 0, w, h);
      // Ambient warm radial
      const grad = ctx.createRadialGradient(w / 2, 500, 100, w / 2, 500, 900);
      grad.addColorStop(0, "rgba(234, 88, 12, 0.35)");
      grad.addColorStop(1, "rgba(10, 8, 6, 0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (style === "vintage") {
      ctx.fillStyle = "#0c151c";
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, 500, 100, w / 2, 500, 900);
      grad.addColorStop(0, "rgba(6, 182, 212, 0.3)");
      grad.addColorStop(1, "rgba(8, 14, 20, 0.98)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else {
      // Modern Dark Obsidian & Amber
      ctx.fillStyle = "#0a0c10";
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, 450, 80, w / 2, 450, 950);
      grad.addColorStop(0, "rgba(245, 158, 11, 0.28)");
      grad.addColorStop(1, "rgba(10, 12, 16, 0.98)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Outer subtle border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Top Brand Pill
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    this.roundRect(ctx, 80, 80, 460, 80, 40, true, false);
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("⚡ LISTERCRAFT STUDIO", 120, 132);

    // Provenance Tag
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 28px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(specs.era || "Artisan Made", w - 90, 132);
    ctx.textAlign = "left";

    // Draw Main Product Image
    const imgEl = document.getElementById("mainProductImage");
    if (imgEl && imgEl.complete) {
      try {
        const imgX = 80;
        const imgY = 200;
        const imgW = w - 160;
        const imgH = 920;

        ctx.save();
        this.roundRect(ctx, imgX, imgY, imgW, imgH, 32, false, false);
        ctx.clip();
        ctx.drawImage(imgEl, imgX, imgY, imgW, imgH);
        ctx.restore();

        // Image glowing border
        ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
        ctx.lineWidth = 4;
        this.roundRect(ctx, imgX, imgY, imgW, imgH, 32, false, true);

        // Price Badge Overlay
        ctx.fillStyle = "rgba(10, 12, 16, 0.92)";
        this.roundRect(ctx, imgX + 40, imgY + imgH - 140, 320, 90, 45, true, false);
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 46px 'JetBrains Mono', monospace";
        ctx.fillText(`$${pricing.sellingPrice.toFixed(2)}`, imgX + 80, imgY + imgH - 78);
      } catch (err) {
        console.warn("Canvas image render note:", err);
      }
    }

    // Category / Condition Badges
    const badgeY = 1170;
    ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
    this.roundRect(ctx, 80, badgeY, 340, 60, 30, true, false);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`★ ${specs.condition}`, 110, badgeY + 40);

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    this.roundRect(ctx, 440, badgeY, 360, 60, 30, true, false);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "600 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(specs.category, 470, badgeY + 40);

    // Product Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px 'Playfair Display', serif";
    this.wrapText(ctx, specs.title, 80, 1310, w - 160, 64, 2);

    // Materials & Details Strip
    ctx.fillStyle = "#94a3b8";
    ctx.font = "30px 'Plus Jakarta Sans', sans-serif";
    const details = `Materials: ${specs.materials.substring(0, 70)}...`;
    ctx.fillText(details, 80, 1480);

    // Quote / Copy Snippet Box
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    this.roundRect(ctx, 80, 1530, w - 160, 210, 24, true, false);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2;
    this.roundRect(ctx, 80, 1530, w - 160, 210, 24, false, true);

    ctx.fillStyle = "#fef3c7";
    ctx.font = "italic 28px 'Plus Jakarta Sans', sans-serif";
    const firstSentence = platformCopy.split(".")[0] + ". " + (platformCopy.split(".")[1] || "") + "...";
    this.wrapText(ctx, `“${firstSentence}”`, 120, 1600, w - 240, 42, 3);

    // Footer CTA Bar
    ctx.fillStyle = "linear-gradient(90deg, #f59e0b, #ea580c)";
    this.roundRect(ctx, 80, 1780, w - 160, 80, 40, true, false);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TAP LINK IN BIO TO SHOP THE DROP", w / 2, 1832);
    ctx.textAlign = "left";

    return this.canvas.toDataURL("image/png");
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 10) {
    const words = text.split(" ");
    let line = "";
    let linesDrawn = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
        linesDrawn++;
        if (linesDrawn >= maxLines - 1 && n < words.length - 1) {
          ctx.fillText(line.trim() + "...", x, y);
          return;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
}

window.socialCardGenerator = new SocialCardGenerator();
