const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // MySQL 사용자명
    password: '123456', // MySQL 비밀번호
    database: 'sensorDB'
});

db.connect((err) => {
    if (err) {
        console.error('Failed to connect to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Express 설정
const app = express();
const port = 3002;

app.use(bodyParser.json()); // JSON 형식의 요청 본문을 처리

// 데이터 수신 API
app.post('/sensor-data', (req, res) => {
    const data = req.body;

    // SQL 쿼리로 데이터 삽입
    const query = 'INSERT INTO sensor_data (accelerationX, accelerationY, accelerationZ, alpha, beta, gamma) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [data.accelerationX, data.accelerationY, data.accelerationZ, data.alpha, data.beta, data.gamma];

    db.execute(query, values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to save data' });
        }
        res.status(200).send(results);
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
