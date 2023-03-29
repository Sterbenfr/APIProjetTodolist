const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const checkAuth = require('./Middleware');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  next();
});

app.use(express.json());


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
    {email: "user.email", id: "user.id"},
    jwtKey,
    {expiresIn:'1h'}
);
    res.send(token);
});

app.post('/api/posts/set',checkAuth, async (req, res) => {
res.send(`${req.body.email} , ${req.body.id}`);
const docRef = db.collection('users').doc(req.body.id);

await docRef.set({
  email: req.body.email,
  id : req.body.id,
});
});

app.post('/api/posts/get',checkAuth, async (req, res) => {

    const snapshot = await db.collection('users').get(req.body.id);
    console.log(req.body.id, '=>', req.body.data());
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));