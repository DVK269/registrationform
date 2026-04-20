const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// In-memory database
const students = [];

const generateId = () => Math.random().toString(36).substring(2, 9).toUpperCase();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Admin Route
app.get("/admin", (req, res) => {
    let rowsHtml = "";
    if (students.length === 0) {
        rowsHtml = `<tr><td colspan="8" class="text-center">No students registered yet.</td></tr>`;
    } else {
        students.forEach((s) => {
            rowsHtml += `
            <tr>
                <td><strong>${s.id}</strong></td>
                <td>${s.username}</td>
                <td>${s.email}</td>
                <td>${s.phone}</td>
                <td>${s.gender}</td>
                <td>${s.branch}</td>
                <td>${s.qualification}</td>
                <td><a href="/student/${s.id}" class="view-link">View</a></td>
            </tr>`;
        });
    }

    const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard - EduPortal</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/style.css">
    </head>
    <body class="admin-body">
        <header class="top-nav">
            <div class="nav-container">
                <div class="logo">EduPortal Admin</div>
                <a href="/" class="nav-link">Add New Student</a>
            </div>
        </header>
        <div class="admin-container">
            <div class="admin-header">
                <h1>Registrations Dashboard</h1>
                <div class="stat-badge">Total Registered: <strong>${students.length}</strong></div>
            </div>
            
            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Gender</th>
                            <th>Branch</th>
                            <th>Qualification</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(adminHtml);
});

// Specific Student Route
app.get("/student/:id", (req, res) => {
    const student = students.find(s => s.id === req.params.id);
    if (!student) {
        return res.status(404).send("<h1 style='text-align:center; font-family:sans-serif;'>Student Not Found</h1>");
    }

    const studentHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Portal - ${student.username}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <header class="top-nav">
            <div class="nav-container">
                <div class="logo">EduPortal</div>
                <a href="/admin" class="nav-link">Admin Dashboard</a>
            </div>
        </header>
        <div class="container portal-container">
            <div class="form-wrapper result-card">
                <div class="success-icon">✓</div>
                <h1>${req.query.new ? 'Registration Successful!' : 'Student Profile'}</h1>
                <p class="subtitle">Student ID: <strong>${student.id}</strong></p>
                
                <div class="profile-grid">
                    <div class="profile-item"><span class="result-label">Name</span> <span class="result-value">${student.username || 'N/A'}</span></div>
                    <div class="profile-item"><span class="result-label">Email</span> <span class="result-value">${student.email || 'N/A'}</span></div>
                    <div class="profile-item"><span class="result-label">Contact</span> <span class="result-value">${student.phone || 'N/A'}</span></div>
                    <div class="profile-item"><span class="result-label">Age</span> <span class="result-value">${student.age || 'N/A'}</span></div>
                    <div class="profile-item"><span class="result-label">Gender</span> <span class="result-value">${student.gender || 'N/A'}</span></div>
                    <div class="profile-item"><span class="result-label">Branch</span> <span class="result-value">${student.branch || 'N/A'}</span></div>
                    <div class="profile-item"><span class="result-label">Qualification</span> <span class="result-value">${student.qualification || 'N/A'}</span></div>
                    <div class="profile-item full-width"><span class="result-label">Address</span> <span class="result-value">${student.address || 'N/A'}</span></div>
                </div>
                
                <div class="button-group">
                    <a href="/" class="back-link">Register Another</a>
                    <a href="/admin" class="back-link primary">Dashboard</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(studentHtml);
});

// Submit Route
app.post("/submit", (req, res) => {
    const { username, email, phone, age, gender, branch, qualification, address } = req.body;
    
    const newStudent = {
        id: generateId(),
        username,
        email,
        phone,
        age,
        gender,
        branch,
        qualification,
        address,
        registeredAt: new Date()
    };
    
    students.push(newStudent);
    
    res.redirect("/student/" + newStudent.id + "?new=true");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});