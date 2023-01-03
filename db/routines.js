const client = require("./client");

async function createRoutine({ creatorId, ispublic, name, goal }) {
  try {
    const { rows } = await client.query(
      `
    INSERT INTO routines(creatorId, ispublic, name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT do nothing
    RETURNING *
    `, [creatorId, ispublic, name, goal]
    );
    return rows
  } catch (error) {
    console.error("error creating routine")
    throw error
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
    `)
    return rows
  } catch (error) {
    console.error("error getting Routine by Id")
    throw error
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      `SELECT id, creatorId, ispublic, name, goal
      FROM routines
      `
    ); 
    return rows
  } catch (error) {
    console.error("error getting all Routines without Activities")
    throw error
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(
      `
      SELECT * 
      FROM routines
      `
    );
    return rows
  } catch (error) {
    console.error("error getting all Routines")
    throw error
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(
      `
      SELECT * 
      FROM routines
      WHERE ispublic = true
      `
    );
    return rows
  } catch (error) {
    console.error("error getting all public Routines")
    throw error
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE creatorId = ${username.id}
      RETURNING *
      `
    );
    return rows;
  } catch (error) {
    console.error("error getting routines by User")
    throw error
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE creatorId = ${username.id} and ispublic = true
      RETURNING *
      `
    );
    return rows;
  } catch (error) {
    console.error("error getting Public Routines by User")
    throw error
  }
}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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
