/**
 * ListerCraft AI — Bulk CSV Inventory & Batch Processing Engine
 * Handles batch catalog processing, aggregated margin metrics, and master CSV exports
 */

class BatchProcessor {
  constructor() {
    this.items = [
      {
        id: "batch-1",
        title: "Handmade Speckled Ceramic Pour-Over Dripper",
        category: "Handmade Ceramics",
        price: 38.00,
        cogs: 8.00,
        shipping: 5.50,
        status: "Ready",
        tagsCount: 13,
        marginPct: 53.9
      },
      {
        id: "batch-2",
        title: "Mid-Century 1970s Amber Glass Decanter with Stopper",
        category: "Vintage Glassware",
        price: 64.00,
        cogs: 12.00,
        shipping: 9.50,
        status: "Ready",
        tagsCount: 13,
        marginPct: 50.2
      },
      {
        id: "batch-3",
        title: "1980s Vintage Distressed Leather Aviator Jacket",
        category: "Vintage Outerwear",
        price: 145.00,
        cogs: 35.00,
        shipping: 14.00,
        status: "Ready",
        tagsCount: 13,
        marginPct: 52.8
      },
      {
        id: "batch-4",
        title: "Handmade Chunky Giant-Knit Merino Wool Blanket",
        category: "Textiles & Home",
        price: 185.00,
        cogs: 42.00,
        shipping: 18.00,
        status: "Ready",
        tagsCount: 13,
        marginPct: 54.3
      },
      {
        id: "batch-5",
        title: "Hand-Turned Live Edge Black Walnut Valet Tray",
        category: "Handmade Woodwork",
        price: 48.00,
        cogs: 10.00,
        shipping: 6.00,
        status: "Ready",
        tagsCount: 13,
        marginPct: 56.4
      }
    ];
  }

  getAggregatedMetrics() {
    let totalGross = 0;
    let totalCogs = 0;
    let totalShipping = 0;
    let totalFees = 0;
    let totalNet = 0;

    this.items.forEach(item => {
      const gross = item.price;
      const cogs = item.cogs;
      const ship = item.shipping;
      // Standard Etsy calculation
      const fee = 0.20 + (gross * 0.065) + (gross * 0.03) + 0.25;
      const net = gross - fee - cogs - ship;

      totalGross += gross;
      totalCogs += cogs;
      totalShipping += ship;
      totalFees += fee;
      totalNet += net;
    });

    const avgMargin = totalGross > 0 ? (totalNet / totalGross) * 100 : 0;
    const avgRoi = (totalCogs + totalShipping) > 0 ? (totalNet / (totalCogs + totalShipping)) * 100 : 0;

    return {
      count: this.items.length,
      totalGross,
      totalCogs,
      totalShipping,
      totalFees,
      totalNet,
      avgMargin,
      avgRoi
    };
  }

  exportMasterCSV() {
    const headers = [
      "SKU",
      "Title",
      "Category",
      "Price_USD",
      "COGS",
      "Shipping",
      "Est_Etsy_Fee",
      "Est_Net_Profit",
      "Margin_Pct",
      "Status"
    ];

    const rows = this.items.map(item => {
      const fee = 0.20 + (item.price * 0.065) + (item.price * 0.03) + 0.25;
      const net = item.price - fee - item.cogs - item.shipping;
      const margin = (net / item.price) * 100;
      return [
        `"SKU-${item.id}"`,
        `"${item.title.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        item.price.toFixed(2),
        item.cogs.toFixed(2),
        item.shipping.toFixed(2),
        fee.toFixed(2),
        net.toFixed(2),
        `${margin.toFixed(1)}%`,
        `"${item.status}"`
      ].join(",");
    });

    const csvContent = headers.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `listercraft_master_batch_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

window.batchProcessor = new BatchProcessor();
