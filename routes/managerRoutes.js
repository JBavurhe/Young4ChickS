// const express = require('express');
// const router = express.Router();
// // const {ensureAuthenticated,ensureManager} = require('../middleware/authmiddleware');
// const ChicksStock = require('../models/ChickStockModel');
// const Order = require('../models/RequestsModel');
// const User = require('../models/User');
// // const FeedOrder = require('../models/FeedOrder');
// // const FeedStock = require('../models/feedStockModel');


// //Manager Dashbooard ensureAuthenticated, ensureManager,

// // Manager Dashboard Route
// router.get('/manager/dashboard', async (req, res) => {
//     try {
//         // Fetch all dashboard data
//         const pendingOrders = await Order.countDocuments({ status: 'pending' });
//         const approvedOrders = await Order.countDocuments({ status: 'approved' });
//         const dispatchedOrders = await Order.countDocuments({ status: 'dispatched' });
//         const canceledOrders = await Order.countDocuments({ status: 'canceled' });
//         const totalFarmers = await User.countDocuments({ role: 'customer' });

//         const stock = await ChicksStock.find();
//         const feedStock = await FeedStock.find();
//         const feedOrders = await FeedOrder.find().sort({ date: -1 }).limit(5).populate('user', 'name');
//         const recentRequests = await Order.find().sort({ dateRequest: -1 })
//             .limit(5)
//             .populate('user', 'name');

//         const chickSales = await Order.aggregate([
//             { $match: { status: { $in: ['dispatched', 'approved'] } } },
//             {
//                 $group: {
//                     _id: null,
//                     totalQuantity: { $sum: '$quantity' },
//                     totalChickSales: { $sum: { $multiply: ['$quantity', 1650] } }
//                 }
//             }
//         ]);

//         const feedSales = feedOrders.reduce((total, order) => total + order.amountPaid, 0);
//         const totalAmountDue = feedOrders.reduce((total, order) => total + order.amountDue, 0);
//         const totalRevenue = feedSales + (chickSales.length > 0 ? chickSales[0].totalChickSales : 0);

//         res.render('manager/dashboard', {
//             title: 'Manager Dashboard',
//             user: req.user,
//             currentPath: req.path,
//             pendingOrders,
//             approvedOrders,
//             dispatchedOrders,
//             canceledOrders,
//             totalFarmers,
//             recentRequests,
//             stock,
//             feedStock,
//             feedOrders,
//             totalRevenue,
//             totalAmountDue,
//             chickSales: chickSales[0] || { totalQuantity: 0, totalChickSales: 0 }
//         });

//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Server error');
//         res.redirect('/manager/dashboard');
//     }
// });



// //View chick requests ensureAuthenticated, ensureManager,
// router.get('/manager/requests', async (req, res) => {
//     try {
//         const requests = await Order.find().populate('user');
//         const approvedRequests = await Order.find({ status: 'approved' }).populate('user');
//         const dispatchedRequests = await Order.find({ status: 'dispatched' }).populate('user');
//         const canceledRequests = await Order.find({ status: 'canceled' }).populate('user');
//         const pendingRequests = await Order.find({ status: 'pending' }).populate('user');

//         requests.length > 0 ? requests : 0,
//             approvedRequests.length > 0 ? approvedRequests : 0,
//             dispatchedRequests.length > 0 ? dispatchedRequests : 0,
//             canceledRequests.length > 0 ? canceledRequests : 0,
//             pendingRequests.length > 0 ? pendingRequests : 0

//         res.render('manager/requests', { requests, approvedRequests, dispatchedRequests, canceledRequests, pendingRequests });
//     } catch (error) {
//         console.error(err.message);
//         req.flash('error', 'Failed to load requests');
//         res.redirect('/manager/requests');
//     }
// });


// //Get list of farmers in the database
// // View all farmers
// router.get('/farmerList', async (req, res) => {
//     try {
//         const farmers = await User.find({ role: 'farmer' }).sort({ $natural: -1 });
//         console.log(farmers[0]);
//         res.render('manager/farmers', { farmers });
//     } catch (err) {
//         console.error(err);
//         res.status(400).send('Unable to find farmers');
//     }
// });


// // Updating users(farmers)

// router.get('/updatefarmer/:id', async (req, res) => {
//     try {
//         const updateFarmer = await User.findOne({ _id: req.params.id })
//         res.render('manager/update-farmer', { farmer: updateFarmer });
//     } catch (err) {
//         console.error(err);
//         res.status(400).send('Unable to update farmer');
//     }
// });

// router.post('/updatefarmer', async (req, res) => {
//     try {
//         await User.findByIdAndUpdate({ _id: req.query.id }, req.body);
//         res.redirect('/farmerList');
//     } catch (error) {
//         res.status(400).send('Update failed');
//         console.log(error.message);
//     }
// });


// //Deleting Users (farmers)

// router.post('/deletefarmer', async (req, res) => {
//     try {
//         await User.deleteOne({ _id: req.body.id })
//         res.redirect('/farmerList')
//     } catch (error) {
//         res.status(400).send('Unable to delete farmer');
//     }
// })



// //Add New Stock ensureAuthenticated, ensureManager,

// router.get('/manager/add-stock', (req, res) => {
//     res.render('manager/stock');
// });

// router.post('/manager/add-stock', async (req, res) => {
//     try {
//         const newStock = new ChicksStock(req.body);
//         await newStock.save();
//         req.flash('success', 'Stock added successfully');
//         res.redirect('/manager/stock');
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'failed to add stock');
//         res.redirect('/manager/stock');
//     }
// });



// //Add feed stock

// router.get('/manager/add-feed', (req, res) => {
//     res.render('manager/stock');
// });

// router.post('/manager/add-feed', async (req, res) => {
//     try {
//         const newFeedStock = new FeedStock(req.body);
//         await newFeedStock.save();
//         req.flash('success', 'Feed stock added successfully');
//         res.redirect('/manager/stock');
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'failed to add feed stock');
//         res.redirect('/manager/stock');
//     }
// });



// //View BOTH StockLists in the dashboard ensureAuthenticated, ensureManager
// router.get('/manager/stock', async (req, res) => {
//     try {
//         const chickStock = await ChicksStock.find();
//         const feedStock = await FeedStock.find();
//         res.render('manager/stock', { chickStock, feedStock });
//     } catch (error) {
//         console.error(err);
//         req.flash('error', 'Server error');
//         res.redirect('/manager/stock');
//     }
// });

// router.get('/stock', async (req, res) => {
//     try {
//         const chickStock = await ChicksStock.find();
//         chickStock.length > 0 ? chickStock : 0,
//             res.render('manager/stock', { chickStock });
//     } catch (error) {
//         console.error(err);
//         req.flash('error', 'Server error');
//         res.redirect('/manager/stock');
//     }
// });

// //View and Update Chick Stock ensureAuthenticated, ensureManager
// router.get('/stock/:id', async (req, res) => {
//     try {
//         const stock = await ChicksStock.findById(req.params.id);
//         res.render('manager/editStock', { stock });
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Server error');
//         res.redirect('/manager/stock');
//     }
// });


// // Edit (Update) chick stock
// router.post('/stock/:id', async (req, res) => {
//     try {
//         await ChicksStock.findByIdAndUpdate(req.params.id, req.body)
//         req.flash('success', 'Chick stock updated successfully.');
//         res.redirect('/manager/stock');
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Failed to update chick stock.');
//         res.redirect('/manager/stock');
//     }
// });


// // Delete chick stock

// router.post('/manager/stock/delete/:id', async (req, res) => {
//     try {
//         await ChicksStock.findByIdAndDelete(req.params.id);
//         req.flash('success', 'Chick stock deleted successfully');
//         res.redirect('/manager/stock');
//     } catch (error) {
//         console.error(err);
//         req.flash('error', 'Failed to delete chick stock');
//         res.redirect('/manager/stock');
//     }
// });

// //
// // Get Feed Stock List ensureAuthenticated, ensureManager
// router.get('/feed-stock', async (req, res) => {
//     try {
//         const feed = await FeedStock.find();
//         feed.length > 0 ? feed : 0,
//             res.render('manager/editFeed', { feed });
//     } catch (error) {
//         console.error(err);
//         req.flash('error', 'Server error');
//         res.redirect('/manager/stock');
//     }
// });


// //View and Update Feed stock ensureAuthenticated, ensureManager
// router.get('/feed-stock/:id', async (req, res) => {
//     try {
//         const feed = await FeedStock.findById(req.params.id);
//         res.render('manager/editFeed', { feed });
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Server error');
//         res.redirect('/manager/stock');
//     }
// });

// router.post('/feed-stock/:id', async (req, res) => {
//     try {
//         const { type, quantity, stockDate } = req.body;
//         await FeedStock.findByIdAndUpdate(req.params.id, {
//             type,
//             quantity,
//             stockDate
//         });
//         req.flash('success', 'Feed stock updated successfully');
//         res.redirect('/manager/stock');
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Failed to update feed stock');
//         res.redirect('/manager/stock');
//     }
// });

// //Delete feed Stock ensureAuthenticated, ensureManager,
// router.post('/manager/feed-stock/delete/:id', async (req, res) => {
//     try {
//         await FeedStock.findByIdAndDelete(req.params.id);
//         req.flash('success', 'Feed stock deleted successfully');
//         res.redirect('/manager/stock');
//     } catch (error) {
//         console.error(error);
//         req.flash('error', 'Failed to delete feed stock');
//         res.redirect('/manager/stock');
//     }
// });








// // Approve Request ensureAuthenticated, ensureManager,
// router.post('/requests/approve/:id', async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id).populate('user');

//         if (!order) {
//             req.flash('error', 'Order not found');
//             return res.redirect('/manager/requests');
//         }

//         // Check stock
//         const stock = await ChicksStock.findOne({
//             category: order.category,
//             type: order.type
//         });

//         if (!stock || stock.quantity < order.quantity) {
//             req.flash('error', 'Insufficient stock');
//             return res.redirect('/manager/requests');
//         }

//         // Update stock
//         stock.quantity = order.quantity;
//         await stock.save();

//         // Update order status
//         order.status = 'approved';
//         order.approvedDate = new Date();
//         await order.save();

//         req.flash('success', 'Request approved successfully');
//         res.redirect('/manager/requests');

//     } catch (err) {
//         console.error(err.message);
//         req.flash('error', 'Failed to approve request');
//         res.redirect('/manager/requests');
//     }
// });

// // Reject Request ensureAuthenticated, ensureManager,
// router.post('/requests/reject/:id', async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id);

//         if (!order) {
//             req.flash('error', 'Order not found');
//             return res.redirect('/manager/requests');
//         }

//         order.status = 'canceled';
//         order.canceledDate = new Date();
//         order.rejectionReason = req.body.rejectionReason || '';

//         await order.save();

//         req.flash('success', 'Request rejected successfully');
//         res.redirect('/manager/requests');

//     } catch (err) {
//         console.error(err.message);
//         req.flash('error', 'Failed to reject request');
//         res.redirect('/manager/requests');
//     }
// });

// module.exports = router;