module.exports = app => {
  const clientInfos = require("../controllers/client-info.controller.js");

  var router = require("express").Router();

  // Create a new ClientInfo
  router.post("/", clientInfos.create);

  // Retrieve all ClientInfos
  router.get("/", clientInfos.findAll);

  // Retrieve all published ClientInfos
  router.get("/published", clientInfos.findAllPublished);

  // Retrieve a single ClientInfo with id
  router.get("/:id", clientInfos.findOne);

  // Update a ClientInfo with id
  router.put("/:id", clientInfos.update);

  // Delete a ClientInfo with id
  router.delete("/:id", clientInfos.delete);

  // Create a new ClientInfo
  router.delete("/", clientInfos.deleteAll);

  app.use('/api/clientInfos', router);
};