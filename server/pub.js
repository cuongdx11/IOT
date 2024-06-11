const express = require('express');
const mqtt = require('mqtt');
const mysql = require('mysql2');
const ip = require('ip');
const myIPv4Address = ip.address('public', 'ipv4'); // Lấy địa chỉ IPv4 mạng
const app = express();
const port = 3001; // Chọn cổng bạn muốn sử dụng
const cors = require('cors');
const mqttServer = `mqtt://${myIPv4Address}`; // Gán địa chỉ IPv4 cho MQTT server
const ledTopic = 'led'; // Chủ đề MQTT cho đèn LED
const fanTopic = 'fan'; // Chủ đề MQTT cho quạt

// Kết nối MQTT broker
const client = mqtt.connect(mqttServer);
app.use(cors());
app.use(express.json());

// Middleware để xử lý lỗi MQTT
client.on('error', (error) => {
  console.error('MQTT error:', error);
});
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
// Xử lý bật/tắt đèn
app.post('/api/light', (req, res) => {
  const { isLightOn } = req.body;

  const action = isLightOn ? 'ON' : 'OFF';

  // Gửi lệnh đến MQTT broker để bật/tắt đèn
  client.publish(ledTopic, action, (err) => {
    if (err) {
      return res.status(500).json({ error: 'MQTT Publish Error' });
    }
    const currentTime = new Date();
    const query = 'INSERT INTO history_action (action, device, time) VALUES (?, ?, ?)';
    db.query(query, [action, 'LIGHT',currentTime ], (error, results) => {
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
app.post('/api/fan', (req, res) => {
  const { isFanOn } = req.body;

  const action = isFanOn ? 'ON' : 'OFF';

  // Gửi lệnh đến MQTT broker để bật/tắt quạt
  client.publish(fanTopic, action, (err) => {
    if (err) {
      return res.status(500).json({ error: 'MQTT Publish Error' });
    }
    const currentTime = new Date();
    const query = 'INSERT INTO history_action (action, device, time) VALUES (?, ?, ?)';
    db.query(query, [action, 'FAN',currentTime ], (error, results) => {
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

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
