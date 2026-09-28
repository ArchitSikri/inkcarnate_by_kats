const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};


const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = jwt.sign({ id: user._id, type: 'user' }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  res.cookie('user_token', token, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.status(statusCode).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses
    }
  });
};

const pickAddressFields = (data) => ({
  label: data.label,
  fullName: data.fullName,
  phone: data.phone,
  addressLine: data.addressLine,
  landmark: data.landmark,
  city: data.city,
  state: data.state,
  pincode: data.pincode,
  isDefault: data.isDefault
});

const serverError = (res, err) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
};


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, phone, authProvider: 'local' });
    sendAuthResponse(res, user, 201);
  } catch (err) {
    serverError(res, err);
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ message: 'This account uses Google Sign-In. Please login with Google.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }

    sendAuthResponse(res, user);
  } catch (err) {
    serverError(res, err);
  }
};


exports.googleLoginUser = async (req, res) => {
  try {
    const { idToken } = req.body;

    let payload;
    try {
      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ message: 'Google authentication failed' });
    }

    if (!payload.email_verified) {
      return res.status(401).json({ message: 'Google email is not verified' });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email,
        googleId: payload.sub,
        authProvider: 'google'
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }

    sendAuthResponse(res, user);
  } catch (err) {
    serverError(res, err);
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('user_token', cookieOptions);
  res.json({ message: 'Logged out successfully' });
};

exports.getMyProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      addresses: req.user.addresses
    }
  });
};


exports.updateMyProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    res.json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses }
    });
  } catch (err) {
    serverError(res, err);
  }
};


exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAddress = pickAddressFields(req.body);

    if (user.addresses.length === 0) newAddress.isDefault = true;
    if (newAddress.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ addresses: user.addresses });
  } catch (err) {
    serverError(res, err);
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    const updates = pickAddressFields(req.body);
    if (updates.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) address[key] = updates[key];
    });

    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    serverError(res, err);
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    const wasDefault = address.isDefault;
    user.addresses.pull(req.params.addressId);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    serverError(res, err);
  }
};