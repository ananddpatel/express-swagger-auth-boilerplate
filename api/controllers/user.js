const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

function registerUser(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(500).send({
        message: "email and password required."
    });
  } else {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    user.save().then(u => {
        const cleanedUser = {
          email: u.email
        };
        const token = jwt.sign(cleanedUser, process.env.SECRET_KEY, {
          expiresIn: 86400
        });
        res.send({ token: token });
      })
      .catch(err => {
        return res
          .status(500).send({ message: "email already exists.", err: err });
      });
  }
}

function authenticateUser(req, res) {
    const email = req.swagger.params.request.value.email
    const password = req.swagger.params.request.value.password
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            throw err;
        }
        if (user) {
            user.comparePassword(password, (err, matched) => {
                if (!err && matched) {
                    const cleanedUser = {
                        email: user.email,
                    }
                    const token = jwt.sign(cleanedUser, process.env.SECRET_KEY, {
                        expiresIn: 86400
                    });
                    res.send({ token: token });
                } else {
                    res.status(500).send({ message: "password did not match" });
                }
            });
        }
    });
}

router.get(
    "/dashboard",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.send({ id: req.user._id, role: req.user.role });
    }
  );

module.exports = {
    registerUser: registerUser,
    authenticateUser: authenticateUser
}