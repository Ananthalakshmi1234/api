const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dataBasePath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dataBasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Error Message ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const ConvertDbobjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const allPlayersQuery = `select
    *
    from 
    cricket_team;`;
  const players = await db.all(allPlayersQuery);
  console.log(players);
  response.send(players.map((each) => ConvertDbobjectToResponseObject(each)));
});
