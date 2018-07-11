const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(`${__dirname}/client/build`));
}

mongoose.connect('mongodb://admin:admin0@ds259620.mlab.com:59620/easynotes', {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
})
.then(() => {
  console.log("Successfully connected to the database");    
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, PATCH, DELETE, origin, content-type, accept, authorization');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.locals.session =  req.session;
  if (req.method === "OPTIONS") 
    res.sendStatus(200);
  else 
    next();
});

require('./server/userRoutes')(app);

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'wordhard',
  userProperty: 'payload',
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

const notes = require('./server/noteControllers');

app.post('/notes', auth, notes.create);
app.get('/notes', auth, notes.findAll);
app.get('/notes/:noteId', auth, notes.findOne);
app.put('/notes/:noteId', auth, notes.update);
app.delete('/notes/:noteId', auth, notes.delete);

app.listen(port, () => {
  console.log('Express app listening on port 8000');
});