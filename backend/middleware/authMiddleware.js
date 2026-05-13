import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. No token provided.');
  }

  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  const user = await User.findById(decoded.id).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(401, 'Token is valid but user no longer exists.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Contact admin.');
  }

  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      if (user?.isActive) req.user = user;
    } catch {
      // invalid / expired token — continue as guest
    }
  }
  next();
});

export const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Role '${req.user.role}' cannot access this resource.`
      );
    }
    next();
  };
};
