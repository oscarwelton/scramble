const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname,"public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
