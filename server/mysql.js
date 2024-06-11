const mysql = require('mysql2');
const dbConfig = require('./dbConfig');

// Tạo kết nối đến cơ sở dữ liệu
const connection = mysql.createConnection(dbConfig);

// Kết nối đến cơ sở dữ liệu
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Truy vấn dữ liệu nhiệt độ và độ ẩm
const query = 'SELECT temperature, humidity FROM sensor_data';

connection.query(query, (err, results, fields) => {
  if (err) {
    console.error('Error executing SELECT query:', err);
    return;
  }

  // Xử lý kết quả truy vấn
  results.forEach((row) => {
    console.log(`Temperature: ${row.temperature}°C, Humidity: ${row.humidity}%`);
  });
});

// Đóng kết nối MySQL sau khi hoàn thành công việc
connection.end((err) => {
  if (err) {
    console.error('Error closing MySQL connection:', err);
  }
  console.log('MySQL connection closed');
});
