const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Mongo DB Connected!'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World'));

// User Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server Running on port 127.0.0.1:${port}`));