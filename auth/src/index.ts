import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('Das muessen die Daten des Benutzerz sein!!!!');
});

app.listen(3000, () => {
  console.log('=> Lauschen auf Port 3000!!');
});
