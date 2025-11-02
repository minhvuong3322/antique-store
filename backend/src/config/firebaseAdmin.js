// File: backend/src/config/firebaseAdmin.js
const admin = require("firebase-admin");
const path = require("path");

// Đường dẫn chính xác đến file .json
const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

module.exports = admin;
