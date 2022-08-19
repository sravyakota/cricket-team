const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "cricketTeam.db");

const db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log(`Server Running at http://localhost:3000/`)
    );
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get(`/players/`, async (request, response) => {
  const getPlayers = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const playerArray = await db.all(getPlayers);
  response.send(playerArray.map((eachplayer)=>convertDbObjectToResponseObject(eachplayer));
});

app.post(`/players/`, async (request, response) => {
  const playerdetails = request.body;
  const { player_name, jersey_number, role } = playerdetails;
  const addPlayerDetails = `INSERT INTO cricket_team 
                            (player_name,jersey_number,role)
                            VALUES (`${playerName}`,`${jerseyNumber}`,`${role}`);`;
  const dbResponse = await db.run(addPlayerDetails);
  const result = response.send("Player Added to Team");
});

app.get(`/players/:playerId/`, async (request, response) => {
  const { playerId } = request.params;
  const getPlayers = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const playerArray = await db.get(getPlayers);
  response.send(convertDbObjectToResponseObject(playerArray));
});

app.put(`/players/:playerId/`, async (request, response) => {
  const { playerId } = request.params;
  const playerdetails = request.body;
  const { player_name, jersey_number, role } = playerdetails;
  const addPlayerDetails = `UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId};`;
  const dbResponse = await db.run(addPlayerDetails);
  const result = response.send("Player Details Updated");
});

app.delete(`/players/:playerId/`, async (request, response) => {
  const { playerId } = request.params;
  const getPlayers = `DELETE  FROM cricket_team WHERE player_id=${playerId};`;
  const playerArray = await db.run(getPlayers);
  response.send("Player Removed");
});
module.exports = app;
