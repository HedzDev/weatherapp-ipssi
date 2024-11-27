const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Not Authorized." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("REQ-USER", req.user);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

/// with bearer token
// const auth = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Not Authorized." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     console.log("REQ-USER", req.user);

//     next();

//   } catch (error) {
//     return res.status(401).json({ message: "Invalid Token" });
//   }
// };

const checkRole = (roles) => {
  return (req, res, next) => {
    console.log("User role:", req.user.role);
    console.log("Required roles:", roles);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Permission denied - You don't have the required role",
      });
    }
    next();
  };
};

module.exports = { auth, checkRole };
