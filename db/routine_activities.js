const { createActivity } = require("./activities");
const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
    const newActivity = createActivity();
    const {rows} = await client.query(
      `
      INSERT INTO routines(routineId, activityId, count, duration)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT do nothing
      RETURNING *
      `, [routineId, activityId, count, duration])
      rows.activity = newActivity;
    return rows; 
  } catch (error) {
    console.error("error adding activity to routine")
    throw error
  }
}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
