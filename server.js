const express = require("express");
const fetch = require("node-fetch"); // Required for making API calls
const path = require("path");

const app = express();
const PORT = 3000;

// Snowtrace API Key (Replace with your actual key)
const API_KEY = "YOUR_SNOWTRACE_API_KEY"; 

// Middleware to serve static files
app.use(express.static("public"));
app.use(express.json());

// Fetch transactions using Snowtrace API
app.get("/transactions", async (req, res) => {
    const { address } = req.query;
    if (!address) {
        return res.status(400).json({ error: "Address is required" });
    }

    try {
        const url = `https://api-testnet.snowtrace.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "1") {
            const transactions = data.result.map((tx) => ({
                hash: tx.hash,
                from: tx.from,
                to: tx.to || "Contract Interaction",
                value: (parseInt(tx.value) / 10**18).toFixed(6) + " AVAX", // Convert from Wei to AVAX
                timestamp: new Date(Number(tx.timeStamp) * 1000).toLocaleString(), // Convert timestamp
                gasUsed: tx.gasUsed,
                gasPrice: (parseInt(tx.gasPrice) / 10**9).toFixed(2) + " Gwei" // Convert gas price to Gwei
            }));

            res.json(transactions);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json([]);
    }
});

// Serve frontend HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
