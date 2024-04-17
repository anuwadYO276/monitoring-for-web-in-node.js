const http = require("http");
const url = require("url");
const client = require("prom-client");

const register = new client.Registry();

register.setDefaultLabels({
  app: "example-nodejs-app",
});

client.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});

register.registerMetric(httpRequestDurationMicroseconds);

const createOrderHandler = async (req, res) => {
  try {
    if (req.url === '/user') {
      console.log("User data retrieved successfully");
      res.end("User data retrieved successfully");
    } else if (req.url === '/post') {
      console.log("post data retrieved successfully");
      res.end("Post data retrieved successfully");
    } else if (req.url === '/memo') {
      console.log("memo data retrieved successfully");
      res.end("Memo data retrieved successfully");
    } else {
      console.log("error data retrieved successfully");
      res.writeHead(404).end("Not Found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.writeHead(500).end("Internal Server Error");
  }
};

const server = http.createServer(async (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = url.parse(req.url).pathname;

  try {
    if (route === "/metrics") {
      res.setHeader("Content-Type", register.contentType);
      res.end(register.metrics());
    } else {
      await createOrderHandler(req, res);
    }
  } catch (error) {
    res.writeHead(500).end();
  }

  // console.log('data = ' +'code = '+ route +'status = '+ res.statusCode+ ' method = '+ req.method);
  end({ route, code: res.statusCode, method: req.method });
});

server.listen(8080, () => {
  const data = 'Port 8080 is up on 10.1.29.12:8080';
  axios.get('http://areadiv.com/demo9/send.php?pram=' + data).then(response => {
    console.log('Send data to line success');
  });
  console.log(
    "Grafana is running on http://localhost:3000, Server is running on http://localhost:8080, metrics are exposed on http://localhost:8080/metrics"
  );
});
