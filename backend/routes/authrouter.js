// Using supabase
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../supabaseClient');

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('email')
    .eq('email', email);

  if (existingUserError) return res.status(500).json({ status: existingUserError.message });

  if (existingUser.length === 0) {
    const hashedPass = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ email, passhash: hashedPass }])
      .select('id')
      .single();

    if (insertError) return res.status(500).json({ status: insertError.message });

    res.json({ loggedIn: true, email });
  } else {
    res.json({ loggedIn: false, status: 'email taken' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, passhash')
    .eq('email', email)
    .single();

  if (error) return res.status(401).json({ loggedIn: false, status: 'Wrong email or password' });

  const isSamePass = await bcrypt.compare(password, users.passhash);
  if (isSamePass) {
    res.json({ loggedIn: true, email });
  } else {
    res.json({ loggedIn: false, status: 'Wrong email or password' });
  }
});

// GOOGLE LOGIN
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  const { idToken } = req.body;
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload.email;

  const { data: existingUser, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  let userId;
  if (error) {
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ email, passhash: 'googleuser' }])
      .select('id')
      .single();

    if (insertError) return res.status(500).json({ status: insertError.message });
    userId = newUser.id;
  } else {
    userId = existingUser.id;
  }

  res.json({ loggedIn: true, email });
});

// Signout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Logout error:', err);
        return res.status(500).json({ status: 'Logout failed' });
      }
      res.clearCookie('sid');
      return res.json({ loggedOut: true });
    });
  });

  
module.exports = router;
