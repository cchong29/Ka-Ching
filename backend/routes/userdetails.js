// Using supabase
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.get('/username', async (req, res) => {
    // ✅ Step 1: Extract token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    // ✅ Step 2: Verify token with Supabase (calls their Auth API)
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  
    // ✅ Step 3: Use `user.id` to look up your app's DB
    const { data, error: dbError } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single();
  
    if (dbError) {
      return res.status(500).json({ error: 'DB error' });
    }
  
    // ✅ Step 4: Return user info
    res.json({ name: data.name });
  });
  
  
  module.exports = router;
