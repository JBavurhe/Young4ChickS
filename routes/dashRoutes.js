const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const { ensureAuthenticated, ensureManager } = require('../middleware/authMiddleware');
// const chickStock = require('../models/ChicksModel');
// const addStock = require('../models/chickStockModel');


// route for returning manager dashboard
router.get('/managerDashboard', async (req, res) => {
  try {
    const pendingRequests = await chickStock.countDocuments({ status: 'pending' });
    const dispatchedRequests = await chickStock.countDocuments({ status: 'dispatched' });
    const approvedRequests = await chickStock.countDocuments({ status: 'approved' });
    const totalNumOfFarmers = await User.countDocuments({ role: 'farmer' });

    const users = await User.find();
    const farmers = await User.find({ role: 'farmer' });
    const allStock = await addStock.find();

    const requests = await chickStock
      .find()
      .populate('user', 'fullname')
      .sort({ createdAt: -1 })
      .limit(5);

    const chickSales = await chickStock.aggregate([
      { $match: { status: { $in: ['approved', 'dispatched'] } } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
          totalChickSales: { $sum: { $multiply: ['$quantity', 1650] } }
        }
      }
    ]);
    const chickSalesSummary = chickSales[0] || { totalQuantity: 0, totalChickSales: 0 };

    res.render('managerDash', {
      users,
      farmers,
      chickStock: allStock,
      requests,
      chickSales: chickSalesSummary,
      pendingRequests,
      dispatchedRequests,
      approvedRequests,
      totalNumOfFarmers
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});


module.exports = router;   