import express from "express";
import cors from "cors";
import http from "http";
const app = express();
const httpApp = new http.Server(app);
const PORT = process.env.PORT || 8000;

app.get("/", (req, res, next) => {
  res.status(200).send("oklm");
});

if (process.env.NODE_ENV === "production") {
  // Static folder
  app.use(express.static(__dirname + "/public/"));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}
httpApp.listen(PORT, () => {
  console.log("Listening on port : http://localhost:" + PORT);
});
