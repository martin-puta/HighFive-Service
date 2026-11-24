import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const devices = [
  { id: 'home', name: 'Pilote maison', type: 'home', state: 'ready', on: true },
  { id: 'heating', name: 'Chauffage', type: 'flame', state: 'off', on: false },
  { id: 'cooling', name: 'Climatisation', type: 'snow', state: 'off', on: false },
  { id: 'sprayer', name: 'Pulvérisateur', type: 'spray', state: 'off', on: false },
  { id: 'mosquito', name: 'Anti-moustique', type: 'bug', state: 'off', on: false }
];

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'HighFive Service API' }));
app.get('/api/profile', (_req, res) => res.json({ name: 'Martin Puta Sudi', email: 'martin@example.com' }));
app.get('/api/devices', (_req, res) => res.json({ devices }));
app.get('/api/connection', (_req, res) => res.json({ device: 'HC-05', connected: false, discovered: true }));
app.post('/api/devices/:id/toggle', (req, res) => {
  const device = devices.find((item) => item.id === req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  device.on = !device.on;
  device.state = device.on ? 'on' : 'off';
  return res.json(device);
});
app.post('/api/profile', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email || !email.includes('@')) return res.status(400).json({ error: 'Name and valid email are required' });
  res.status(201).json({ name, email });
});

app.listen(port, '0.0.0.0', () => console.log(`HighFive API listening on http://localhost:${port}`));
