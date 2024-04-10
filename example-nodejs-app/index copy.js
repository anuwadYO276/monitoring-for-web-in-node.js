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

// const createOrderHandler = async (req, res) => {
//   // return an error 1% of the time
//   if (Math.floor(Math.random() * 100) === 0) {
//     throw new Error("Internal Error");
//   }

//   // delay for 3-6 seconds
//   const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3;
//   await new Promise((res) => setTimeout(res, delaySeconds * 1000));

//   res.end("Order created successfully");
// };

const createOrderHandler = async (req, res) => {
  try {
    // ตรวจสอบ path ของ request เพื่อตรวจสอบว่ามาจากเส้น API ที่เราต้องการหรือไม่
    if (req.url === '/user') {
      // ดำเนินการสำหรับเส้น API '/user'
      console.log("User data retrieved successfully");
      res.end("User data retrieved successfully");
    } else if (req.url === '/post') {
      // ดำเนินการสำหรับเส้น API '/post'
      res.end("Post data retrieved successfully");
    } else if (req.url === '/memo') {
      // ดำเนินการสำหรับเส้น API '/memo'
      res.end("Memo data retrieved successfully");
    } else {
      // ถ้าไม่ตรงกับเส้น API ใดๆ ที่เราต้องการจัดการ
      res.writeHead(404).end("Not Found");
    }
  } catch (error) {
    // จัดการข้อผิดพลาดเมื่อเกิดข้อผิดพลาดในการประมวลผลข้อมูล
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
    }

    if (route === "/order") {
      await createOrderHandler(req, res);
    }
  } catch (error) {
    res.writeHead(500).end();
  }

  if (!res.finished) {
    res.writeHead(404).end(); // Default 404 handler
  }

  end({ route, code: res.statusCode, method: req.method });
});

server.listen(8080, () => {
  console.log(
    "Grafana is running on http://localhost:3000, Server is running on http://localhost:8080, metrics are exposed on http://localhost:8080/metrics"
  );
});
