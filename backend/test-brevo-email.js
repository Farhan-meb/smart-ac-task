require("dotenv").config();
const { sendTaskReminders } = require("./src/utils/emailService");

// Test data
const testUser = {
    id: "test-user-id",
    email: "farhan.meb@gmail.com",
    firstName: "Farhan",
    lastName: "Mahbub",
};

const testTasks = [
    {
        id: "task-1",
        title: "Complete Project Report",
        description: "Finish the final project report for CS101",
        priority: "HIGH",
        status: "PENDING",
        dueDate: new Date(),
        estimatedHours: 4,
        category: {
            name: "Academic",
            color: "#3B82F6",
        },
        course: {
            name: "Computer Science 101",
        },
    },
    {
        id: "task-2",
        title: "Study for Exam",
        description: "Review chapters 1-5 for tomorrow's exam",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        dueDate: new Date(),
        estimatedHours: 2,
        category: {
            name: "Study",
            color: "#10B981",
        },
        course: {
            name: "Mathematics 201",
        },
    },
];

async function testBrevoEmail() {
    try {
        console.log("🧪 Testing Brevo email functionality...");
        console.log("📧 Sender email: md.a.hafiz255@gmail.com");
        console.log("📧 Recipient email:", testUser.email);
        console.log("📋 Number of tasks:", testTasks.length);
        console.log("🔑 Using Brevo API for email delivery");

        const result = await sendTaskReminders(testUser, testTasks);

        console.log("✅ Brevo email test completed successfully!");
        console.log("📧 Result:", result);
    } catch (error) {
        console.error("❌ Brevo email test failed:", error.message);
        console.error(
            "💡 Make sure you have set up BREVO_API_KEY in your .env file"
        );
        console.error(
            "💡 Check your Brevo API key is valid and has proper permissions"
        );
    }
}

// Run the test
testBrevoEmail();
