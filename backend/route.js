const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/spotify', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('users', userSchema);

app.use(express.json());
app.use(cors());

app.post("/signUp", async function (req, res) {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" , success:true});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to register user" ,success:false});
    }
});


app.post('/login', async (req, res) => {
    try {
      const session = req.session;
      const { e, p } = req.body;
  
      console.log('Before finding user');
      const user = await User.findOne({ email: e, password: p });
      console.log('After finding user');
  
      if (user) {
        req.session.loguser = e;
        res.json({ msg: 'Login successful', uname: session.loguser });
      } else {
        res.status(401).json({ msg: 'Invalid email or password', uname: session.loguser });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ msg: 'Error during login' });
    }
  });
  app.get('/lout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
  })
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});


