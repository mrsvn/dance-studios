const path = require('path');
const express = require('express');

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const crypto = require('crypto');
const bcrypt = require('bcrypt');
// const uuid4 = require('uuid/v4');

const mongodb = require('mongodb');
let db;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

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

app.post('/v1/profile', (req, res) => {
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
      const userUpdate = Object.assign({}, req.body, { isAdmin: undefined, _id: undefined });

      delete userUpdate['isAdmin'];
      delete userUpdate['_id'];

      db.collection('users').updateOne({ email: email }, { $set: userUpdate }).then(result => {
        if(result) {
          res.send({ status: 'OK' });
        }
        else {
          res.status(500).send({ status: 'ERROR' });
        }
      });
    }
    else {
      res.status(403).send({ error: 'UNAUTHORIZED' });
    }
  });
});

app.get('/v1/admin/users', (req, res) => {
  const email = req.cookies.email;
  const authToken = req.cookies.authToken;

  db.collection('users').findOne({ email: email }).then(user => {
    if(!user && !user.isAdmin) {
      res.status(403).send({ status: 'UNAUTHORIZED' });
      return;
    }

    let isAuthorized = false;

    user.authTokens.forEach(token => {
      if(token.value === authToken) {
        isAuthorized = true;
      }
    });

    if(!isAuthorized) {
      res.status(403).send({ status: 'UNAUTHORIZED' });
      return;
    }

    db.collection('users').find({}).toArray((err, users) => {
      if(err) {
        console.log(err);
        return;
      }

      res.send({
        status: 'OK',
        users: users
      });
    })
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/studios', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/classes', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/studios/:urlBit', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/profile/*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/edit-studio', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/v1/studios/:city', (req, res) => {
  const city = req.params.city;

  db.collection('studios').find({ city: city }).toArray().then(data => {
    res.status(200).send(JSON.stringify({
      numTotal: Object.keys(data).length,
      studios: data
    }));
  });
});

app.get('/v1/studio/:urlBit', (req, res) => {
  db.collection('studios').findOne({ urlBit: req.params.urlBit }).then(studio => {
    if(studio) {
      res.send({
        status: 'OK',
        studio: studio
      });
    }
    else {
      res.status(404).send({
        status: 'NOT_FOUND'
      });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).send();
  });
});

app.post('/v1/studio/:urlBit', (req, res) => {
  const email = req.cookies.email;
  const authToken = req.cookies.authToken;

  db.collection('studios').findOne({ urlBit: req.params.urlBit }).then(studio => {
    if(!studio) {
      res.status(404).send({
        status: 'NOT_FOUND'
      });
      return;
    }

    if(email != studio.managerEmail) {
      res.status(403).send({ status: 'UNAUTHORIZED' });
      return;
    }

    db.collection('users').findOne({ email: email }).then(user => {
      if(!user && !user.isAdmin) {
        res.status(403).send({ status: 'UNAUTHORIZED' });
        return;
      }

      let isAuthorized = false;

      user.authTokens.forEach(token => {
        if(token.value === authToken) {
          isAuthorized = true;
        }
      });

      if(!isAuthorized) {
        res.status(403).send({ status: 'UNAUTHORIZED' });
        return;
      }

      delete req.body._id;

      db.collection('studios').updateOne({ urlBit: studio.urlBit }, { $set: req.body }).then(result => {
        if(!result) {
          res.status(500).send({ status: 'ERROR' });
        }
        else {
          res.send({ status: 'OK' });
        }
      })
    });
  }).catch(error => {
    console.log(error);
    res.status(500).send();
  });
});

// Вернуть все занятия для данной студии
app.get('/v1/studio/:urlBit/classes', (req, res) => {
  console.log(`GET ${req.path}`);

  db.collection('studios').findOne({ urlBit: req.params.urlBit }).then(studio => {
    db.collection('classes').find({ studioId: studio._id }).toArray((err, classes) => {
      if(err) {
        res.status(500).send({ status: 'ERROR' });
        console.log("Ne udalos");
        return;
      }

      res.send({
        status: 'OK',
        classes: classes
      });
    });
  });
});

// Добавить новое занятие
app.post('/v1/studio/:urlBit/classes', (req, res) => {
  db.collection('studios').findOne({ urlBit: req.params.urlBit }).then(studio => {
    if(!studio) {
      res.status(500).send({ status: 'NO_STUDIO' });
      return
    }

    db.collection('classes').insertOne({
      studioId: studio._id,
      title: req.body.title,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      tags: req.body.tags,
      tainer: req.body.trainer,
      capacity: req.body.capacity,
      enrolledUsers: []
    }).then(result => {
      if(result) {
        res.send({
          status: 'OK'
        });
      }
      else {
        res.send({
          status: 'ERROR'
        });
      }
    });
  });
});

app.delete('/v1/studio/:urlBit/classes/:classId', (req, res) => {
  // Удалить занятие
});

app.put('/v1/studio/:urlBit/classes/:classId', (req, res) => {
  // Заменить (отредактировать) занятие
});

// Получить список занятий, на которые записан (данный) пользователь
app.get('/v1/enrollments', (req, res) => {
  console.log(`GET ${req.path}:`, req.body);

  const email = req.cookies.email;
  const authToken = req.cookies.authToken;

  db.collection('users').findOne({ email: email }).then(user => {
    let isAuthorized = false;

    user.authTokens.forEach(token => {
      if(token.value === authToken) {
        isAuthorized = true;
      }
    });

    if(!isAuthorized) {
      res.status(403).send({ status: 'UNAUTHORIZED' });
      return;
    }

    db.collection('classes').find().toArray((_, classes) => {
      const usersClasses = classes.filter(classInfo => {
        return classInfo.enrolledUsers.some(userId => userId.equals(user._id));
      });

      res.send({
        status: 'OK',
        classes: usersClasses
      });
    });
  });
});

// Записаться на новое занятие (от лица пользователя)
app.post('/v1/enrollments', (req, res) => {
  console.log(`POST ${req.path}:`, req.body);

  const email = req.cookies.email;
  const authToken = req.cookies.authToken;

  db.collection('users').findOne({ email: email }).then(user => {
    let isAuthorized = false;

    user.authTokens.forEach(token => {
      if(token.value === authToken) {
        isAuthorized = true;
      }
    });

    if(!isAuthorized) {
      res.status(403).send({ status: 'UNAUTHORIZED' });
      return;
    }

    const classId = req.body.classId;

    db.collection('classes').updateOne({ _id: mongodb.ObjectId(classId) }, { $addToSet: { enrolledUsers: user._id } }).then(result => {
      console.log(result.result);

      if(result) {
        res.send({ status: "OK" });
      }
      else {
        res.send({ status: "ERROR" });
      }
    });
  });
});

app.delete('/v1/enrollments/:classId', (req, res) => {
  // Отписаться от занятия
})

app.post('/upload-images', (req, res) => {
  Object.keys(req.files).forEach(filename => {
    req.files[filename].mv(path.join(__dirname, 'files1488', filename));
  });

  setTimeout(() => {
    res.send("OK");
  }, 500);
});

app.use('/', express.static(path.join(__dirname, '..')));

mongodb.MongoClient.connect('mongodb://localhost:27017/dancer', { useNewUrlParser: true }, (err, client) => {
    if(err) {
        throw err;
    }

    db = client.db('dancer');

    const port = 3000;

    app.listen(port, () => console.log(`Listening on port \x1b[1m${port}\x1b[0m.`));
});
