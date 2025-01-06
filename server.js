const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mock database
let students = [
    {
        id: '123',
        admissionNumber: 'A001',
        name: 'John Doe',
        fatherName: 'Richard Doe',
        course: 'Computer Science',
        verified: true,
        picture: 'link-to-picture',
        certificatePDF: 'link-to-pdf',
        certificatePNG: 'link-to-png'
    }
];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.post('/verify', (req, res) => {
    const { studentId, admissionNumber } = req.body;
    const student = students.find(s => s.id === studentId && s.admissionNumber === admissionNumber);
    if (student) {
        res.json({ verified: student.verified, details: student });
    } else {
        res.json({ verified: false });
    }
});

app.post('/admin/login', (req, res) => {
    const { adminId, password } = req.body;
    if (adminId === 'skil_hamza' && password === '$HamzA0258skillCraft-Hami') {
        req.session.admin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.send('Invalid credentials');
    }
});

// Admin dashboard
app.get('/admin/dashboard', (req, res) => {
    if (req.session.admin) {
        res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
    } else {
        res.redirect('/admin');
    }
});

// API to get all students
app.get('/admin/students', (req, res) => {
    if (req.session.admin) {
        res.json(students);
    } else {
        res.status(401).send('Unauthorized');
    }
});

// API to add a new student
app.post('/admin/add-student', (req, res) => {
    if (req.session.admin) {
        const newStudent = req.body;
        students.push(newStudent);
        res.status(201).send('Student added');
    } else {
        res.status(401).send('Unauthorized');
    }
});

// API to edit a student
app.put('/admin/edit-student/:id', (req, res) => {
    if (req.session.admin) {
        const studentId = req.params.id;
        const updatedStudent = req.body;
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            students[index] = updatedStudent;
            res.status(200).send('Student updated');
        } else {
            res.status(404).send('Student not found');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

// API to delete a student
app.delete('/admin/delete-student/:id', (req, res) => {
    if (req.session.admin) {
        const studentId = req.params.id;
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            students.splice(index, 1);
            res.status(200).send('Student deleted');
        } else {
            res.status(404).send('Student not found');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
