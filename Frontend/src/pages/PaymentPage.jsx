import React, { useEffect } from "react";
import axios from "axios";

export default function PaymentPage({ amount }) {
  const handlePayment = async () => {
    const { data: order } = await axios.post("http://localhost:5000/api/payment/order", { amount });

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: order.amount,
      currency: order.currency,
      name: "Bike Booking",
      description: "Payment for bike rental",
      order_id: order.id,
      handler: function (response) {
        alert("Payment successful!");
      },
      theme: { color: "#007bff" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Complete Your Payment</h1>
      <button
        onClick={handlePayment}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
      >
        Pay ₹{amount}
      </button>
    </div>
  );
}
