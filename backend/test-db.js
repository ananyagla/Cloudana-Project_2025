const { MongoClient, ServerApiVersion } = require("mongodb");

// MongoDB Atlas connection string
const uri = "mongodb+srv://techcrusaders:sih2025@cluster0.1oaircm.mongodb.net/authData?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function testDatabaseConnection() {
    try {
        console.log("🔄 Connecting to MongoDB Atlas...");
        await client.connect();
        console.log("✅ Successfully connected to MongoDB Atlas!");

        const database = client.db("authData");
        const usersCollection = database.collection("users");

        // Test: Find the user with email "abhay.verma_cs23@gla.ac.in"
        console.log("\n🔍 Looking for user: abhay.verma_cs23@gla.ac.in");
        const testUser = await usersCollection.findOne({ 
            email: "abhay.verma_cs23@gla.ac.in" 
        });

        if (testUser) {
            console.log("✅ User found!");
            console.log("📄 User Data:");
            console.log("  - ID:", testUser._id);
            console.log("  - Username:", testUser.username);
            console.log("  - Email:", testUser.email);
            console.log("  - Profile Picture URL:", testUser.img);
            console.log("  - Created At:", testUser.createdAt);
            
            // Test profile picture URL accessibility
            console.log("\n🖼️ Testing profile picture URL...");
            if (testUser.img && testUser.img.startsWith('http')) {
                console.log("✅ Profile picture URL is valid:", testUser.img);
            } else {
                console.log("⚠️ Profile picture URL may be a base64 string or invalid");
            }

            // Test: Retrieve profile data using API endpoint logic
            console.log("\n🔧 Testing profile retrieval logic...");
            const profileData = {
                _id: testUser._id,
                username: testUser.username,
                email: testUser.email,
                img: testUser.img || "https://www.w3schools.com/howto/img_avatar.png",
                createdAt: testUser.createdAt,
                lastLogin: testUser.lastLogin || new Date(),
                subscription: testUser.subscription || "Free",
                activityCount: testUser.activityCount || 0
            };
            
            console.log("✅ Profile data structure:");
            console.log(JSON.stringify(profileData, null, 2));
            
        } else {
            console.log("❌ User not found!");
            console.log("📝 Available users in the collection:");
            const allUsers = await usersCollection.find({}, { 
                projection: { email: 1, username: 1, _id: 0 } 
            }).toArray();
            console.log(allUsers);
        }

        // Test: Count total users
        const totalUsers = await usersCollection.countDocuments();
        console.log(`\n📊 Total users in database: ${totalUsers}`);

    } catch (err) {
        console.error("❌ Error testing database:", err);
    } finally {
        await client.close();
        console.log("\n🔌 Database connection closed");
    }
}

// Run the test
testDatabaseConnection();
