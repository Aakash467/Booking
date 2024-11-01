const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const user = require('./models/user.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const bcrypt = require('bcryptjs');
const secret = bcrypt.genSaltSync(6);
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs')

const jwt = require('jsonwebtoken');

const jwtSecret = 'jaljdljlajljdpw';

require('dotenv').config()
const app = express();

app.use('/uploads', express.static(__dirname+'/uploads'))
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin:'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test',(req,res)=>{
    res.json('test ok');
});

function getUserData(req){
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) =>{
            if(err) throw err;
            resolve(userData);
        } );
    });
}

app.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;

    try{
        const userDoc = await user.create({
            name,
            email,
            password:bcrypt.hashSync(password,secret)
        });
    
        res.json(userDoc);
    }catch(e){
        res.status(400).json({message:e.message})
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const userDoc = await user.findOne({ email });
        
        if (userDoc) {
            const pass = bcrypt.compareSync(password, userDoc.password);
            
            if (pass) {
                jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                    if (err) {
                        return res.status(500).json({ error: 'Token generation failed' });
                    }
                    res.cookie('token', token, { httpOnly: true, secure: true }).json(userDoc); // Secure cookie settings
                });
            } else {
                res.status(401).json({ error: 'Incorrect password' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret,{}, async (err, userData) => {
            if(err) throw err;
            const {name,email,_id} = await user.findById(userData.id);
            res.json({name,email,_id});
        })
    }else{
        res.json(null);
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,        // Ensure this matches the settings used when the token was created
        sameSite: 'lax',      // Adjust sameSite based on your requirements
        expires: new Date(0)  // Expire the cookie immediately
    }).json({ success: true });
});

const isValidUrl = (url) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };
  
    app.post('/upload-by-link', async (req, res) => {
      const { link } = req.body;
  
      // Validate the URL
      if (!isValidUrl(link)) {
          return res.status(400).json({ error: 'Invalid URL. Please provide a valid HTTP or HTTPS link.' });
      }
  
      const name = 'photo' + Date.now() + '.jpg';
  
      try {
          await imageDownloader.image({
              url: link,
              dest: __dirname + '/uploads/' + name,
          });
  
          res.json(name);
      } catch (error) {
          console.error('Error downloading image:', error);
          res.status(500).json({ error: 'Failed to download image' });
      }
  });
  

const photoMiddleware = multer({dest:'uploads/'});
app.post('/uploads',photoMiddleware.array('photos',100) ,(req,res)=>{
    const uploadedFiles = []
    for(let i=0;i<req.files.length;i+=1){
        const {path,originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        const newpath = path + '.' + ext;
        fs.renameSync(path,newpath);
        uploadedFiles.push(newpath.replace('uploads/',''));
    }
    res.json(uploadedFiles);
})

app.post('/places',(req,res)=>{
    const {token} = req.cookies;
    const {title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
    
    jwt.verify(token, jwtSecret,{}, async (err, userData) => {
        if(err) throw err;
        const placeDoc = await Place.create({
            owner:userData.id,
            title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
        })   
        res.json(placeDoc)
    })
    
})

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    jwt.verify(token, jwtSecret, {}, async (err, userData) => { 
        if (err) throw err;
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    });
});

app.get('/places', async (req,res)=>{
    res.json(await Place.find());
})

app.get('/places/:id', async (req,res)=>{
    const {id} = req.params;
    res.json(await Place.findById(id));
})

app.put('/places', async (req,res)=>{
    const {token} = req.cookies;
    const {id,title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
    
    const placeDoc = await Place.findById(id)

    jwt.verify(token, jwtSecret, {}, async (err, userData) => { 
        if (err) throw err;
        const placeDoc = await Place.findById(id)

        if(userData.id === placeDoc.owner.toString()){
            placeDoc.set({
            title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
})

app.post('/booking',async (req, res) => {
    const userData = await getUserData(req);
    
    const { place, checkIn, checkOut, name, phone, nofGuest, price } = req.body;

    Booking.create({ place,user:userData.id, checkIn, checkOut, name, phone, nofGuest, price })
        .then((doc) => {
            res.json(doc);
        })
        .catch((err) => {
            console.error(err); // Log the error for debugging
            res.status(500).json({ error: 'An error occurred while creating the booking.' });
        });
});



app.get('/bookings', async (req,res)=>{
    const userData = await getUserData(req);
    res.json(await Booking.find({user:userData.id}).populate('place'))
});

app.listen(4000);