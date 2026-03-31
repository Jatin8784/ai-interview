import Razorpay from "razorpay";
import crypto from "crypto";
import userModel from "../models/user.model.js";

export const createOrder = async (req, res) => {
  try {
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { planId } = req.body;
    let amount, credits;

    switch (planId) {
      case "Pro":
        amount = 499;
        credits = 500;
        break;
      case "Business":
        amount = 1999;
        credits = 1000;
        break;
      default:
        return res.status(400).json({ message: "Invalid plan selected." });
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      order,
      credits,
      planId,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create payment order." });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder_secret")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      let creditsToAdd = 0;
      if (planId === "Pro") creditsToAdd = 500;
      else if (planId === "Business") creditsToAdd = 1000;

      const user = await userModel.findByIdAndUpdate(
        req.userId,
        { $inc: { credits: creditsToAdd } },
        { new: true },
      );

      return res.status(200).json({
        message: "Payment verified successfully.",
        credits: user.credits,
      });
    } else {
      return res.status(400).json({ message: "Invalid payment signature." });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Payment verification failed." });
  }
};
