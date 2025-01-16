const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const app = express();
const PORT = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse POST data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Me' });
});

app.get('/confession', (req, res) => {
  res.render('confession', { title: 'Confess to Me' });
});

app.post('/submit-confession', (req, res) => {
  const confession = req.body.confession;
  const currentTime = moment().tz("Asia/Manila").format('MMMM Do YYYY, h:mm:ss A');
  console.log(`New Confession: ${confession} at ${currentTime}`);

  // Save confession and timestamp to file (ensure proper structure)
  const confessionData = {
    confession: confession,
    timestamp: currentTime
  };

  // Count the existing confession files to assign a numeric ID
  let confessionCount = 1;
  const files = fs.readdirSync('uploads');
  files.forEach(file => {
    if (file.startsWith('confess#')) {
      confessionCount++;
    }
  });

  const filename = `confess#${confessionCount}.json`;

  // Save confession data to file
  fs.writeFileSync(`uploads/${filename}`, JSON.stringify({ data: confessionData }));

  res.render('thanks', { title: 'Thank You' });
});

app.get('/testing', (req, res) => {
  res.render('testing', { title: 'Testing' });
});

app.get('/admin', (req, res) => {
  const files = fs.readdirSync('uploads');
  const confessions = files.filter(file => file.startsWith('confess#')).map(file => {
    const fileContent = fs.readFileSync(`uploads/${file}`);
    return { ...JSON.parse(fileContent), fileName: file };
  });

  // Log confessions for debugging
  console.log(confessions);

  res.render('admin', { title: 'Admin Dashboard', confessions });
});

app.post('/admin/delete-confession', (req, res) => {
  const confessionFile = req.body.confessionFile;
  fs.unlinkSync(`uploads/${confessionFile}`);
  res.redirect('/admin');
});

app.post('/admin/change-password', (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  // Validate old password (you can replace this with actual password check)
  if (oldPassword === 'Jmlabaco200805') {
    // Change the password logic here
    console.log('Password changed to:', newPassword);
    res.redirect('/admin');
  } else {
    res.send('Old password is incorrect');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
