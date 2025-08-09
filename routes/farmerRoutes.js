const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureManager} = require("../middleware/authMiddleware"); //we import the people we need to utilize particular route (do not protect routes while still developing )

const addFarmers = require("../models/farmersModel");
const User = require("../models/User");

router.get('/addfarmer', (req, res)=>{
    res.render('register');
});


//add a post route 
router.post('/addfarmer', (req, res)=>{
    console.log(req.body);
    const newFarmer = new addFarmers(req.body);
    newFarmer.save();
});

//code for protection: ensureAuthenticated, ensureManager,(it is just after async)

//get list of users in the database 
router.get('/userlist',  async(req, res)=>{
   try{
        let users = await User.find().sort({$natural:-1}); //limit()//this limits the number of people being picked from the database 
        // let managers = await User.find({role:'brooderManager'}).sort({$natural:-1}) // this line basically returns only a particular group of users .. and not all users in this case (brooder manager)
        res.render('userTable', {users})     //rendering the pug file
   }catch(error){
        res.status(400).send('unable to retreive users from the database')
   }
});

//updating user
router.get('/updateuser/:id', async(req, res)=>{
    try{
        const updateUser = await User.findOne({_id: req.params.id})     //this is the user we are picking from the db
        res.render("update-user", {user: updateUser});    //we cann now just call updateUser "user".. in the pug file 
    }
    catch (error){
        res.status(400).send("unable to find item in the db")
        console.log(error);
    }
});

//a post route for updaing users
router.post('/updateuser', async(req, res)=>{
    try{
        await User.findByIdAndUpdate({_id:req.query.id}, req.body);
        res.redirect("/userlist");
    } catch(error){
        res.status(400).send("update failure")
        console.log(error.message)
    }
});

//Implement delete
router.post("/deleteuser", async(req,res)=>{
    try{
        await User.deleteOne({_id:req.body.id})
        res.redirect('/userlist');
    }catch (error){
        res.status(400).send("update failure");
        console.log(error.message);
    }
})

module.exports = router;