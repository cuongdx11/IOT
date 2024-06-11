const express = require('express');
const router = express.Router();
const mqtt = require('mqtt');
const mysql = require('mysql2');
const ip = require('ip');
const cors = require('cors');

const myIPv4Address = ip.address('public', 'ipv4');
const mqttServer = `mqtt://${myIPv4Address}`;
const ledTopic = 'led';
const fanTopic = 'fan';

const client = mqtt.connect(mqttServer);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '30072002',
  database: 'mqtt'
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

router.use(cors());
router.use(express.json());

client.on('error', (error) => {
  console.error('MQTT error:', error);
});

// Xử lý bật/tắt đèn
router.post('/light', (req, res) => {
  const { isLightOn } = req.body;
  const action = isLightOn ? 'ON' : 'OFF';

  client.publish(ledTopic, action, (err) => {
    if (err) {
      return res.status(500).json({ error: 'MQTT Publish Error' });
    }

    const currentTime = new Date();
    const query = 'INSERT INTO history_action (action, device, time) VALUES (?, ?, ?)';
    db.query(query, [action, 'LIGHT', currentTime], (error, results) => {
      if (error) {
        console.error('Failed to insert data into MySQL:', error);
      } else {
        console.log('Inserted data into MySQL');
        console.log(action);
      }
    });

    res.json({ message: `Light turned ${action}` });
  });
});

// Xử lý bật/tắt quạt
router.post('/fan', (req, res) => {
  const { isFanOn } = req.body;
  const action = isFanOn ? 'ON' : 'OFF';

  client.publish(fanTopic, action, (err) => {
    if (err) {
      return res.status(500).json({ error: 'MQTT Publish Error' });
    }

    const currentTime = new Date();
    const query = 'INSERT INTO history_action (action, device, time) VALUES (?, ?, ?)';
    db.query(query, [action, 'FAN', currentTime], (error, results) => {
      if (error) {
        console.error('Failed to insert data into MySQL:', error);
      } else {
        console.log('Inserted data into MySQL');
        console.log(action);
      }
    });

    res.json({ message: `Fan turned ${action}` });
  });
});

module.exports = router;
