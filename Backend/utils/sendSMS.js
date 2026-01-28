// // Backend/utils/sendSMS.js
// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
// const SENDER_ID = process.env.FAST2SMS_SENDER_ID || "TXTIND"; // optional

// export async function sendSMS(number, message) {
//   try {
//     // Fast2SMS expects numbers as a comma-separated string (without +91 usually)
//     // If you store numbers with +91, strip it or normalize beforehand.
//     const numbers = Array.isArray(number) ? number.join(",") : String(number);

//     const payload = {
//       route: "v3",
//       sender_id: SENDER_ID,
//       message: message,
//       language: "english",
//       flash: 0,
//       numbers: numbers,
//     };

//     const res = await axios.post("https://www.fast2sms.com/dev/bulkV2", payload, {
//       headers: {
//         authorization: FAST2SMS_API_KEY,
//         "Content-Type": "application/json",
//       },
//       timeout: 10000,
//     });

//     // res.data contains Fast2SMS response
//     console.log("Fast2SMS response:", res.data);
//     return res.data;
//   } catch (err) {
//     console.error("Fast2SMS error:", err?.response?.data || err.message);
//     // Decide whether to throw or return false depending on your needs
//     return { success: false, error: err?.response?.data || err.message };
//   }
// }
