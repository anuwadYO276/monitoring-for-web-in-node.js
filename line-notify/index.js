const express = require('express');
const app = express();
const axios = require('axios');

app.post('/', (req, res) => {
  axios.get('http://localhost:9093/api/v1/alerts')
    .then(function (response) {
      //กำหนดให้ส่งข้อมูลไปตามจำนวน array ที่ได้จาก pesponse
      for (let i = 0; i < response.data.data.length; i++) {
        //กำหนดข้อมูลที่จะส่งไป
        const data = response.data.data[i].annotations.summary;
        axios.get('http://areadiv.com/demo9/send.php?pram=' + data).then(response => {
          console.log(data);
        }).catch(error => {
          console.log('Send data to line failed'+i);
        });

      }
    })
});


app.listen(8082, () => {
  console.log(`Server is listening at http://localhost:8082`);
});
