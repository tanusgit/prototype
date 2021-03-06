const passport = require("../passport/index");
const jwt = require("jsonwebtoken");
const {
  production: { SECERT, REDIRECT },
} = require("../config");
/**
 * Authentication api
 */

const authAPI = (app) => {
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: REDIRECT }), function (req, res) {
    var token = jwt.sign({ email: req.user.email }, SECERT, { expiresIn: "5h" });
    res.cookie("token", token, {
      domain: "",
      httpOnly: false,
      secure: false,
      sameSite: "none",
      maxAge: 86400000, // 24 hour
    });
    return res.status(200).redirect(REDIRECT);
  });

  app.get("/auth/google/logout", (req, res)=> {
    res.clearCookie("token");;
    return res.status(200).redirect(REDIRECT);
  });
};

module.exports = authAPI;
