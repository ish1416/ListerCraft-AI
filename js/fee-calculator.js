/**
 * ListerCraft AI — E-Commerce Profit & Fee Intelligence Engine
 * Computes exact marketplace fee breakdown, net profit, margin %, ROI, and breakeven
 */

class FeeCalculator {
  constructor() {
    // Platform fee schedules (2026 current standard rates)
    this.rates = {
      etsy: {
        listingFee: 0.20,
        transactionRate: 0.065, // 6.5%
        paymentRate: 0.03,      // 3.0%
        paymentFlat: 0.25       // $0.25
      },
      ebay: {
        insertionFee: 0.40,
        finalValueRate: 0.1325  // 13.25% standard category
      },
      shopify: {
        flatFee: 0.30,
        cardRate: 0.029         // 2.9% standard Shopify/Stripe
      }
    };
  }

  calculateEtsy(price, cogs, shipping) {
    const gross = Math.max(0, parseFloat(price) || 0);
    const costOfGoods = Math.max(0, parseFloat(cogs) || 0);
    const shippingCost = Math.max(0, parseFloat(shipping) || 0);
    const totalOutlay = costOfGoods + shippingCost;

    const transactionFee = gross * this.rates.etsy.transactionRate;
    const paymentFee = (gross * this.rates.etsy.paymentRate) + this.rates.etsy.paymentFlat;
    const totalFees = this.rates.etsy.listingFee + transactionFee + paymentFee;

    const netProfit = gross - totalFees - totalOutlay;
    const marginPct = gross > 0 ? (netProfit / gross) * 100 : 0;
    const roiPct = totalOutlay > 0 ? (netProfit / totalOutlay) * 100 : 0;
    const feePctOfGross = gross > 0 ? (totalFees / gross) * 100 : 0;

    // Breakeven calculation: Price * (1 - 0.095) = totalOutlay + 0.45
    const breakeven = (totalOutlay + 0.45) / (1 - 0.095);

    return {
      gross,
      totalFees,
      feeBreakdown: {
        listing: this.rates.etsy.listingFee,
        transaction: transactionFee,
        payment: paymentFee
      },
      outlay: totalOutlay,
      netProfit,
      marginPct,
      roiPct,
      feePctOfGross,
      breakeven
    };
  }

  calculateEbay(price, cogs, shipping) {
    const gross = Math.max(0, parseFloat(price) || 0);
    const costOfGoods = Math.max(0, parseFloat(cogs) || 0);
    const shippingCost = Math.max(0, parseFloat(shipping) || 0);
    const totalOutlay = costOfGoods + shippingCost;

    const finalValueFee = gross * this.rates.ebay.finalValueRate;
    const totalFees = this.rates.ebay.insertionFee + finalValueFee;

    const netProfit = gross - totalFees - totalOutlay;
    const marginPct = gross > 0 ? (netProfit / gross) * 100 : 0;
    const roiPct = totalOutlay > 0 ? (netProfit / totalOutlay) * 100 : 0;
    const feePctOfGross = gross > 0 ? (totalFees / gross) * 100 : 0;

    // Breakeven: Price * (1 - 0.1325) = totalOutlay + 0.40
    const breakeven = (totalOutlay + 0.40) / (1 - 0.1325);

    return {
      gross,
      totalFees,
      feeBreakdown: {
        insertion: this.rates.ebay.insertionFee,
        finalValue: finalValueFee
      },
      outlay: totalOutlay,
      netProfit,
      marginPct,
      roiPct,
      feePctOfGross,
      breakeven
    };
  }

  calculateShopify(price, cogs, shipping) {
    const gross = Math.max(0, parseFloat(price) || 0);
    const costOfGoods = Math.max(0, parseFloat(cogs) || 0);
    const shippingCost = Math.max(0, parseFloat(shipping) || 0);
    const totalOutlay = costOfGoods + shippingCost;

    const cardFee = (gross * this.rates.shopify.cardRate) + this.rates.shopify.flatFee;
    const totalFees = cardFee;

    const netProfit = gross - totalFees - totalOutlay;
    const marginPct = gross > 0 ? (netProfit / gross) * 100 : 0;
    const roiPct = totalOutlay > 0 ? (netProfit / totalOutlay) * 100 : 0;
    const feePctOfGross = gross > 0 ? (totalFees / gross) * 100 : 0;

    // Breakeven: Price * (1 - 0.029) = totalOutlay + 0.30
    const breakeven = (totalOutlay + 0.30) / (1 - 0.029);

    return {
      gross,
      totalFees,
      feeBreakdown: {
        cardProcessing: cardFee
      },
      outlay: totalOutlay,
      netProfit,
      marginPct,
      roiPct,
      feePctOfGross,
      breakeven
    };
  }

  getPricingAdvice(price, cogs, shipping, etsyResult) {
    const { marginPct, netProfit, breakeven } = etsyResult;

    if (netProfit <= 0) {
      return {
        type: "danger",
        title: "⚠️ Unprofitable Pricing Warning",
        body: `At $${price.toFixed(2)}, you are losing money (-$${Math.abs(netProfit).toFixed(2)}) after marketplace fees and packaging. Your minimum breakeven price is $${breakeven.toFixed(2)}. Consider pricing at least $${(breakeven * 1.35).toFixed(2)} to secure a 25% profit margin.`
      };
    } else if (marginPct < 30) {
      return {
        type: "warning",
        title: "⚡ Tight Margin Notice",
        body: `At $${price.toFixed(2)}, your net margin on Etsy is ${marginPct.toFixed(1)}% ($${netProfit.toFixed(2)} profit). A single customer return or damage replacement could wipe out your gains. Consider testing $${(price * 1.2).toFixed(2)} for healthier resilience.`
      };
    } else if (marginPct >= 30 && marginPct < 55) {
      return {
        type: "optimal",
        title: "💡 Optimal Profit Zone",
        body: `At $${price.toFixed(2)}, your net margin on Etsy is ${marginPct.toFixed(1)}%. Your breakeven selling price is $${breakeven.toFixed(2)}. You pocket $${netProfit.toFixed(2)} clean on every order.`
      };
    } else {
      return {
        type: "high",
        title: "🌟 High-Yield Artisan Margin",
        body: `Exceptional ${marginPct.toFixed(1)}% net margin! You retain $${netProfit.toFixed(2)} net profit per unit sold. This gives you strong room for running flash sales, paid Etsy ads, or bundling accessories.`
      };
    }
  }
}

// Export singleton instance
window.feeCalculator = new FeeCalculator();
