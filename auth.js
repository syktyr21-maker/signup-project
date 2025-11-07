const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) return res.status(400).send('همه فیلدها الزامی هستند');

  const hashed = await bcrypt.hash(password, 10);

  let db = {};
  try {
    const raw = fs.readFileSync('db.json', 'utf8');
    db = raw ? JSON.parse(raw) : {};
  } catch {
    db = {};
  }

  if (db[email]) return res.status(409).send('این ایمیل قبلاً ثبت شده');

  db[email] = { fullname, password: hashed };
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  res.send('ثبت‌نام موفق بود');
});

app.listen(3000, () => {
  console.log('سرور فعال روی پورت 3000');
});
