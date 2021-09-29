
const express = require('express');
const userSchema = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// express app
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/',(req, res)=>{
    res.json("/api/signup  /api/login");
});

//connect to database and listen for port:3000
const dbURL = "mongodb+srv://user-nodejs:wkWNRniNYieHzEfO@cluster0.9xecd.mongodb.net/twitter?retryWrites=true&w=majority";
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(3000))
    .catch(err => console.log(err));

// handle errors
const handleErrors = (err) =>{
    //console.log(err.message, err.code);
    let errors = {email:'', password:''};

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'User does not exist';
      }
    
    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'incorrect password';
    }
    // validation code
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
    }
    // duplicate email handle
    if(err.code === 11000){
        errors.email = "Email already esist"
    }
    return errors;
}

// signup validation
app.post('/api/signup', async (req, res) =>{
    const {name, email, password} = req.body;
    try{
        const user = await userSchema.create({name, email, password});
        res.status(201).json({message:"Signup successfull ",user});
    }
    catch(err){
        let errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

// login validation
app.post('/api/login', async (req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await userSchema.findOne({ email });
        if(user){
            const auth = await bcrypt.compare(password, user.password)
            if(auth){
                return res.status(400).json({message:"login successfull ",name:user.name, userid:user._id });
            }
            throw Error('incorrect password');
        }
        throw Error('incorrect email');
    }
    catch( err ){
        const errors = handleErrors( err )
        res.status(400).json( errors );
    }  
});
