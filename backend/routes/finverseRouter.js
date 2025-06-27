const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();


const FINVERSE_BASE = "https://api.prod.finverse.net";
const CLIENT_ID = process.env.FINVERSE_CLIENT_ID;
const CLIENT_SECRET = process.env.FINVERSE_CLIENT_SECRET;
const REDIRECT_URI = process.env.FINVERSE_REDIRECT_URI;


// Generate Customer Token
router.post("/token", async (req, res) => {
  console.log('Starting Customer Token Generation process')
  const resp = await axios.post(`${FINVERSE_BASE}/auth/customer/token`, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
  });
  console.log("Generated customer token");
  res.json(resp.data); // contains customer_token

  
});

// Generate link token (for launching Finverse link)
// Using link URL included in the link_token response to launch Finverse Link UI
// which will guide the end-user through selecting an institution and authenticating with it.
router.post("/link-token", async (req, res) => {
  const { customer_token } = req.body;
  const result = await axios.post(
    `${FINVERSE_BASE}/link/token`,
    {
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      state: "setup_on_developer_portal_stateparameter",
      user_id: "customer_user1",
      grant_type: "client_credentials",
      response_mode: "query",
      response_type: "code",
    },
    {
      headers: { Authorization: `Bearer ${customer_token}` },
    }
  );
  res.json(result.data); // contains link_url
});

router.post("/exchange-code", async (req, res) => {
  const { code } = req.body;
  const result = await axios.post(`${FINVERSE_BASE}/auth/token`, {
    code,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });
  res.json(result.data); // contains login_identity_token

  // Securely store each login_identity_token in backend
  // Note: an end-user with 2 linked institutions will have a distinct token for each institution.
});

// 4. Fetch transactions using login_identity_token
router.get("/transactions/:account_id", async (req, res) => {
  const { account_id } = req.params;
  const { login_identity_token } = req.headers;

  try {
    const response = await axios.get(
      `${FINVERSE_BASE}/transactions/${account_id}?offset=0&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${login_identity_token}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching transactions:",
      error.response?.data || error
    );
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Add the callback route
router.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;
    console.log("Received code:", code);
    
    if (!code) {
      return res.status(400).send("No authorization code received");
    }

    // Exchange code for token
    const result = await axios.post(`${FINVERSE_BASE}/auth/token`, {
      code,
      client_id: CLIENT_ID,
      redirect_uri: process.env.FINVERSE_REDIRECT_URI, // Same redirect_uri as in link-token
      grant_type: "authorization_code",
    });

    const { access_token: login_identity_token } = result.data;
    console.log("Successfully exchanged code for token");
    
    // Redirect back to your app with success
    // You'll need to configure a custom scheme for your app
    res.redirect(`yourapp://finverse-success?token=${encodeURIComponent(login_identity_token)}`);
    
  } catch (error) {
    console.error("Error in callback:", error);
    res.status(500).send("Authentication failed");
  }
});

// In your finverse routes file
router.get("/test", (req, res) => {
  res.json({ message: "Finverse routes working!" });
});

module.exports = router;
