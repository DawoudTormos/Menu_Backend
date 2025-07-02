const http = require('http');
const app = require('./src/app');// HTTP Server


const server = http.createServer(app);

server.keepAliveTimeout = 400000; // 600 seconds
server.headersTimeout = 405000; // Must be > keepAliveTimeout


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}\nhttp://localhost:${PORT}`)
}
);