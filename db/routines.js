const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities.js");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    console.error("error creating routine");
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE id = ${id}
      RETURNING *
    `
    );
    return rows;
  } catch (error) {
    console.error("error getting Routine by Id");
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      `SELECT id, "creatorId", "isPublic", name, goal
      FROM routines
      `
    );
    return rows;
  } catch (error) {
    console.error("error getting all Routines without Activities");
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id;
  `);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("not getting all routines", error);
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  WHERE "isPublic" = true;
  `);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("not getting all routines", error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  WHERE username = $1;
  `,
      [username]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("not getting all routines", error);
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  WHERE username = $1 AND "isPublic" = true;
  `,
      [username]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("not getting all routines", error);
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT * FROM routines_activities
      JOIN routines ON routines."routineId" = routine.id
      WHERE "activityId" = $1 AND "isPublic" = true;
  `,
      [id]
    );
    console.log("This is routines:", routines);
    return routines;
  } catch (error) {
    console.error("not getting all routines", error);
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );

    return routine;
  } catch (error) {
    console.error("error updatingRoutine");
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      DELETE FROM routine_activities
      WHERE "routineId" = $1
      `,
      [id]
    );
    const {
      rows: [routine],
    } = await client.query(
      `
      DELETE FROM routines
      WHERE id = $1
      `,
      [id]
    );
    return routine, activity;
  } catch (error) {
    console.error("error destroying routines");
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
