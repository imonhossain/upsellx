const db = require("../models");
const ClientInfo = db.clientInfos;
module.exports = {
  saveClientInfo: (data, callBack) => {
    // Create a ClientInfo
    const clientInfo = new ClientInfo({
      url: data.url,
      description: data.description,
      published: data.published ? data.published : false
    });
    return callBack(null, clientInfo);
  },
};
