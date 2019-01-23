const path = require('path');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use(express.urlencoded({extended: false}));

app.post('/login', (req, res) => {
    const email = req.body.email, pass = req.body.password;

    console.log("Login attempt from\x1b[1m", req.connection.remoteAddress + "\x1b[0m:", email);

    if(email === "drankov") {
        res.status(403).send('{ "status": "THROTTLED" }');
    }
    else if(email === "hello@world.ru" && pass === "123") {
        res.status(200).send(JSON.stringify({
            status: 'OK',
            token: "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
            username: "HelloWorld"
        }));
    }
    else {
        res.status(400).send('{ "status": "INVALID_CREDENTIALS" }');
    }
});

const port = 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
