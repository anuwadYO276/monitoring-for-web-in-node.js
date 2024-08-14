const express = require('express');
const app = express();
const axios = require('axios');
const port = 1103;

app.post('/', (req, res) => {
  // axios.get('http://localhost:9093/api/v1/alerts')
  //   .then(function (response) {
  //     console.log(response.data);
  //     res.send(response.data);

  //   })

  res.send('Hello World!');

});


app.listen(port, () => {
  console.log('Server is listening at http://localhost:' + port);
});
