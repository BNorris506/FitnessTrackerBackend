const express = require("express");
const router = express.Router();
const { getUserById } = require("../db")

// GET /api/health
router.get("/health", async (req, res) => {
  res.send({
    message: "it is healthy",
  });
});

// ROUTER: /api/users
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require("./activities");
router.use("/activities", activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require("./routines");
router.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require("./routineActivities");
router.use("/routine_activities", routineActivitiesRouter);

// Authorization
router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  
  if (!auth) { // nothing to see here
      next();
  } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
      
      try {
          const { id } = jwt.verify(token, JWT_SECRET);
          console.log("this is line 39:", id)
          
          if (id) {
              req.user = await getUserById(id);
              next();
          }
      } catch ({ name, message }) {
          next({ name, message });
      }
  } else {
      next({
          name: 'AuthorizationHeaderError',
          message: `Authorization token must start with ${ prefix }`
      });
  }
});

module.exports = router;
