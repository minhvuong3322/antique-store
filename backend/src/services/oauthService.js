const { User, SocialAuth } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const config = require('../config/app');
const logger = require('../../utils/logger');

// Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Xác thực Google ID Token
 */
const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        return ticket.getPayload();
    } catch (error) {
        logger.logError(error, { operation: 'verifyGoogleToken' });
        throw new Error('Invalid Google token');
    }
};

/**
 * Xác thực Facebook Access Token
 */
const verifyFacebookToken = async (accessToken, userID) => {
    try {
        const url = `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error || data.id !== userID) {
            throw new Error('Invalid Facebook token');
        }

        return data;
    } catch (error) {
        logger.logError(error, { operation: 'verifyFacebookToken' });
        throw new Error('Invalid Facebook token');
    }
};

/**
 * Đăng nhập/Đăng ký với Google
 */
const googleLogin = async (idToken) => {
    try {
        // Verify Google token
        const googleUser = await verifyGoogleToken(idToken);

        // Tìm hoặc tạo SocialAuth
        let socialAuth = await SocialAuth.findOne({
            where: {
                provider: 'google',
                provider_id: googleUser.sub
            },
            include: [{
                model: User,
                as: 'user'
            }]
        });

        let user;

        if (socialAuth) {
            // User đã tồn tại
            user = socialAuth.user;

            // Cập nhật thông tin OAuth
            await socialAuth.update({
                access_token: idToken,
                profile_data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    picture: googleUser.picture
                },
                expires_at: new Date(googleUser.exp * 1000)
            });
        } else {
            // Tạo user mới
            // Kiểm tra email đã tồn tại chưa
            user = await User.findOne({
                where: { email: googleUser.email }
            });

            if (!user) {
                user = await User.create({
                    email: googleUser.email,
                    full_name: googleUser.name,
                    password: Math.random().toString(36).slice(-12), // Random password (không dùng)
                    avatar: googleUser.picture,
                    role: 'customer'
                });
            }

            // Tạo SocialAuth
            socialAuth = await SocialAuth.create({
                user_id: user.id,
                provider: 'google',
                provider_id: googleUser.sub,
                access_token: idToken,
                profile_data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    picture: googleUser.picture
                },
                expires_at: new Date(googleUser.exp * 1000)
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expire }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                avatar: user.avatar,
                role: user.role
            }
        };
    } catch (error) {
        logger.logError(error, { operation: 'googleLogin' });
        throw error;
    }
};

/**
 * Đăng nhập/Đăng ký với Facebook
 */
const facebookLogin = async (accessToken, userID) => {
    try {
        // Verify Facebook token
        const fbUser = await verifyFacebookToken(accessToken, userID);

        // Tìm hoặc tạo SocialAuth
        let socialAuth = await SocialAuth.findOne({
            where: {
                provider: 'facebook',
                provider_id: fbUser.id
            },
            include: [{
                model: User,
                as: 'user'
            }]
        });

        let user;

        if (socialAuth) {
            // User đã tồn tại
            user = socialAuth.user;

            // Cập nhật thông tin OAuth
            await socialAuth.update({
                access_token: accessToken,
                profile_data: {
                    email: fbUser.email,
                    name: fbUser.name,
                    picture: fbUser.picture?.data?.url
                }
            });
        } else {
            // Kiểm tra email đã tồn tại chưa
            user = await User.findOne({
                where: { email: fbUser.email }
            });

            if (!user) {
                user = await User.create({
                    email: fbUser.email || `fb_${fbUser.id}@facebook.com`, // Fallback nếu không có email
                    full_name: fbUser.name,
                    password: Math.random().toString(36).slice(-12), // Random password
                    avatar: fbUser.picture?.data?.url,
                    role: 'customer'
                });
            }

            // Tạo SocialAuth
            socialAuth = await SocialAuth.create({
                user_id: user.id,
                provider: 'facebook',
                provider_id: fbUser.id,
                access_token: accessToken,
                profile_data: {
                    email: fbUser.email,
                    name: fbUser.name,
                    picture: fbUser.picture?.data?.url
                }
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expire }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                avatar: user.avatar,
                role: user.role
            }
        };
    } catch (error) {
        logger.logError(error, { operation: 'facebookLogin' });
        throw error;
    }
};

module.exports = {
    googleLogin,
    facebookLogin,
    verifyGoogleToken,
    verifyFacebookToken
};




