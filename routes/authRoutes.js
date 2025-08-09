const express = require("express");
const router = express.Router();

const User = require("../models/User");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("signup");

});

router.post("/signup", async (req, res) => {
  try {
    // If farmerType is an empty string, remove it so Mongoose doesn't validate it
    if (req.body.farmerType === "") {
      delete req.body.farmerType;
    }

    const user = new User(req.body);

    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("Email already exists.");
    }

    await User.register(user, req.body.password, (err) => {
      if (err) {
        throw err;
      }
      res.redirect("/login");
    });
  } catch (error) {
    res.status(400).send("Sorry, you were unable to signup.");
  }
});


//Login Route
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
    req.session.user = req.user;
    if(req.user.role == 'farmer'){
      res.send("This is the farmers dash board")
    }else if(req.user.role == 'salesRep'){
      res.send("This is the Sale Rep dash board")
    }else if(req.user.role == 'brooderManager'){
      
      res.render("managerDash");
    }else{
      res.send('You do not have a role in the System')
    }
  }
);


//logout route

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((error)=>{
            if(error){
                return res.status(500).send('Error Logging Out')
            }
            res.redirect('/')
        })
    } else {
        res.send("You do not have a role in the system")
    }
});

router.get('/login', passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
    req.session.user = req.user; //means that when someone logs in, a session is assigned to them 
    if (req.user.role == 'farmer') {
        res.send("This is the farmers dashboard")

    } else if (req.user.role == 'brooderManager') {
        res.redirect("/managerDashboard");

    } if (req.user.role == 'salesRep') {
        res.send("This is the Sales Rep's dashboard")
    } else {
        res.send("You do not have a role in the system")
    }
});





module.exports = router;    