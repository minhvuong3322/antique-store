const { User, SocialAuth } = require("../models");
const { generateToken, generateRefreshToken } = require("../middlewares/auth");

const admin = require("../config/firebaseAdmin");

/**
 * Đăng ký người dùng mới
 * POST /api/v1/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { email, password, full_name, phone, address } = req.body;

    // Kiểm tra người dùng đã tồn tại chưa
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã được đăng ký",
      });
    }

    // Tạo người dùng mới
    const user = await User.create({
      email,
      password,
      full_name,
      phone,
      address,
      role: "customer",
    });

    // Tạo token
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        user: user.toJSON(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng nhập người dùng
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.scope("withPassword").findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // So sánh mật khẩu
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Tạo token
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: user.toJSON(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 * GET /api/v1/auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật thông tin người dùng
 * PUT /api/v1/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone, address, avatar } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Cập nhật thông tin người dùng
    await user.update({
      full_name: full_name || user.full_name,
      phone: phone || user.phone,
      address: address || user.address,
      avatar: avatar || user.avatar,
    });

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đổi mật khẩu
 * PUT /api/v1/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    // Lấy người dùng kèm mật khẩu
    const user = await User.scope("withPassword").findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Xác thực mật khẩu hiện tại
    const isPasswordValid = await user.comparePassword(current_password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại không chính xác",
      });
    }

    // Cập nhật mật khẩu
    user.password = new_password;
    await user.save();

    res.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    next(error);
  }
};

// === GOOGLE VÀ FACEBOOK ===
/**
 * Đăng nhập bằng Social (Google, Facebook, v.v.) qua Firebase
 * POST /api/v1/auth/social-login
 */
const handleSocialLogin = async (req, res, next) => {
  const { idToken } = req.body;

  try {
    // 1. Xác thực idToken từ Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const { email, name, picture, uid } = decodedToken;
    const firebaseProvider = decodedToken.firebase.sign_in_provider;

    // Map Firebase provider values to database ENUM values
    // Firebase returns: "google.com", "facebook.com", "apple.com", "github.com", etc.
    // Database expects: "google", "facebook", "apple", "github"
    const providerMap = {
      'google.com': 'google',
      'facebook.com': 'facebook',
      'apple.com': 'apple',
      'github.com': 'github',
      'password': null, // Regular email/password login, not social
      'phone': null // Phone auth, not social
    };

    let provider = providerMap[firebaseProvider];
    
    // If not found in map or is null, try to extract from firebaseProvider
    if (!provider && firebaseProvider) {
      // Fallback: remove .com if present
      provider = firebaseProvider.replace('.com', '');
    }
    
    // Final fallback
    if (!provider || provider === null) {
      provider = 'google'; // Default fallback
    }
    
    // Nếu provider không hợp lệ, trả về lỗi
    if (!['google', 'facebook', 'apple', 'github'].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: `Provider không được hỗ trợ: ${firebaseProvider}`
      });
    }

    //===== Nếu không có email, tạo một email giả, duy nhất ( Email ở trạng thái chỉ mình tôi ) Ịt mọe :))))
    const userEmail = email ? email : `${uid}@gmail.com`;

    // 2. Tìm hoặc Tạo người dùng trong database MySQL
    const [user, created] = await User.findOrCreate({
      where: { email: userEmail },
      defaults: {
        full_name: name,
        avatar: picture,
        password: `firebase_uid_${uid}`,
        role: "customer",
      },
    });

    // 3. Liên kết tài khoản xã hội trong bảng `social_auths`
    try {
      // Tìm xem đã có SocialAuth với provider + provider_id chưa
      let socialAuth = await SocialAuth.findOne({
        where: {
          provider: provider,
          provider_id: uid,
        },
      });

      if (socialAuth) {
        // Đã tồn tại: cập nhật user_id nếu khác
        if (socialAuth.user_id !== user.id) {
          await socialAuth.update({
            user_id: user.id,
          });
        }
      } else {
        // Chưa tồn tại: kiểm tra xem user đã có record với provider này chưa
        const existingSocialAuth = await SocialAuth.findOne({
          where: {
            user_id: user.id,
            provider: provider,
          },
        });

        if (existingSocialAuth) {
          // Update provider_id nếu khác
          await existingSocialAuth.update({
            provider_id: uid,
          });
        } else {
          // Tạo mới
          await SocialAuth.create({
            user_id: user.id,
            provider: provider,
            provider_id: uid,
          });
        }
      }
    } catch (socialAuthError) {
      // Nếu có lỗi unique constraint, thử tìm và update record hiện có
      if (socialAuthError.name === 'SequelizeUniqueConstraintError') {
        // Thử tìm lại record theo provider + provider_id
        let existingAuth = await SocialAuth.findOne({
          where: {
            provider: provider,
            provider_id: uid,
          },
        });

        // Nếu không tìm thấy, tìm theo user_id + provider
        if (!existingAuth) {
          existingAuth = await SocialAuth.findOne({
            where: {
              user_id: user.id,
              provider: provider,
            },
          });
        }

        if (existingAuth) {
          // Update cả hai trường để đảm bảo sync
          await existingAuth.update({
            user_id: user.id,
            provider_id: uid,
          });
        } else {
          // Nếu vẫn không tìm thấy, log lỗi nhưng tiếp tục (user đã được tạo)
          console.warn('Could not create/update SocialAuth, but user login will continue:', socialAuthError.message);
        }
      } else {
        throw socialAuthError;
      }
    }

    // 4. Tạo JWT Token
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Trả token và thông tin user về cho frontend
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: user.toJSON(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Lỗi social login:", error);
    next(error); // Gửi lỗi đến error handler
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  handleSocialLogin,
};
