/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const { getUser, getUserByUsername, createUser } = require("../db");
const jwt = require("jsonwebtoken");

usersRouter.get("/", async (req, res) => {
  const users = await getUser();

  res.send({
    users,
  });
});

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

    const user = await createUser({
      username,
      password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
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
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET);
    if (user && user.password == password) {
      res.send({ message: "you're logged in!", token });
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
usersRouter.get("/", async (req, res) => {
  const users = await getUser();

  res.send({
    users,
  });
});

// GET /api/users/:username/routines
usersRouter.get("/", async (req, res) => {
  const users = await getUser();

  res.send({
    users,
  });
});

module.exports = usersRouter;
