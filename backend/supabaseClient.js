// Raw database logic
// const {Pool} = require('pg');
// require("dotenv").config()

// const pool = new Pool({
//     user: process.env.DATABASE_USER,
//     host: process.env.DATABASE_HOST,
//     database: process.env.DATABASE_NAME,
//     password: process.env.DATABASE_PASSWORD,
//     port: process.env.DATABASE_PORT
// });

// module.exports = pool;


const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;
