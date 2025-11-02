const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
// Chỉ import 1 lần
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
// Bỏ dòng import lặp

// Validation rules
const registerValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  body("full_name").notEmpty().withMessage("Họ tên không được để trống"),
  validate,
];

const loginValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
  validate,
];

const changePasswordValidation = [
  body("current_password")
    .notEmpty()
    .withMessage("Mật khẩu hiện tại không được để trống"),
  body("new_password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),
  validate,
];

// Validation mới cho social-login, chỉ cần idToken
const socialLoginValidation = [
  body("idToken").notEmpty().withMessage("idToken là bắt buộc"),
  validate,
];
// (Đã xóa googleLoginValidation và facebookLoginValidation)

// Routes
router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.put(
  "/change-password",
  authenticate,
  changePasswordValidation,
  authController.changePassword
);

// route social-login duy nhất
router.post(
  "/social-login",
  socialLoginValidation,
  authController.handleSocialLogin
);

module.exports = router;
