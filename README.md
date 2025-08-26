# Smart Academic Task Planner

A comprehensive web-based application designed specifically for Masters students to manage academic tasks, deadlines, and research projects effectively.

## 🎯 Project Overview

**Student:** Md Abdul Hafiz  
**Programme:** MSc Information Technology  
**Student ID:** 24055140  
**Project Title:** Web-Based Smart Academic Task Planner

### Problem Statement

Masters students across various disciplines often face challenges in managing academic tasks due to complex schedules, diverse coursework, and demanding research requirements. Ineffective task organization can lead to missed deadlines, increased stress, and reduced academic performance.

### Solution

A centralized, user-friendly platform that provides:

-   Task creation, editing, and deletion
-   Intelligent task prioritization based on deadlines and importance
-   Integrated reminder system for upcoming deadlines
-   Academic-specific features and resource management
-   Cross-device compatibility and accessibility

## 🚀 Features

### Core Features

-   **Task Management**: Create, edit, delete, and organize academic tasks
-   **Smart Prioritization**: AI-driven task prioritization based on deadlines and importance
-   **Reminder System**: Automated email notifications for upcoming deadlines
-   **Academic Calendar**: Integration with course schedules and research milestones
-   **Data Visualization**: Task timelines, progress charts, and productivity analytics
-   **Resource Management**: Store and organize academic resources and references

### Technical Features

-   **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
-   **Real-time Updates**: Live synchronization across devices
-   **Secure Authentication**: JWT-based authentication with NextAuth
-   **Data Persistence**: MySQL database with Prisma ORM
-   **Modern UI/UX**: Built with Tailwind CSS and shadcn/ui components

## 🛠 Tech Stack

### Backend

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework
-   **MySQL** - Database
-   **Prisma** - ORM for database management
-   **JWT** - Authentication tokens

### Frontend

-   **Next.js 14** - React framework with App Router
-   **Tailwind CSS** - Utility-first CSS framework
-   **shadcn/ui** - Modern component library
-   **NextAuth.js** - Authentication solution
-   **Formik** - Form management
-   **Zustand** - State management
-   **React Hook Form** - Form validation

## 📁 Project Structure

```
smart-academic-task-planner/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Prisma models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Database schema and migrations
│   └── tests/               # Backend tests
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   ├── store/           # Zustand stores
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
└── docs/                    # Documentation
```

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   MySQL 8.0+
-   npm or yarn

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd smart-academic-task-planner
    ```

2. **Install dependencies**

    ```bash
    npm run install:all
    ```

3. **Set up the database**

    ```bash
    npm run db:setup
    npm run db:migrate
    npm run db:seed
    ```

4. **Start development servers**
    ```bash
    npm run dev
    ```

The application will be available at:

-   Frontend: http://localhost:3000
-   Backend API: http://localhost:4000

## 📊 Database Schema

### Core Entities

-   **Users**: Student profiles and authentication
-   **Tasks**: Academic tasks with priorities and deadlines
-   **Courses**: Course information and schedules
-   **Categories**: Task categorization (Assignments, Research, etc.)
-   **Reminders**: Notification settings and schedules
-   **Resources**: Academic resources and references

## 🔔 Reminder System

### Daily Email Reminders

The application features an automated email reminder system that runs daily at **10:00 AM** to help students stay on top of their academic tasks:

-   **Schedule**: Automatically sends reminders every day at 10:00 AM (Asia/Dhaka timezone)
-   **Target Tasks**: Only sends reminders for tasks due on the current day with status PENDING or IN_PROGRESS
-   **Email Content**: Beautiful HTML emails containing:
-   Personalized greeting with student's name
-   List of tasks due today with priority badges, status, categories, and courses
-   Estimated hours for each task
-   Productivity tips and best practices
-   **Sender**: All reminders are sent from `md.a.hafiz255@gmail.com`
-   **Database Tracking**: All sent reminders are recorded in the database for monitoring

### Manual Trigger

Administrators can manually trigger daily reminders using the API endpoint:

```bash
POST /api/reminders/trigger-daily
```

### Configuration

The reminder system requires Brevo API key configuration in the backend `.env` file:

```env
BREVO_API_KEY=your-brevo-api-key
```

**Benefits of Brevo:**

-   **Better Deliverability**: Higher email delivery rates than Gmail
-   **Professional Service**: Built for transactional emails
-   **Free Tier**: 300 emails per day free
-   **Analytics**: Track email opens and engagement
-   **No App Password Needed**: Simple API key setup

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm run test
```

### Frontend Testing

```bash
cd frontend
npm run test
```

### E2E Testing

```bash
npm run test:e2e
```

## 📈 Performance Metrics

-   **System Usability Scale (SUS)**: Target score of 80+
-   **Load Time**: < 3 seconds on 3G connection
-   **Accessibility**: WCAG 2.1 AA compliance
-   **Cross-browser**: Chrome, Firefox, Safari, Edge support

## 🔒 Security Features

-   JWT-based authentication
-   Password hashing with bcrypt
-   Input validation and sanitization
-   CORS protection
-   Rate limiting
-   SQL injection prevention via Prisma

## 📱 Responsive Design

The application is fully responsive and optimized for:

-   Desktop (1920x1080 and above)
-   Tablet (768px - 1024px)
-   Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Md Abdul Hafiz**  
MSc Information Technology  
Student ID: 24055140

## 🙏 Acknowledgments

-   Academic research on task management and procrastination
-   Nielsen's usability heuristics for UI/UX design
-   WCAG 2.1 guidelines for accessibility
-   Agile development methodology
