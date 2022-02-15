const express = require("express");
const app = express();
const cors = require("cors");
const indexRoutes = require("./src//routes/index");
const { localPort } = require("./bin/config");
const dbConfiguration = require("./bin/db");

const server = require("http").createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/users", async (req, res) => {
  const result = await dbConfiguration.select("*").from("users");
  res.json({
    users: result,
  });
});
//intialize all routes
indexRoutes(app);

const port = process.env.PORT || localPort;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = {
  app,
};
