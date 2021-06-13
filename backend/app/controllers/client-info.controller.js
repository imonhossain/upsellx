const db = require("../models");
const ClientInfo = db.clientInfos;
const { saveClientInfo } = require('../services/client-info.services')
// Create and Save a new ClientInfo
exports.create = (req, res) => {
  if (!req.body.url) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a ClientInfo
  saveClientInfo(req.body, (err, results) => {
    // Save ClientInfo in the database
    //console.log("results", results);
    results
      .save(results)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the ClientInfo."
        });
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
  const id = req.params.id;
  console.log("req", req.params);
  ClientInfo.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Clients with id=${id}. Maybe Clients was not found!`
        });
      } else {
        res.send({
          message: "Clients was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Clients with id=" + id
      });
    });
};

// Delete all ClientInfos from the database.
exports.deleteAll = (req, res) => {

};

// Find all published ClientInfos
exports.findAllPublished = (req, res) => {

};