const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');
const shortid = require('shortid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

app.post('/razorpay', async (req, res) => {
    const payment_capture = 1;
    const amount = req.body.amount;
    const currency = 'INR';
    
    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture
    };

    try {
        const response = await razorpay.orders.create(options);
        console.log(response);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the Razorpay order.');
    }
});

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
