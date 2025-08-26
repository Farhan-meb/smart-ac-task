const fs = require("fs");
const path = require("path");

console.log("📧 Email Setup Helper (Brevo)");
console.log("============================");
console.log("");

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
    console.log("❌ .env file not found!");
    console.log("Please create a .env file in the backend directory.");
    process.exit(1);
}

// Read current .env file
const envContent = fs.readFileSync(envPath, "utf8");

// Check if BREVO_API_KEY is already set
if (envContent.includes("BREVO_API_KEY=")) {
    console.log("✅ BREVO_API_KEY is already configured in .env file");
    console.log("");
    console.log("To test the email functionality:");
    console.log("1. Make sure you have a valid Brevo API key");
    console.log(
        "2. Update the BREVO_API_KEY value in your .env file if needed"
    );
    console.log("3. Run: node test-email.js");
} else {
    console.log("❌ BREVO_API_KEY is not configured");
    console.log("");
    console.log("Please add the following line to your .env file:");
    console.log("");
    console.log("BREVO_API_KEY=your-brevo-api-key");
    console.log("");
    console.log("📋 Steps to get Brevo API Key:");
    console.log("1. Go to https://app.brevo.com/");
    console.log("2. Sign up or log in to your Brevo account");
    console.log("3. Go to Settings → API Keys");
    console.log("4. Create a new API key or copy existing one");
    console.log("5. Add it to your .env file as BREVO_API_KEY");
    console.log("");
    console.log("💡 Brevo provides 300 free emails per day!");
}

console.log("");
console.log("📧 Sender email will be: md.a.hafiz255@gmail.com");
console.log("📧 Email service: Brevo (formerly Sendinblue)");
console.log("🚀 Better deliverability and professional templates");
