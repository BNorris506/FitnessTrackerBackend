const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  try {
    const { rows: [activities] } = await client.query(
      `
      INSERT INTO activities(name, description)
      VALUES ($1, $2)
      RETURNING *;
      `, [name, description]
    );
    console.log("Here are the rows in line 13", activities)
    return activities
  } catch (error) {
    console.error("error creating activity")
    throw error
  }
}

async function getAllActivities() {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM activities
      `
    );
    return rows;
  } catch (error) {
    console.error("error getting all Activities")
    throw error
  }
}

async function getActivityById(id) {
  try {
    const { rows: [ activity ] } = await client.query(
      `
      SELECT * 
      FROM activities
      WHERE id=${id}`
    );
    return activity
    } catch (error) {
    console.error("error getting Activity by Id");
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activities] } = await client.query(
      `
      SELECT * 
      FROM activities
      WHERE name = $1
      `, [name]
    )
    return activities
  } catch (error) {
    console.error("error getting activity by name")
    throw error
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

async function updateActivity({ id, ...fields })  {
  // build the set string
  const setString = Object.keys(fields).map(
    //map through the fields array and give me the keys on each field
    (key, index) => `"${ key }"=$${ index + 1 }`
    //then write out "the key value" = $ "the index position +1 "
    //why +1? PSQL doesn't use 0 index here so first position is 1 not 0. 
    //example:  "name = $1"
  ).join(', '); //Join it all together with a , and a space
//   The string above is to get the necessary string for psql for each item (don't want to hard code)

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ activity ] } = await client.query(`
      UPDATE activities
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
