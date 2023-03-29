const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
var cors = require('cors')

app.use(cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS"); // update to match the domain you will make the request from
  express.json();
  next();
});



const checkAuth = require('./Middleware');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');



const serviceAccount = require('../cours-api-test-firebase-adminsdk-rwavm-04e95c1b74.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.get('/',checkAuth, (req, res) => {
res.send("HELLO WORLD");
});

app.get('/login',(req,res) => {
    const data = req.body;
    const jwtKey = process.env.JWT_KEY || 'secret';
    const token = jwt.sign(
    {email: req.body.email, id: req.body.id},
    jwtKey,
    {expiresIn:'1h'}
);
    res.send(token);
});

app.post('/api/posts/set',checkAuth, async (req, res) => {
  console.log(req.body)
res.send(`${req.body.Task} , ${req.body.key}`);
const docRef = db.collection('Tasks').doc(req.body.Task);

await docRef.set({
  Task: req.body.Task,
  key : req.body.key,
});
});

app.get('/api/posts/get', checkAuth, async (req, res) => {
  const taskRef = db.collection('Tasks');
  const snapshot = await taskRef.get();
  
    const taskIds = [];
    snapshot.forEach(doc => {
      taskIds.push(doc.id);
    });

    res.send(taskIds);
});

app.delete('/api/deletetask',checkAuth,async(req,res) => {
  
}

)

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));