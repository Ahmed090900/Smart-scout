const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/approve', (req, res) => {
  const { paymentId } = req.body;
  console.log('Approve:', paymentId);
  res.json({ approved: true });
});

app.post('/api/complete', (req, res) => {
  const { paymentId, txid } = req.body;
  console.log('Complete:', paymentId, txid);
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
