const express = require('express')
const router = express.Router()
const validateForm = require('../controllers/validateform')
const pool = require("../database")
const bcrypt = require("bcrypt");



router.post('/login',async (req,res)=>{
    validateForm(req,res);

    const potentialLogin = await pool.query(
        "SELECT id, email, passhash FROM users u WHERE u.email =$1", [req.body.email]
    ); 

    if (potentialLogin.rowCount > 0) {
        // found the user
        const isSamePass = await bcrypt.compare(req.body.password,potentialLogin.rows[0].passhash);

        if (isSamePass){
            // login
            req.session.user = { // storing an obj called user in the session
                email: req.body.email,
                id : potentialLogin.rows[0].id,
            }
            res.json({loggedIn : true,email:req.body.email}) // sending back an object with the email

        } else {
            // password is wrong
            res.json({loggedIn : false, status : 'Wrong email or password'}) // don't want to be too specific

        }

    } else {
        // email is wrong
        res.json({loggedIn : false, status : 'Wrong email or password'}) // don't want to be too specific
    }

    
    

    
})

router.post('/register',async(req,res)=>{
    validateForm(req,res);

    const existingUser = await pool.query(
        "SELECT email from users WHERE email = $1",
        [req.body.email]
    );

    if (existingUser.rowCount === 0){
        //register
        const hashedPass = await bcrypt.hash(req.body.password,10);
        const newUserQuery = await pool.query(
            "INSERT INTO users (email, passhash) values($1,$2) RETURNING id, email",
            [req.body.email,hashedPass]
        );
        req.session.user = {
            email : req.body.email,
            id : newUserQuery.rows[0].id,
        }
        res.json({loggedIn : true,email:req.body.email})
    } else {
        res.json({loggedIn : false,status : 'email taken'});
    }
})


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

  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

  let userId;
  if (existingUser.rowCount === 0) {
    const newUser = await pool.query(
      'INSERT INTO users (email, passhash) VALUES ($1, $2) RETURNING id',
      [email, 'googleuser'] // or null/placeholder
    );
    userId = newUser.rows[0].id;
  } else {
    userId = existingUser.rows[0].id;
  }

  req.session.user = {
    id: userId,
    email,
  };

  res.json({ loggedIn: true, email });
});


module.exports = router // Exporting the router