const express = require('express');
const activitiesRouter = express.Router();
const { getAllActivities, createActivity } = require("../db")

// GET /api/activities/:activityId/routines

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
    try{const activities = await getAllActivities();
    res.send(activities,)
    } catch(error){
        next(error);
    }
})
// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {
    const{ name, description } = req.body
    try {
        const activity = await createActivity(name, description)
        res.send(activity)
    } catch (error) {
        next(error)
    }
})
// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
