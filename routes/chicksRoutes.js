const express = require('express');
const router = express.Router();

// const chickStock = require('../models/ChicksModel');
const chickStock = require('../models/chicksModel')
const User = require('../models/User')
const addStock = require('../models/chickStock');
const { ensureAuthenticated, ensureFarmer } = require('../middleware/authMiddleware');
// const { ensureAuthenticated, ensureManager } = require('../middleware/authMiddleware');
// const { ensureAuthenticated, ensureSalesRep } = require('../middleware/authMiddleware');
const chickRequest = require('../models/chickRequest');
// const chickStock = require('../models/chickStock');


router.get('/addChicks', (req, res) => {
  res.render('chicks')
})
// A post route to send data to the database 


router.post('/addChicks', async (req, res) => {
  try {
    console.log(req.body);
    const newStock = new chickStock(req.body);
    await newStock.save();
  }
  catch (error) {
    console.error(error);
    res.status(400).render('chicks'); //you can either send a message or re-render the page .. 
  }

});


//stock route

router.get('/stock', (req, res) => {
  res.render('addStock')
})
// A post route to send data to the database 


router.post('/stock', async (req, res) => {
  try {
    console.log(req.body);
    const newStock = new chickStock(req.body);
    await newStock.save();
  }
  catch (error) {
    console.error(error)
    res.status(400).render('addStock') //you can either send a message or re-render the page .. 
  }

})

//getting stock from db 
router.get('/chickStock', async (req, res) => {
  try {
    let chickStock = await addStock.find().sort({ $natural: -1 }); //limit()//this limits the number of people being picked from the database 
    // let managers = await User.find({role:'brooderManager'}).sort({$natural:-1}) // this line basically returns only a particular group of users .. and not all users in this case (brooder manager)
    res.render('chickStockList', { chickStock })    //rendering the pug file
  } catch (error) {
    res.status(400).send('unable to retreive users from the database')
  }
});


// GET route - show chick request form with farmer type modal
router.get('/chickRequest', ensureAuthenticated, ensureFarmer, async (req, res) => {
  try {
    const requests = await chickRequest.find({ user: req.session.user._id });
    const farmerType = requests.length === 0 ? "starter" : "returning";
    const maxChicks = farmerType === "starter" ? 100 : 500;

    // Show modal only once per session
    let showFarmerModal = false;
    if (!req.session.farmerModalShown) {
      req.session.farmerModalShown = true;
      showFarmerModal = true;
    }

    res.render('chicks', { farmerType, maxChicks, showFarmerModal });
  } catch (error) {
    console.error(error);
    res.redirect('/farmerDashboard');
  }
});

//POST route - send data to the DB
router.post('/chickRequest', ensureAuthenticated, ensureFarmer, async (req, res) => {
  try {
    const userId = req.session.user._id;

    // Check if user has made requests before
    const lastRequest = await chickRequest.findOne({ user: userId }).sort({ requestDate: -1 });
    const farmerType = lastRequest ? "returning" : "starter";
    const maxAllowed = farmerType === "starter" ? 100 : 500;

    // 4-month rule: If there is a last request, ensure it's at least 4 months ago
    if (lastRequest) {
      const fourMonthsAgo = new Date();
      fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

      if (lastRequest.requestDate > fourMonthsAgo) {
        // Calculate next eligible date
        const nextEligibleDate = new Date(lastRequest.requestDate);
        nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 4);

        return res.status(400).render('chicks', {
          farmerType,
          maxChicks: maxAllowed,
          status: 'error',
          reason: 'tooSoon',
          nextEligibleDate: nextEligibleDate.toDateString()
        });
      }
    }


    // Validate quantity against max allowed
    if (req.body.quantity > maxAllowed) {
      return res.status(400).render('chicks', {
        farmerType,
        maxChicks: maxAllowed,
        status: 'error',
        reason: 'limit'
      });
    }

    const newRequest = new chickRequest({
      user: userId,
      quantity: req.body.quantity,
      chickType: req.body.chickType,
      breed: req.body.breed,
      requestDate: req.body.requestDate || new Date(), // default to now if not sent
      farmerType,
      notes: req.body.notes
    });

    await newRequest.save();

    return res.render('chicks', {
      farmerType,
      maxChicks: maxAllowed,
      status: 'success'
    });

  } catch (error) {
    console.error(error);
    return res.status(400).render('chicks', {
      status: 'error',
      reason: 'other'
    });
  }
});






module.exports = router;
