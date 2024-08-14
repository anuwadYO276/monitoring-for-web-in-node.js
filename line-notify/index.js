const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const LINE_NOTIFY_TOKEN = '0Aj3ZEooen028jEJ9v7xOTQ69Y2ltAHs5Ex6EgtmPPa';
const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify';

app.post('/notify', async (req, res) => {
    try {
        const alerts = req.body.alerts.map(alert => `ระบบ: ${alert.labels.instance}\n\nข้อผิดพลาด: ${alert.labels.alertname}\n\nรายละเอียด: ${alert.annotations.description}`).join('\n\n');
        
        await axios.post(LINE_NOTIFY_URL, new URLSearchParams({
            message: `\n\n${alerts}\n\n`
        }), {
            headers: {
                'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send('Error sending notification');
    }
});

app.listen(3000, () => {
    console.log('Webhook server is running on port 3000');
});
