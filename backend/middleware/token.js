const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config/config");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "7h" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

module.exports = { generateTokens };