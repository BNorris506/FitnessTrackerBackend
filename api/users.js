/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const {
  getUser,
  getUserByUsername,
  createUser,
  getPublicRoutinesByUser,
} = require("../db");
const { requireUser } = require("./utils");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// usersRouter.get("/", async (req, res) => {
//   const users = await getUser();

//   res.send({
//     users,
//   });
// });

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    }

    if (password.length < 8) {
      next({
        name: "Password Too Short!",
        message: "Password Too Short!",
      });
    }

    const user = await createUser({
      username,
      password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "thank you for signing up",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});
// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET);
    if (user && user.password == password) {
      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  try {
    const publicRoutines = await getPublicRoutinesByUser({ username });
    // console.log("req it ralph", req.params);
    res.send(publicRoutines);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = usersRouter;
