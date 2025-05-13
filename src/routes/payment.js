const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const { membershipAmount } = require("../utils/constants");
const PaymentModel = require("../models/payment");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");
require("dotenv").config();
const paymentRoute = express.Router();

paymentRoute.post("/payment/create", userAuth, async (req, res) => {
  const { firstName, lastName, emailId } = req.user;
  const { membership } = req.body;
  try {
    const options = {
      amount: membershipAmount[membership] * 100,
      currency: "INR",
      receipt: `receipt_devtinder_${membership}`,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membership,
      },
    };
    const order = await razorpayInstance.orders.create(options);

    const { id: orderId, status, amount, currency, receipt, notes } = order;
    const payment = new PaymentModel({
      userId: req.user._id,
      orderId,
      status,
      amount,
      currency,
      receipt,
      notes,
    });

    const savedPayment = await payment.save();

    res
      .status(200)
      .json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

paymentRoute.post("/payment/webhook", async (req, res) => {
  console.log("/payment/webhook");
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebHookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.WEBHOOK_SECRET
    );

    if (!isWebHookValid) {
      return res.status(500).json({ msg: "Webhook signature is invalid!!!!" });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await PaymentModel.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findById({ _id: payment.userId });

    if (user) {
      user.isPremium = true;
      user.membershipType = paymentDetails.notes.membershipType;
      await user.save();
    } else {
      return res.status(404).json({ msg: "No user found" });
    }

    // TODO : Do the functionality based on the event
    // if(req.body.event === "payment.captured"){

    // }

    // if(req.body.event === "payment.failed"){

    // }
  } catch (error) {
    console.log("errot webhook ", error);
    res.status(500).json({ msg: error });
  }
});

paymentRoute.get("/premium/verify", userAuth,async (req, res) => {
  const  user  = req.user;
  try {
    if (user.isPremium) {
      const { isPremium,firstName, lastName } = user;
      return res.status(200).json({ isPremium,firstName,lastName });
    } else {
      return res.status(500).json({ isPremium,firstName,lastName});
    }
  } catch (error) {
    res.status(500).json({ msg: "Basic user"});
  }
});

module.exports = paymentRoute;
