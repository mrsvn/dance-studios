const path = require('path');
const express = require('express');

const cookieParser = require('cookie-parser');

const crypto = require('crypto');
const bcrypt = require('bcrypt');
// const uuid4 = require('uuid/v4');

const MongoClient = require('mongodb').MongoClient

const app = express();

let db;

// app.get('/', (req, res) => {
//     res.send('Hello, world!');
// });

app.use(express.json());
app.use(cookieParser());

app.post('/login', (req, res) => {
    const email = req.body.email, password = req.body.password;

    setTimeout(() => {
      console.log("Login attempt from\x1b[1m", req.connection.remoteAddress + "\x1b[0m:", email);

      // res.status(403).send(JSON.stringify({ status: 'THROTTLED' }));

      db.collection('users').findOne({ email }).then(userDoc => {
        if(!userDoc || !bcrypt.compareSync(password, userDoc.pwdHash)) {
          return res.status(400).send(JSON.stringify({ status: 'INVALID_CREDENTIALS' }));
        }

        crypto.randomBytes(48, (err, buf) => {
          if(err) throw err;

          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);

          const authToken = buf.toString('hex');

          db.collection('users').updateOne(
            { _id: userDoc._id },
            { $push: { authTokens: { value: authToken, expiresAt } } }
          );

          res.status(200).cookie('email', userDoc.email).cookie('authToken', authToken).send(JSON.stringify({
            status: 'OK',
            token: authToken,
            displayName: userDoc.displayName,
            userpic: userDoc.userpic
          }));
        });
      }).catch(err => {
        console.log("Ept", err);
      });
    }, 1000);
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  console.log(`Registration request for \x1b[1m${email}\x1b[0m`);

  let errors = [];

  if(!email.match(/[^@]+@[^@]+/)) {
    errors.push('BAD_EMAIL');
  }

  if(!password) {
    errors.push('NO_PASSWORD');
  }

  if(errors.length) {
    console.log("Invalid data");

    res.status(400).send(JSON.stringify({
      status: "DATA_INVALID",
      errors
    }));

    return;
  }

  db.collection('users').find({ email }).limit(1).count().then(result => {
    if(result) {
      res.status(400).send(JSON.stringify({
        status: "EMAIL_TAKEN"
      }));
    }
    else {
      bcrypt.hash(password, 10).then(pwdHash => {
        const userDoc = {
          email: email,
          pwdHash: pwdHash,
          firstName: email,
          lastName: "",
          gender: "female",
          birthDate: "1970-01-01",
          city: "los-angeles",
          userpic: null,
          isAdmin: false
        };

        db.collection('users').insertOne(userDoc);

        res.status(200).send(JSON.stringify({
          status: 'OK',
          displayName: email,
          userpic: null
        }));
      });
    }
  })
});

app.get('/dashboard', (req, res) => {
  const { authToken, email } = req.cookies;

  const clearAuthCookies = () => {
    res.clearCookie('email');
    res.clearCookie('authToken');
  };

  if(!email || !authToken) {
    clearAuthCookies();
    res.end(`Unauthorized.`);
  }
  else {
    let resBody = `<p>E-mail: <strong>${email}</strong>\n<p>Token: <strong>${authToken}</strong>\n`;

    db.collection('users').findOne({ email: email }).then(userDoc => {
      // TODO: clean invalid and expired tokens up

      let tokenDoc = null;

      userDoc.authTokens.forEach(tDoc => {
        console.log(tDoc);

        if(tDoc.value === authToken) {
          tokenDoc = tDoc;
          return false;
        }
      });

      if(!tokenDoc) {
        clearAuthCookies();
        resBody += `<p>Unknown token`;
      }
      else if(tokenDoc.expiresAt < new Date()) {
        clearAuthCookies();
        resBody += `<p>Expired token`;
      }
      else {
        delete userDoc.authTokens;

        res.write(`<p>Here's you:<pre>${JSON.stringify(userDoc, null, 4)}</pre>`);
      }

      res.write(resBody);
    }).catch(err => console.log(err));
  }
});

app.get('/v1/profile', (req, res) => {
  const email = req.cookies.email;
  const authToken = req.cookies.authToken;

  db.collection('users').findOne({ email: email }).then(userDoc => {
    let isAuthorized = false;

    userDoc.authTokens.forEach(token => {
      if(token.value === authToken) {
        isAuthorized = true;
      }
    });

    if(isAuthorized) {
      res.send(Object.assign({}, userDoc, { authTokens: undefined } ));
    }
    else {
      res.status(403).send({ error: 'UNAUTHORIZED' });
    }
  });
});

app.get('/studios', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/v1/studios/:region', (req, res) => {
  const region = req.params.region;

  db.collection('studios').find({ region: region }).toArray().then(data => {
    res.status(200).send(JSON.stringify({
      numTotal: Object.keys(data).length,
      studios: data
    }));
  });
});

app.use('/', express.static(path.join(__dirname, '..')));

MongoClient.connect('mongodb://localhost:27017/dancer', { useNewUrlParser: true }, (err, client) => {
    if(err) {
        throw err;
    }

    db = client.db('dancer');

    const port = 3000;

    app.listen(port, () => console.log(`Listening on port \x1b[1m${port}\x1b[0m.`));
});
