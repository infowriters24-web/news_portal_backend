const router = require("express").Router();
const middleware = require("../middlewares/middleware");
const newsController = require("../controller/newsController");

// 🌍 Public routes
router.get("/api/all/news", newsController.get_all_news);
router.get("/api/news/category/:category", newsController.get_news_by_category); // ✅ dynamic এর আগে
router.get("/api/news/slug/:slug", newsController.get_news_by_slug);

// 🔒 Private routes
router.post("/api/add", middleware.auth, newsController.add_news);
router.get("/api/news", middleware.auth, newsController.get_dashboard_news);

// ✅ Specific আগে, Dynamic পরে
router.patch("/api/news/status/:news_id", middleware.auth, newsController.update_news_status);
router.get("/api/news/:news_id", middleware.auth, newsController.get_dashboard_news_by_id);
router.put("/api/news/:news_id", middleware.auth, newsController.update_news);
router.delete("/api/news/:news_id", middleware.auth, newsController.delete_news);

module.exports = router;