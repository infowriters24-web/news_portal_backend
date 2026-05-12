const router = require('express').Router()
const middleware = require('../middlewares/middleware')
const authController = require('../controller/authController')
router.post("/api/add-writer",middleware.auth,middleware.role, authController.addWriter)
router.get("/api/writers",middleware.auth,middleware.role, authController.writer)
router.get("/api/writers/:writer_id",middleware.auth,middleware.role, authController.writerById)
router.post("/api/login", authController.login)

router.get("/api/profile",middleware.auth, authController.getProfile)
router.put("/api/profile",middleware.auth, authController.updateProfile) // ✅ NEW: profile update route
router.post("/api/change-password",middleware.auth, authController.changePassword) // ✅ NEW: password change route


module.exports = router