// index.js

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;


// Middleware สำหรับการจัดการ request-body
app.use(express.json());

// Endpoint พื้นฐาน
app.get('/', (req, res) => {
  res.send('send message to line notify');
});

app.get('/notify', async (req, res) => {
  try {
    const response = await axios.get('http://10.1.29.17:9093/api/v1/alerts');
    const alerts = response.data.data;

    if (alerts.length === 0) {
      res.json({ status: 'success', data: [] });
      return;
    }

    const alert = alerts[0];
    const res_line = {
      instance: alert.labels.instance,
      alertname: alert.labels.alertname,
      severity: alert.labels.severity,
      summary: alert.annotations.summary,
      description: alert.annotations.description,
      startsAt: alert.startsAt,
      endsAt: alert.endsAt,
      status: alert.status.state
    };

    // Send message to LINE Notify
    const token = "0Aj3ZEooen028jEJ9v7xOTQ69Y2ltAHs5Ex6EgtmPPa";
    const message = '\n\n' +
      `ข้อผิดพลาด: ${res_line.summary}\n\n` +
      `รายละเอียด: ${res_line.description}\n\n` +
      `Instance: ${res_line.instance}\n` ;
    await axios.post('https://notify-api.line.me/api/notify', `message=${encodeURIComponent(message)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    res.json({ status: 'success', data: res_line });

  } catch (error) {
    console.error('Error message:', error.message);
    console.error('Error details:', error.response ? error.response.data : 'No response data');
    res.status(500).send('Error fetching data');
  }
});




// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
