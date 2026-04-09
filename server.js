require("dotenv").config();

const express = require("express");
const twilio = require("twilio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SOS backend is running");
});

// 🔐 Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

// ===============================
// 🚨 WHATSAPP SOS (EXISTING)
// ===============================
app.post("/send-sos", async (req, res) => {
  console.log("Incoming WhatsApp request:", req.body);

  const { contacts, message } = req.body;

  try {
    const validContacts = contacts.filter(
      (phone) => phone && phone.startsWith("+")
    );

    console.log("Valid contacts:", validContacts);

    const results = await Promise.all(
      validContacts.map((phone) =>
        client.messages.create({
          from: "whatsapp:+14155238886",
          to: `whatsapp:${phone}`,
          body: message,
        })
      )
    );

    console.log("WhatsApp sent:", results.length);
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("WhatsApp Error:", error.message);
    res.status(500).json({ success: false });
  }
});

// ===============================
// 📩 SMS SOS (NEW FEATURE)
// ===============================
app.post("/send-sms", async (req, res) => {
  console.log("Incoming SMS request:", req.body);

  const { contacts, message } = req.body;

  try {
    const validContacts = contacts.filter(
      (phone) => phone && phone.startsWith("+")
    );

    console.log("Valid SMS contacts:", validContacts);

    const results = await Promise.all(
      validContacts.map((phone) =>
        client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        })
      )
    );

    console.log("SMS sent:", results.length);
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("SMS Error:", error.message);
    res.status(500).json({ success: false });
  }
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
