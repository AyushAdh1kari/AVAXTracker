const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = 3000;

// Snowtrace API Key (Replace with your actual key)
const API_KEY = "YOUR_SNOWTRACE_API_KEY";

// ✅ Serve static files from 'public' (but NOT index.html)
app.use(express.static("public"));
app.use(express.json());

// ✅ Serve index.html from the root folder
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Fetch transactions using Snowtrace API
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
                value: (parseInt(tx.value) / 10 ** 18).toFixed(6) + " AVAX",
                timestamp: new Date(Number(tx.timeStamp) * 1000).toLocaleString(),
                gasUsed: tx.gasUsed,
                gasPrice: (parseInt(tx.gasPrice) / 10 ** 9).toFixed(2) + " Gwei"
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

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
