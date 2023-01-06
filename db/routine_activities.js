const { createActivity } = require("./activities");
const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [routineId, activityId, count, duration]
    );
    return routine;
  } catch (error) {
    console.error("error adding activity to routine");
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE id = ${id}
  `
    );
    return routine_activity;
  } catch (error) {
    console.error("error getting Routine by Id");
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activity } = await client.query(
      `
      SELECT *
      FROM routine_activities
      JOIN routines ON routine_activities."routineId"=routines.id
      WHERE "routineId" = $1
    `,
      [id]
    );
    return routine_activity;
  } catch (error) {
    console.error("error getting Routine by Id");
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routine_activities],
    } = await client.query(
      `
    UPDATE routine_activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );

    return routine_activities;
  } catch (error) {
    console.error("error updating Routine Activities");
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      DELETE FROM routine_activities
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );
    return routine_activity;
  } catch (error) {
    console.error("error destroying routine activities");
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
  SELECT *
  FROM routine_activities
  JOIN routines ON routine_activities."routineId" = routines.id AND routine_activities.id=$1
  `,
      [routineActivityId]
    );
    return userId === routine_activity.creatorId;
  } catch (error) {
    console.error("error editing routine activity");
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
