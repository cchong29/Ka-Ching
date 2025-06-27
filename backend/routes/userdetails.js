// Using supabase
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.get("/username", async (req, res) => {
  // ✅ Step 1: Extract token
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // ✅ Step 2: Verify token with Supabase (calls their Auth API)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // ✅ Step 3: Use `user.id` to look up your app's DB
  const { data, error: dbError } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();

  if (dbError) {
    return res.status(500).json({ error: "DB error" });
  }

  // ✅ Step 4: Return user info
  res.json({ name: data.name });
});

// Get user's connected bank accounts from Supabase
// router.get('/user/bank-accounts', getUserFromToken, async (req, res) => {
//     try {
//       const { data: accounts, error } = await supabase
//         .from('user_bank_accounts')
//         .select(`
//           *,
//           user_bank_connections (
//             institution_name,
//             connection_status
//           )
//         `)
//         .eq('user_id', req.user.id)
//         .eq('is_active', true);

//       if (error) {
//         console.error('Error fetching accounts:', error);
//         return res.status(500).json({ error: 'Failed to fetch bank accounts' });
//       }

//       res.json(accounts);
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

module.exports = router;
