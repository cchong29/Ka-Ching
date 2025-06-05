// const express = require('express')
// const router = express.Router()
// const validateForm = require('../controllers/validateform')
// const pool = require("../supabaseClient")
// const bcrypt = require('bcryptjs');



// router.post('/login',async (req,res)=>{
//     validateForm(req,res);

//     const potentialLogin = await pool.query(
//         "SELECT id, email, passhash FROM users u WHERE u.email =$1", [req.body.email]
//     ); 

//     if (potentialLogin.rowCount > 0) {
//         // found the user
//         const isSamePass = await bcrypt.compare(req.body.password,potentialLogin.rows[0].passhash);

//         if (isSamePass){
//             // login
//             req.session.user = { // storing an obj called user in the session
//                 email: req.body.email,
//                 id : potentialLogin.rows[0].id,
//             }
//             res.json({loggedIn : true,email:req.body.email}) // sending back an object with the email

//         } else {
//             // password is wrong
//             res.json({loggedIn : false, status : 'Wrong email or password'}) // don't want to be too specific

//         }

//     } else {
//         // email is wrong
//         res.json({loggedIn : false, status : 'Wrong email or password'}) // don't want to be too specific
//     }

    
    

    
// })

// router.post('/register',async(req,res)=>{
//     validateForm(req,res);

//     const existingUser = await pool.query(
//         "SELECT email from users WHERE email = $1",
//         [req.body.email]
//     );

//     if (existingUser.rowCount === 0){
//         //register
//         const hashedPass = await bcrypt.hash(req.body.password,10);
//         const newUserQuery = await pool.query(
//             "INSERT INTO users (email, passhash) values($1,$2) RETURNING id, email",
//             [req.body.email,hashedPass]
//         );
//         req.session.user = {
//             email : req.body.email,
//             id : newUserQuery.rows[0].id,
//         }
//         res.json({loggedIn : true,email:req.body.email})
//     } else {
//         res.json({loggedIn : false,status : 'email taken'});
//     }
// })


// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// router.post('/google-login', async (req, res) => {
//   const { idToken } = req.body;
//   const ticket = await client.verifyIdToken({
//     idToken,
//     audience: process.env.GOOGLE_CLIENT_ID,
//   });

//   const payload = ticket.getPayload();
//   const email = payload.email;

//   const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

//   let userId;
//   if (existingUser.rowCount === 0) {
//     const newUser = await pool.query(
//       'INSERT INTO users (email, passhash) VALUES ($1, $2) RETURNING id',
//       [email, 'googleuser'] // or null/placeholder
//     );
//     userId = newUser.rows[0].id;
//   } else {
//     userId = existingUser.rows[0].id;
//   }

//   req.session.user = {
//     id: userId,
//     email,
//   };

//   res.json({ loggedIn: true, email });
// });


// module.exports = router // Exporting the router



// New using supabase
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../supabaseClient');


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
