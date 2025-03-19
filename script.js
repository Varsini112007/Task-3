// Set up initial variables
let balance = 10000; // Initial balance in USD
let assetHoldings = 0; // Number of assets the bot owns
let profitLoss = 0; // Profit and loss from the bot's trading
let currentPrice = 0; // Current price of the asset
let tradingActive = false; // Whether the bot is active or not
let chartData = []; // Data to display on the chart
let intervalId = null;

// Generate random price data for asset
function generateRandomPrice() {
    let minPrice = 90;
    let maxPrice = 110;
    currentPrice = Math.random() * (maxPrice - minPrice) + minPrice;
    return currentPrice;
}

// Initialize the chart
const chart = LightweightCharts.createChart(document.getElementById('chart-container'), {
    width: document.getElementById('chart-container').clientWidth,
    height: 400,
    layout: {
        backgroundColor: '#fff',
        textColor: '#000',
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    priceScale: {
        borderColor: '#ccc',
    },
    timeScale: {
        borderColor: '#ccc',
    },
});

const lineSeries = chart.addLineSeries();

// Update the chart with new price data
function updateChartData() {
    const time = Math.floor(Date.now() / 1000); // current time in Unix format
    chartData.push({ time: time, value: currentPrice });
    if (chartData.length > 100) {
        chartData.shift(); // Keep only the last 100 data points
    }
    lineSeries.setData(chartData);
}

// Trading algorithm: Buy Low, Sell High
function trade() {
    if (!tradingActive) return;

    const price = generateRandomPrice(); // Generate new random price
    const balanceEl = document.getElementById('balance');
    const assetHoldingsEl = document.getElementById('assetHoldings');
    const profitLossEl = document.getElementById('profitLoss');
    const currentPriceEl = document.getElementById('currentPrice');

    currentPrice = price;
    currentPriceEl.textContent = price.toFixed(2);

    // Update chart with new data point
    updateChartData();

    // Strategy: Buy if balance is sufficient and price is low
    if (balance > 0 && assetHoldings === 0 && price < 100) {
        // Buy 100 units at current price
        const quantityToBuy = Math.floor(balance / price);
        const cost = quantityToBuy * price;
        if (quantityToBuy > 0) {
            assetHoldings += quantityToBuy;
            balance -= cost;
            profitLoss -= cost; // Include cost in profit/loss
        }
    }

    // Strategy: Sell if we own assets and price is high
    if (assetHoldings > 0 && price > 105) {
        const revenue = assetHoldings * price;
        balance += revenue;
        profitLoss += revenue; // Include revenue in profit/loss
        assetHoldings = 0;
    }

    // Update status on the UI
    balanceEl.textContent = balance.toFixed(2);
    assetHoldingsEl.textContent = assetHoldings;
    profitLossEl.textContent = profitLoss.toFixed(2);
}

// Start or stop the trading bot
document.getElementById('startBtn').addEventListener('click', () => {
    if (tradingActive) {
        clearInterval(intervalId); // Stop the trading bot
        document.getElementById('startBtn').textContent = 'Start Trading Bot';
    } else {
        intervalId = setInterval(trade, 1000); // Start trading every second
        document.getElementById('startBtn').textContent = 'Stop Trading Bot';
    }
    tradingActive = !tradingActive;
});
