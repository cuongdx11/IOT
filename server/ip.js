const ip = require('ip');

const myIPv4Address = ip.address('public', 'ipv4'); // Lấy địa chỉ IPv4 mạng

const mqttServer = `mqtt://${myIPv4Address}`; // Gán địa chỉ IPv4 cho MQTT server

console.log('Địa chỉ IPv4 của máy tính:', myIPv4Address);
console.log('Mqtt Server:', mqttServer);
