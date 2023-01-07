const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  try {
    // const activity = await getActivityById(activityId);
    const publicRoutines = await getPublicRoutinesByActivity({ activityId });
    // console.log("req it ralph", req.params);
    res.send(publicRoutines);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});
// POST /api/activities
activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  const activityId = req.user.id;
  const activityData = { activityId, name, description };
  try {
    const activity = await createActivity(activityData);
    if (activity) {
      res.send({ activity });
    }
  } catch (error) {
    next(error);
  }
});
// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
