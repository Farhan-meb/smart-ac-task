const axios = require("axios");
const { logger } = require("./logger");

// Brevo API configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Send email function using Brevo
const sendEmail = async (to, subject, htmlContent) => {
    if (!BREVO_API_KEY) {
        throw new Error(
            "BREVO_API_KEY is not configured. Please add it to your .env file"
        );
    }

    try {
        const data = {
            sender: {
                name: "Smart Academic Task Planner",
                email: "md.a.hafiz255@gmail.com",
            },
            to: [
                {
                    email: to,
                    name: to.split("@")[0], // Use email prefix as name
                },
            ],
            subject: subject,
            htmlContent: htmlContent,
        };

        const headers = {
            accept: "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json",
        };

        const response = await axios.post(BREVO_API_URL, data, { headers });

        logger.info(
            `Email sent successfully via Brevo: ${
                response.data.messageId || "No message ID"
            }`
        );
        return { success: true, messageId: response.data.messageId };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || "Unknown error";
        logger.error("Error sending email via Brevo:", errorMessage);
        throw new Error(errorMessage);
    }
};

// Generate task reminder email HTML
const generateTaskReminderEmail = (user, tasks) => {
    const taskList = tasks
        .map((task) => {
            const priorityColor =
                {
                    HIGH: "#ef4444",
                    MEDIUM: "#8b5cf6",
                    LOW: "#3b82f6",
                    URGENT: "#dc2626",
                }[task.priority] || "#6b7280";

            const statusColor =
                {
                    PENDING: "#f59e0b",
                    IN_PROGRESS: "#3b82f6",
                    COMPLETED: "#10b981",
                }[task.status] || "#6b7280";

            return `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; background-color: #ffffff;">
                <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 18px;">${
                    task.title
                }</h3>
                ${
                    task.description
                        ? `<p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">${task.description}</p>`
                        : ""
                }
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <span style="background-color: ${priorityColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${
                task.priority
            }</span>
                    <span style="background-color: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${
                task.status
            }</span>
                    ${
                        task.category
                            ? `<span style="background-color: ${task.category.color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${task.category.name}</span>`
                            : ""
                    }
                    ${
                        task.course
                            ? `<span style="background-color: #374151; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${task.course.name}</span>`
                            : ""
                    }
                </div>
                ${
                    task.estimatedHours
                        ? `<p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px;">Estimated: ${task.estimatedHours} hours</p>`
                        : ""
                }
            </div>
        `;
        })
        .join("");

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Task Reminders</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">📚 Task Reminders</h1>
                    <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Hello ${
                        user.firstName
                    } ${user.lastName}!</p>
                </div>
                
                <div style="padding: 32px;">
                    <h2 style="margin: 0 0 24px 0; color: #111827; font-size: 22px; font-weight: 600;">
                        📅 You have ${tasks.length} task${
        tasks.length === 1 ? "" : "s"
    } due today
                    </h2>
                    
                    <div style="margin-bottom: 24px;">
                        ${taskList}
                    </div>
                    
                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-top: 24px;">
                        <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 18px; font-weight: 600;">💡 Tips for today:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                            <li>Start with the highest priority tasks first</li>
                            <li>Break down large tasks into smaller, manageable chunks</li>
                            <li>Take short breaks between tasks to maintain focus</li>
                            <li>Update your task status as you progress</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                            This is an automated reminder from your Smart Academic Task Planner.
                        </p>
                        <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">
                            Log in to your dashboard to manage your tasks.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Send task reminders to a user
const sendTaskReminders = async (user, tasks) => {
    if (!BREVO_API_KEY) {
        throw new Error(
            "BREVO_API_KEY is not configured. Please add it to your .env file"
        );
    }

    if (!tasks || tasks.length === 0) {
        logger.info(`No tasks due today for user ${user.email}`);
        return { success: true, message: "No tasks due today" };
    }

    const subject = `📚 Task Reminders - ${tasks.length} task${
        tasks.length === 1 ? "" : "s"
    } due today`;
    const htmlContent = generateTaskReminderEmail(user, tasks);

    try {
        // Update the sendEmail call to include user name
        const data = {
            sender: {
                name: "Smart Academic Task Planner",
                email: "md.a.hafiz255@gmail.com",
            },
            to: [
                {
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                },
            ],
            subject: subject,
            htmlContent: htmlContent,
        };

        const headers = {
            accept: "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json",
        };

        const response = await axios.post(BREVO_API_URL, data, { headers });

        logger.info(
            `Task reminders sent successfully to ${user.email} for ${tasks.length} tasks`
        );
        return { success: true, messageId: response.data.messageId };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || "Unknown error";
        logger.error(
            `Failed to send task reminders to ${user.email}:`,
            errorMessage
        );
        throw new Error(errorMessage);
    }
};

module.exports = {
    sendEmail,
    sendTaskReminders,
    generateTaskReminderEmail,
};
