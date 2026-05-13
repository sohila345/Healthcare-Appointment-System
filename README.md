# 🏥 Healthcare Appointment Management System

A full-stack healthcare web application that allows patients to search for doctors, book appointments, manage schedules, read healthcare tips, and interact with an AI-powered medical assistant.

---

# 📌 Features

## 👤 User Features
- User Registration & Login with JWT Authentication
- Browse Doctors by Specialty
- Book & Cancel Appointments
- View Personal Appointments
- Add Doctor Reviews
- Responsive User Interface

## 👨‍⚕️ Doctor Features
- Add Doctors with Image Upload
- Manage Available Slots
- View Patient Reviews
- Automatic Rating Calculation

## 🤖 AI Medical Assistant
- Arabic symptom analysis
- Intelligent specialty prediction
- Dataset-based medical Q&A
- Cosine Similarity matching system
- Arabic text normalization & tokenization

## ⚙️ System Features
- Automatic expired slot cleanup using Cron Jobs
- Secure Authentication & Authorization
- RESTful API Architecture
- Image Upload Handling with Multer
- MongoDB Database Integration

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Native Fetch API (for API requests)
- React Router DOM

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Node-Cron

---
# 📁 Dataset Files

Due to GitHub file size limitations, dataset files are hosted externally.

Download datasets from the following links:

- clean_data.json → [[Google Drive Link](https://drive.google.com/file/d/1CJ4lSFYbpC7MRJ_kahi4DpuPupQWFhmn/view?usp=drive_link)]
- tokenized_questions.json → [[Google Drive Link](https://drive.google.com/file/d/1ir1prvbdiOKke96T43ytJVII5DU8IkJ8/view?usp=drive_link)]
- cat_words.json → [[Google Drive Link](https://drive.google.com/file/d/1hkvsBFNrEUzx8kZ1apA9-ZcUgnZHahph/view?usp=drive_link)]
- categories.json → [[Google Drive Link](https://drive.google.com/file/d/1lrtr11V1ciMyNdM0PkiWqAsM6DggVab8/view?usp=drive_link)]
# 📂 Project Structure

```bash
Healthcare-Appointment-System
│
├── frontend
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── utils
│   └── config
│
└── README.md