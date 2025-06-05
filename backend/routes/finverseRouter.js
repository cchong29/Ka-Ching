const express = require('express');
const axios = require('axios');
const router = express.Router();

const FINVERSE_BASE = 'https://api.prod.finverse.net';
const CLIENT_ID = process.env.FINVERSE_CLIENT_ID;
const CLIENT_SECRET = process.env.FINVERSE_CLIENT_SECRET;


// Generate Customer Token
router.post('/finverse/token', async (req, res) => {
  const resp = await axios.post(`${FINVERSE_BASE}/auth/customer/token`, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'client_credentials',
  });
  res.json(resp.data); // contains customer_token
});

// Generate link token (for launching Finverse link)
// Using link URL included in the link_tken response to launch Finverse Link UI 
// which will guide the end-user through selecting an institution and authenticating with it.
router.post('/finverse/link-token', async (req, res) => {
  const { customer_token } = req.body;
  const result = await axios.post(`${FINVERSE_BASE}/link/token`, {
    ui_mode: 'iframe',
    redirect_uri: 'https://your-ngrok-url/callback',
  }, {
    headers: { Authorization: `Bearer ${customer_token}` }
  });
  res.json(result.data); // contains link_url
});


router.post('/finverse/exchange-code', async (req, res) => {
  const { code } = req.body;
  const result = await axios.post(`${FINVERSE_BASE}/auth/token`, {
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  res.json(result.data); // contains login_identity_token
});

// 4. Fetch transactions using login_identity_token
router.get('/transactions/:account_id', async (req, res) => {
  const { account_id } = req.params;
  const { login_identity_token } = req.headers;

  try {
    const response = await axios.get(`https://api.prod.finverse.net/transactions/${account_id}`, {
      headers: {
        Authorization: `Bearer ${login_identity_token}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching transactions:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

//test commit