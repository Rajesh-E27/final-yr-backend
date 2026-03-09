require("dotenv").config();

const express = require("express");
const twilio = require("twilio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("SOS backend is running");
});

// 🔐 Replace with your real credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

// 🚨 SOS API
app.post("/send-sos", async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio Sandbox number
      to: `whatsapp:${to}`,
      body: message,
    });
    
    console.log("Message SID:", response.sid);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
