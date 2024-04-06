const express = require('express');
// const authenticateToken = require('../../middleware/authenticateToken');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/users');
const Product = require('../../models/products');
const Order = require('../../models/orders');
const stripe = require('stripe')('sk_test_51P27AhA8codDyAsMjtLHzqXyYjfN7uNNTdjYUwjSaK0TY2XEmW4WIjPwgD7giZaJHMQXlwmMFLhEm806PU8W5gcq00QOga46e4');

// Endpoint to handle payment confirmation
router.post('/',async (req, res) => {
  try {
    // console.log('BODY >> ',req.body);
    jwt.verify(req.body.token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('JWT Verification Error:');
        return res.status(403).json({ message: 'Forbidden' });
      }
      // token verified now find currnet user
        User.findById(user.userId).then(currentUser => {

          // create order
          stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: currentUser.username,
            address: {
                line1: req.body.address,
                postal_code: req.body.postalCode,
                city: req.body.postalCode,
                country: req.body.country,
            }
        })
        .then((customer) => {
            // calculate product total
            Product.findById(req.body.productId).then(product => {
                console.log('PRODUCT TOTAL ',product.price*req.body.quantity);
                let total = product.price*req.body.quantity;
                  return stripe.charges.create({
                      amount: total*100,     // amount will be amount*100
                      description: req.body.productName,
                      currency: 'USD',
                      customer: customer.id
                  });
                  })
                  .then((charge) => {
                      // PAYMENT SUCCESS CREATE ORDER
                          // Create a new order
                          let productDetails = {product:req.body.productId,quantity:req.body.quantity};
                          const newOrder = new Order({
                            userId: currentUser._id,
                            products: [productDetails],
                            totalPrice:charge.amount/100,
                            status: 'pending',
                            address:req.body.address,
                            customerId:charge.customer
                          });

                          // Save the order to the database
                          newOrder.save();
                          res.send("PAYMENT SUCCESS!")
                  })
                  .catch((err) => {
                    console.log('PYAMENT FIALED');
                      res.redirect("/failure")
                  });
            })
        }).catch(err => {
          console.log('user not found');
        });

    });

  } catch (error) {
    
  }


});

module.exports = router;
