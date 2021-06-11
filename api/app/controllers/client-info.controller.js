const db = require("../models");
const ClientInfo = db.clientInfos;

// Create and Save a new ClientInfo
exports.create = (req, res) => {
  if (!req.body.url) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a ClientInfo
  const clientInfo = new ClientInfo({
    url: req.body.url,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  // Save ClientInfo in the database
  clientInfo
    .save(clientInfo)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ClientInfo."
      });
    });

};

// Retrieve all ClientInfos from the database.
exports.findAll = (req, res) => {
  const url = req.query.url;
  var condition = url ? { url: { $regex: new RegExp(url), $options: "i" } } : {};

  ClientInfo.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving clientInfos."
      });
    });
};

// Find a single ClientInfo with an id
exports.findOne = (req, res) => {
  
};

// Update a ClientInfo by the id in the request
exports.update = (req, res) => {
  
};

// Delete a ClientInfo with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all ClientInfos from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published ClientInfos
exports.findAllPublished = (req, res) => {
  
};