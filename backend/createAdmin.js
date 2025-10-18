import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js"; // adjust the path if needed

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    const email = "chrisfanwell27@gmail.com";
    const plainPassword = "onafo"; // default password

    let admin = await User.findOne({ email });

    if (admin) {
      console.log("⚠️ Admin already exists, updating password...");
      admin.password = plainPassword; // plain, will be hashed by pre("save")
      await admin.save();
      console.log("✅ Admin password updated successfully!");
    } else {
      admin = new User({
        username: "Leeway",
        email,
        password: plainPassword, // plain text (model will hash it)
        role: "admin",
      });

      await admin.save();
      console.log("✅ Admin created successfully!");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

connectDB().then(createAdmin);
