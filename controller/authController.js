const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { formidable } = require("formidable");
const cloudinary = require("../config/cloudinary");
const jwtSecret = process.env.jwt_secret || process.env.JWT_SECRET;
const jwtExpireTime = process.env.expire_time || process.env.EXPIRE_TIME || "1d";

class authController {
  // Login
  login = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const user = await authModel
        .findOne({ email: normalizedEmail })
        .select("+password");

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const obj = {
        id: user.id,
        name: user.name,
        category: user.category,
        role: user.role,
      };

      const token = jwt.sign(obj, jwtSecret, {
        expiresIn: jwtExpireTime,
      });

      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

  // Add Writer
  addWriter = async (req, res) => {
    const { name, email, password, category } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        message: "Please enter a valid email",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const writer = await authModel.findOne({
        email: normalizedEmail,
      });

      if (writer) {
        return res.status(400).json({
          message: "Writer already exists",
        });
      }

      const new_writer = await authModel.create({
        name: name.trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(password.trim(), 10),
        category: category.trim(),
        role: "writer",
      });
      const writerResponse = {
        _id: new_writer._id,
        name: new_writer.name,
        email: new_writer.email,
        category: new_writer.category,
        role: new_writer.role,
        image: new_writer.image,
        public_id: new_writer.public_id,
        createdAt: new_writer.createdAt,
        updatedAt: new_writer.updatedAt,
      };

      return res.status(201).json({
        message: "Writer added successfully",
        writer: writerResponse,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

  // Writers list
  writer = async (req, res) => {
    try {
      const writers = await authModel
        .find({ role: "writer" })
        .sort({ createdAt: -1 });

      return res.status(200).json({ writers });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

  // Writer details
  writerById = async (req, res) => {
    const { writer_id } = req.params;
    try {
      const writer = await authModel.findOne({
        _id: writer_id,
        role: "writer",
      });

      if (!writer) {
        return res.status(404).json({
          message: "Writer not found",
        });
      }

      return res.status(200).json({ writer });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

  // Profile
  getProfile = async (req, res) => {
    const { id } = req.userinfo;

    try {
      const user = await authModel.findById(id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

  // Update Profile
  updateProfile = async (req, res) => {
    const { id } = req.userinfo;
    const form = formidable({ multiples: true });

    try {
      const [fields, files] = await form.parse(req);

      const existingUser = await authModel.findById(id);

      if (!existingUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      let imageUrl = existingUser.image;
      let publicId = existingUser.public_id;

      if (files?.image?.[0]) {
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }

        const result = await cloudinary.uploader.upload(
          files.image[0].filepath,
          {
            folder: "auth",
            transformation: [
              {
                width: 400,
                height: 400,
                crop: "fill",
                gravity: "face",
              },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          }
        );

        imageUrl = result.secure_url;
        publicId = result.public_id;
      }

      const updatedUser = await authModel.findByIdAndUpdate(
        id,
        {
          image: imageUrl,
          public_id: publicId,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  // Change Password
  changePassword = async (req, res) => {
    const { id } = req.userinfo;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords are required",
      });
    }

    try {
      const user = await authModel.findById(id).select("+password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const match = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!match) {
        return res.status(400).json({
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      await authModel.findByIdAndUpdate(id, {
        password: hashedPassword,
      });

      return res.status(200).json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
}

module.exports = new authController();