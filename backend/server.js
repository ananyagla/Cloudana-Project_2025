// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// MongoDB Atlas connection string
const uri = "mongodb+srv://techcrusaders:sih2025@cluster0.1oaircm.mongodb.net/authData?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connectToDb() {
    try {
        await client.connect();
        console.log("✅ Successfully connected to MongoDB Atlas!");
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB Atlas", err);
        process.exit(1);
    }
}
connectToDb();

// --- API Endpoints ---
const database = client.db("authData");
const usersCollection = database.collection("users");

// Serve the login/signup page from the 'frontend' directory
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// User Registration Endpoint
app.post("/api/register", async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "❌ Missing required fields." });
    }

    try {
        const existingUser = await usersCollection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "❌ An account with this email already exists." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            img: req.body.img || "https://www.w3schools.com/howto/img_avatar.png",
            createdAt: new Date(),
        };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "✅ User successfully registered!" });
    } catch (err) {
        console.error("❌ Error registering user:", err);
        res.status(500).json({ message: "❌ Internal server error." });
    }
});

// User Login Endpoint
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "❌ Email and password are required." });
    }

    try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "❌ Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "❌ Invalid email or password." });
        }

        // Success! Send user data to the dashboard
        res.status(200).json({
            message: "✅ Login successful!",
            user: {
                username: user.username,
                email: user.email,
                img: user.img,
            }
        });
    } catch (err) {
        console.error("❌ Error logging in:", err);
        res.status(500).json({ message: "❌ Internal server error." });
    }
});

// Configure multer for handling file uploads (profile pictures)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Get user profile data
app.get("/api/profile/:email", async (req, res) => {
    try {
        const user = await usersCollection.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: "❌ User not found." });
        }

        res.status(200).json({
            message: "✅ Profile data retrieved successfully!",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                img: user.img || "https://www.w3schools.com/howto/img_avatar.png",
                createdAt: user.createdAt,
                lastLogin: user.lastLogin || new Date(),
                subscription: user.subscription || "Free",
                activityCount: user.activityCount || 0
            }
        });
    } catch (err) {
        console.error("❌ Error fetching profile:", err);
        res.status(500).json({ message: "❌ Internal server error." });
    }
});

// Update user profile picture
app.post("/api/profile/update-picture", upload.single('profilePicture'), async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "❌ Email is required." });
        }

        let imageUrl = "https://www.w3schools.com/howto/img_avatar.png";
        
        if (req.file) {
            // Convert image to base64 string
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            imageUrl = base64Image;
        }

        const result = await usersCollection.updateOne(
            { email: email },
            { 
                $set: { 
                    img: imageUrl,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "❌ User not found." });
        }

        res.status(200).json({
            message: "✅ Profile picture updated successfully!",
            imageUrl: imageUrl
        });
    } catch (err) {
        console.error("❌ Error updating profile picture:", err);
        res.status(500).json({ message: "❌ Internal server error." });
    }
});

// Update user profile information
app.put("/api/profile/update", async (req, res) => {
    try {
        const { email, username, currentPassword, newPassword } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "❌ Email is required." });
        }

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "❌ User not found." });
        }

        let updateData = {
            updatedAt: new Date()
        };

        if (username && username !== user.username) {
            updateData.username = username;
        }

        if (newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "❌ Current password is incorrect." });
            }
            
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(newPassword, saltRounds);
        }

        const result = await usersCollection.updateOne(
            { email: email },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "❌ User not found." });
        }

        res.status(200).json({
            message: "✅ Profile updated successfully!",
            user: {
                username: updateData.username || user.username,
                email: user.email,
                img: user.img
            }
        });
    } catch (err) {
        console.error("❌ Error updating profile:", err);
        res.status(500).json({ message: "❌ Internal server error." });
    }
});

// Get dashboard statistics
app.get("/api/dashboard/stats/:email", async (req, res) => {
    try {
        const user = await usersCollection.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: "❌ User not found." });
        }

        // Update last login time
        await usersCollection.updateOne(
            { email: req.params.email },
            { 
                $set: { lastLogin: new Date() },
                $inc: { activityCount: 1 }
            }
        );

        const stats = {
            totalUsers: await usersCollection.countDocuments(),
            userSince: user.createdAt,
            lastLogin: new Date(),
            activityCount: (user.activityCount || 0) + 1,
            subscription: user.subscription || "Free",
            storageUsed: "2.3 GB",
            storageLimit: "10 GB"
        };

        res.status(200).json({
            message: "✅ Dashboard stats retrieved successfully!",
            stats: stats
        });
    } catch (err) {
        console.error("❌ Error fetching dashboard stats:", err);
        res.status(500).json({ message: "❌ Internal server error." });
    }
});

// Route for the dashboard, only accessible after login
app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dashboard.html"));
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});

