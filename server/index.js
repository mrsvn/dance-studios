const path = require('path');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello, world!');
// });

app.use(express.urlencoded({extended: false}));

app.post('/login', (req, res) => {
    const email = req.body.email, pass = req.body.password;

    console.log("Login attempt from\x1b[1m", req.connection.remoteAddress + "\x1b[0m:", email);

    if(email === "drankov") {
        res.status(403).send('{ "status": "THROTTLED" }');
    }
    else if(email === "pdr@mail.ru" && pass === "123") {
        res.status(200).send(JSON.stringify({
            status: 'OK',
            token: "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
            username: "Pavel Drankov",
            userpic: "data:image/jpeg;base64,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"
        }));
    }
    else if(email === "bs@gmail.com" && pass === "456") {
        res.status(200).send(JSON.stringify({
            status: 'OK',
            token: "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
            username: "Bernie Sanders",
            userpic: "data:image/jpeg;base64,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"
        }));
    }
    else {
        res.status(400).send('{ "status": "INVALID_CREDENTIALS" }');
    }
});

app.post('/register', (req, res) => {
    const email = req.body.email,
          pass = req.body.password,
          passConf = req.body.passwordConfirm;

    let errors = [];

    if(!email.match(/[^@]+@[^@]+/)) {
        errors.push('BAD_EMAIL');
    }

    if(!pass) {
        errors.push('NO_PASSWORD');
    }
    else if(pass !== passConf) {
        errors.push('PASSWORDS_DONT_MATCH');
    }

    if(errors.length) {
        res.status(400).send(JSON.stringify({
            result: "DATA_INVALID",
            errors
        }));
    }
    else if(["pdr@mail.ru", "bs@gmail.com"].includes(email)) {
        res.status(400).send(JSON.stringify({
            result: "EMAIL_TAKEN"
        }));
    }
    else {
        res.status(200).send(JSON.stringify({
            result: 'OK'
        }));
    }
})

app.use('/', express.static(path.join(__dirname, '..')));

const port = 3000;

app.listen(port, () => console.log(`Listening on port \x1b[1m${port}\x1b[0m.`))
