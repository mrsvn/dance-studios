const path = require('path');
const express = require('express');

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const uuid4 = require('uuid/v4');

const mongodb = require('mongodb');
let db;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

const checkAuth = fHasRights => {
  return (req, res, next) => {
    console.log(`${req.method} ${req.path} with ${fHasRights} auth`);

    const email = req.cookies.email;
    const authToken = req.cookies.authToken;

    if(!email || !authToken) {
      return res.status(401).send({ status: 'UNAUTHORIZED' });
    }

    db.collection('users').findOne({ email: email }).then(user => {
      if(!user || !(!fHasRights || fHasRights(user))) {
        res.status(401).send({ status: 'UNAUTHORIZED' });
      }
      else {
        let isAuthorized = false;

        user.authTokens.forEach(token => {
          if(token.value === authToken) {
            isAuthorized = true;
          }
        });

        if(!isAuthorized) {
          res.status(401).send({ status: 'UNAUTHORIZED' });
        }
        else {
          req.user = user;
          next();
        }
      }
    }).catch(console.error);
  };
};

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
          gender: "none",
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

app.get('/v1/userpics/:email', (req, res) => {
  db.collection('users').findOne({ email: req.params.email }).then(user => {
    if(!user) {
      res.status(404).send();
    }
    else if(!user.userpic) {
      // TODO: show the default one
    }
    else {
      res.sendFile(path.join(__dirname, "files1488", user.userpic));
    }
  });
});

app.use('/v1/profile', checkAuth());
app.get('/v1/profile', (req, res) => {
  const email = req.cookies.email;
  const authToken = req.cookies.authToken;

  db.collection('users').findOne({ email: email }).then(user => {
    let isAuthorized = false;

    user.authTokens.forEach(token => {
      if(token.value === authToken) {
        isAuthorized = true;
      }
    });

    if(isAuthorized) {
      const userRepr = Object.assign({}, user);

      delete userRepr._id;
      delete userRepr.pwdHash;
      delete userRepr.authTokens;
      delete userRepr.userpic;

      // TODO: convert to urlBit before sending?
      delete userRepr.managedStudio;

      res.send(userRepr);
    }
    else {
      res.status(403).send({ error: 'UNAUTHORIZED' });
    }
  });
});

app.post('/v1/profile', (req, res) => {
  console.log(`POST ${req.path}`, req.body);

  const userUpdate = {};

  userUpdate.firstName = req.body.firstName;
  userUpdate.lastName = req.body.lastName;

  if(req.body.gender && ['female', 'male', 'none'].includes(req.body.gender)) {
    userUpdate.gender = req.body.gender;
  }

  userUpdate.birthDate = req.body.birthDate;
  userUpdate.city = req.body.city;

  if(req.files && req.files.userpic) {
    const newUserpic = (file => {
      let filename;

      if(file.mimetype === "image/jpeg") {
        filename = uuid4() + ".jpg";
      }
      else if(file.mimetype === "image/png") {
        filename = uuid4() + ".png";
      }
      else if(file.mimetype === "image/gif") {
        filename = uuid4() + ".gif";
      }

      if(filename) {
        file.mv(path.join(__dirname, "files1488", filename));
      }

      return filename;
    })(req.files.userpic);

    if(newUserpic) {
      userUpdate.userpic = newUserpic;
    }
  }

  db.collection('users').updateOne({ email: req.user.email }, { $set: userUpdate }).then(result => {
    if(result) {
      res.send({ status: 'OK' });
    }
    else {
      res.status(500).send({ status: 'ERROR' });
    }
  });
});

app.use('/v1/users', checkAuth(user => user.isAdmin));
app.get('/v1/users', (req, res) => {
  db.collection('users').find({}).toArray((err, users) => {
    if(err) {
      return console.log(err);
    }

    res.send({
      status: 'OK',
      users: users
    });
  });
});

app.use('/v1/users/:id', checkAuth(user => user.isAdmin));
app.delete('/v1/users/:id', (req, res) => {
  db.collection('users').deleteOne({ _id: mongodb.ObjectId(req.params.id) }).then(nDeleted => {
    if(nDeleted) {
      res.send({ status: 'OK' });
    }
    else {
      res.send({ status: 'NO_OP' });
    }
  });
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
  console.log(`POST ${req.path}:`, req.body);

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
});

app.post('/upload-images', (req, res) => {
  Object.keys(req.files).forEach(filename => {
    req.files[filename].mv(path.join(__dirname, 'files1488', filename));
  });

  setTimeout(() => {
    res.send("OK");
  }, 500);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/studios*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/classes*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/profile*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/admin*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get('/edit-studio', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
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
