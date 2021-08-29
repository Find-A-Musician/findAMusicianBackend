import express from "express";
import http from "http";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = http.Server(app);

if (process.env.NODE_ENV === "production") {
  // Static folder
  app.use(express.static(__dirname + "/public/"));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}
httpServer.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
