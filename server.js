// Import required modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { Resend } = require("resend");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
const publicPath = path.join(__dirname, "public");
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  console.log(`Serving static files from: ${publicPath}`);
} else {
  console.log("Public directory not found, creating it...");
  fs.mkdirSync(publicPath, { recursive: true });
}

// Email configuration
const emailConfig = {
  to: process.env.EMAIL_TO,
};

// Validate required environment variables
function validateEnv() {
  const required = ["RESEND_API_KEY", "EMAIL_TO"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing);
    console.error("Please check your .env file");
    return false;
  }
  return true;
}

// Contact form validation
function validateContactData(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.phone || !/^\d{10,15}$/.test(data.phone.replace(/\D/g, ""))) {
    errors.push("Please provide a valid phone number (10-15 digits)");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  }

  return errors;
}

// Contact form email template
function createEmailTemplate(data) {
  const date = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  return `
    <h2>New Contact Form Submission</h2>
    <hr>
    <h3>Customer Details</h3>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Submitted:</strong> ${date}</p>
    
    <h3>Message</h3>
    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff;">
      ${data.message.replace(/\n/g, "<br>")}
    </div>
    
    <hr>
    <p><em>This message was sent through the Lumen Tekno website contact form.</em></p>
  `;
}

// API Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Lumen Tekno API is running",
    timestamp: new Date().toISOString(),
  });
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  console.log("Contact form submission received:", req.body);

  if (!validateEnv()) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error. Please contact administrator.",
    });
  }

  const validationErrors = validateContactData(req.body);
  if (validationErrors.length > 0) {
    console.log("Validation errors:", validationErrors);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  try {
    await resend.emails.send({
      from: "Lumen Tekno <onboarding@resend.dev>",
      to: emailConfig.to,
      subject: `New Contact from ${req.body.name} - Lumen Tekno`,
      html: createEmailTemplate(req.body),
    });

    console.log("Email sent successfully via Resend");

    res.json({
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: error.message,
    });
  }
});

// Serve index.html for all other routes
app.get("*", (req, res) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ message: "Page not found" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📁 Public directory: ${publicPath}`);

  if (!validateEnv()) {
    console.log("\n⚠️  Warning: Missing environment variables!");
    console.log("Please create a .env file with the required variables.");
    console.log(
      "Copy .env.example to .env and fill in your Resend credentials.\n",
    );
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
