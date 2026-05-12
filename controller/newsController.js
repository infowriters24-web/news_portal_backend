const { formidable } = require("formidable");
const cloudinary = require("../config/cloudinary");
const newsModel = require("../models/newsModel");
const {
  mongo: { ObjectId },
} = require("mongoose");

// ✅ বাংলা সহ যেকোনো ভাষায় কাজ করে
const generateSlug = (title) => {
  return `news-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
};

class NewsController {
  // ✅ Add News
  add_news = async (req, res) => {
    const { id, name } = req.userinfo;
    const form = formidable({});

    try {
      const [fields, files] = await form.parse(req);

      if (!files.image || !files.image[0]) {
        return res.status(400).json({ message: "Image is required" });
      }

      const imageFile = files.image[0];

      const result = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: "news_portal",
        transformation: [
          { width: 800, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      const news = await newsModel.create({
        writerId: id,
        title: fields.title[0],
        slug: generateSlug(fields.title[0]), // ✅
        category: fields.category[0],
        sourceType: fields.sourceType?.[0] || "সংগৃহীত",
        description: fields.description[0],
        date: fields.date[0],
        writerName: name,
        image: result.secure_url,
        public_id: result.public_id,
        status: "pending",
      });

      return res.status(200).json({ message: "News added successfully", news });
    } catch (error) {
      console.log("FULL ERROR:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  // ✅ Get Dashboard News
  get_dashboard_news = async (req, res) => {
    const { id, role } = req.userinfo;

    try {
      let news;

      if (role === "admin") {
        news = await newsModel.find({}).sort({ createdAt: -1 });
      } else {
        news = await newsModel
          .find({ writerId: new ObjectId(id) })
          .sort({ createdAt: -1 });
      }

      return res.status(200).json({ news });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  // ✅ Get Single News
  get_dashboard_news_by_id = async (req, res) => {
    const { news_id } = req.params;

    try {
      const news = await newsModel.findById(news_id);

      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      return res.status(200).json({ news });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  // ✅ Update News
  update_news = async (req, res) => {
    const { news_id } = req.params;
    const form = formidable({});

    try {
      const [fields, files] = await form.parse(req);

      const existingNews = await newsModel.findById(news_id);

      if (!existingNews) {
        return res.status(404).json({ message: "News not found" });
      }

      let imageUrl = existingNews.image;
      let publicId = existingNews.public_id;

      if (files.image && files.image[0]) {
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }

        const result = await cloudinary.uploader.upload(
          files.image[0].filepath,
          {
            folder: "news_portal",
            transformation: [
              { width: 800, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
        );

        imageUrl = result.secure_url;
        publicId = result.public_id;
      }

      const updatedNews = await newsModel.findByIdAndUpdate(
        news_id,
        {
          title: fields.title[0],
          slug: existingNews.slug, // ✅ update এ slug পরিবর্তন না করাই ভালো
          category: fields.category[0],
          sourceType: fields.sourceType?.[0] || existingNews.sourceType || "সংগৃহীত",
          description: fields.description[0],
          date: fields.date[0],
          image: imageUrl,
          public_id: publicId,
        },
        { new: true },
      );

      return res.status(200).json({
        message: "News updated successfully",
        news: updatedNews,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  // ✅ Update Status
  update_news_status = async (req, res) => {
    const { news_id } = req.params;
    const { status } = req.body;

    try {
      const updatedNews = await newsModel.findByIdAndUpdate(
        news_id,
        { status },
        { new: true },
      );

      if (!updatedNews) {
        return res.status(404).json({ message: "News not found" });
      }

      return res
        .status(200)
        .json({ message: "Status updated", news: updatedNews });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  // ✅ Delete News
  delete_news = async (req, res) => {
    const { news_id } = req.params;

    try {
      const news = await newsModel.findById(news_id);

      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      if (news.public_id) {
        await cloudinary.uploader.destroy(news.public_id);
      }

      await newsModel.findByIdAndDelete(news_id);

      return res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  // ✅ Get All News for Website
  get_all_news = async (req, res) => {
    try {
      const category_news = await newsModel.aggregate([
        { $match: { status: "active" } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$category",
            news: {
              $push: {
                _id: "$_id",
                title: "$title",
                slug: "$slug",
                writerName: "$writerName",
                image: "$image",
                description: "$description",
                category: "$category",
                sourceType: "$sourceType",
                date: "$date",
                count: "$count", // ✅ news view count যোগ করো
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            news: { $slice: ["$news", 5] },
          },
        },
      ]);

      const news = {};
      for (let i = 0; i < category_news.length; i++) {
        news[category_news[i].category] = category_news[i].news;
      }

      return res.status(200).json({ news });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  // ✅ Get Single News by Slug
  get_news_by_slug = async (req, res) => {
    const { slug } = req.params;
    try {
      const news = await newsModel.findOneAndUpdate(
        { slug, status: "active" },
        { $inc: { count: 1 } },
        { new: true },
      );
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }
      return res.status(200).json({ news });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  // newsController.js এ যোগ করো
  get_news_by_category = async (req, res) => {
    const { category } = req.params;
    try {
      const news = await newsModel
        .find({ category: decodeURIComponent(category), status: "active" })
        .sort({ createdAt: -1 });

      if (!news.length) {
        return res.status(404).json({ message: "কোনো সংবাদ পাওয়া যায়নি" });
      }

      return res.status(200).json({ news });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };
}

module.exports = new NewsController();
