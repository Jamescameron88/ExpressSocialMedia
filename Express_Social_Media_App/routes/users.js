var express = require("express");
var router = express.Router();
var models = require("../models");
var authService = require("../services/auth");

router.get("/", function (req, res, next) {
  res.redirect("login");
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup", function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username,
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: req.body.password,
      },
    })
    .spread(function (result, created) {
      if (created) {
        res.redirect("login");
      } else {
        res.send("This user already exists");
      }
    });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post("/login", function (req, res, next) {
  models.users
    .findOne({
      where: {
        Username: req.body.username,
      },
    })
    .then((user) => {
      if (!user) {
        console.log("User not found");
        return res.status(401).json({
          message: "Login Failed",
        });
      } else {
        let token = authService.signUser(user);
        if (user) {
          res.cookie("jwt", token);
          res.redirect("/users/profile");
        } else {
          console.log("Wrong password");
          res.send("Wrong password");
        }
      }
    });
});

router.get("/profile", function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then((user) => {
      if (user) {
        models.users
          .findOne({
            where: {
              Username: user.Username,
            },
            include: [
              {
                model: models.posts,
                where: { Deleted: false },
                required: false,
              },
            ],
          })
          .then((userpostsFound) => {
            res.render("profile", { userData: userpostsFound });
          });
      } else {
        res.status(401);
        res.send("Must be logged in");
      }
    });
  }
});

router.get("/admin", function (req, res, next) {
  let authToken = req.cookies.jwt;
  if (authToken) {
    authService.verifyUser(authToken).then((user) => {
      if (user.Admin) {
        models.users
          .findAll({
            where: {
              Deleted: false,
            },
          })
          .then((usersFound) => {
            res.render("admin", { title: "Admin Page", users: usersFound });
          });
      } else {
        res.send("YOU CANT GO HERE!!!");
      }
    });
  }
});

router.post("/admin/delete/:id", function (req, res, next) {
  let userId = parseInt(req.params.id);
  let authToken = req.cookies.jwt;
  if (authToken) {
    authService.verifyUser(authToken).then((user) => {
      if (user.Admin) {
        models.users
          .update({ Deleted: true }, { where: { UserId: userId } })
          .then((user) => res.redirect("/users/admin"));
      } else {
        res.send("You weren'nt supposed to do that..");
      }
    });
  }
});

router.get("/admin/editUser/:id", function (req, res, next) {
  let userId = parseInt(req.params.id);
  let authToken = req.cookies.jwt;
  if (authToken) {
    authService.verifyUser(authToken).then((user) => {
      if (user.Admin) {
        models.users.findOne({
          where: { UserId: userId },
          include: [{ model: models.posts }],
        })
        .then(userpostsFound => {
          res.render('editUser', {userData: userpostsFound});
        })
      }
      else {res.status(401)
      res.send('You cant be here')
      }
    });
  }
});

router.get("/logout", function (req, res, next) {
  res.cookie("jwt", "", { expires: new Date(0) });
  res.redirect("login");
});

module.exports = router;
