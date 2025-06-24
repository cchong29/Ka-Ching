// Using supabase
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  console.log("SIGNUP RESPONSE:", { error }); // 👈 ADD THIS

  if (error)
    return res.json({ status: "Error signing up", error: error.message });
  else {
    return res.json({
      loggedIn: true,
      status: "Success, Check your email for the confirmation link!",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    return res.json({
      loggedIn: false,
      status: "Wrong email or password",
      error: error.message,
    });
  else {
    return res.json({ loggedIn: true, email });
  }
});

// Signout
router.post("/logout", async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error)
    return res
      .status(500)
      .json({ status: "Logout failed", error: error.message });
  return res.json({ loggedOut: true });
});


module.exports = router;
