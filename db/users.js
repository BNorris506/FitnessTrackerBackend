const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `,
      [username, password]
    );
    return user;
  } catch (error) {
    console.error("error creating users");
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `
      SELECT username, id
      FROM users`
    );
    return rows;
  } catch (error) {
    console.error("error getting user");
    throw error;
  }
}

async function getUserById(userId) {}

async function getUserByUsername(userName) {}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
