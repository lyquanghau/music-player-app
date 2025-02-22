const express = require('express');
const app = express();
const port = 8404;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server chạy trên http://localhost:${port}`);
});