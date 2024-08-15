const http = require("http");
const url = require("url");
const client = require("prom-client");
const axios = require('axios');
const register = new client.Registry();

// Default labels for Prometheus metrics
register.setDefaultLabels({
  app: "example-nodejs-app",
});

// Manually create and register default metrics
const collectDefaultMetrics = () => {
  const metrics = [
    new client.Gauge({
      name: 'nodejs_up',
      help: 'A gauge that will always be 1 (nodejs up)',
    }),
    new client.Counter({
      name: 'nodejs_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'code'],
    }),
  ];

  metrics.forEach(metric => register.registerMetric(metric));
};

collectDefaultMetrics();

// Histogram to track HTTP request duration
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});
register.registerMetric(httpRequestDurationMicroseconds);

// Request handler for different routes
const createOrderHandler = async (req, res) => {
  try {
    console.log(`Handling request for ${req.url}`);
    if (req.url === '/') {
      res.writeHead(200, {'Content-Type': 'text/plain'}).end("User data retrieved successfully");
    } else if (req.url === '/post') {
      res.writeHead(200, {'Content-Type': 'text/plain'}).end("Post data retrieved successfully");
    } else if (req.url === '/memo') {
      res.writeHead(200, {'Content-Type': 'text/plain'}).end("Memo data retrieved successfully");
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'}).end("Not Found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.writeHead(500, {'Content-Type': 'text/plain'}).end("Internal Server Error");
  }
};

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  const parsedUrl = url.parse(req.url);
  const route = parsedUrl.pathname;

  try {
    if (route === "/metrics") {
      res.setHeader("Content-Type", register.contentType);
      res.end(await register.metrics());
    } else {
      await createOrderHandler(req, res);
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.writeHead(500, {'Content-Type': 'text/plain'}).end("Internal Server Error");
  }

  end({ route, code: res.statusCode, method: req.method });
});

// Start the server
server.listen(3000, () => {
  console.log('Server listening on port 3000');

  // Send data to a remote server (ensure port and endpoint are correct)
  // const data = 'Port 3000 is up on 10.1.29.12:3000';
  // axios.get('http://areadiv.com/demo9/send.php?pram=' + encodeURIComponent(data))
  //   .then(response => {
  //     console.log('Send data to line success');
  //   })
  //   .catch(error => {
  //     console.error('Error sending data to line:', error);
  //   });
});
