module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      url: String,
      description: String,
      published: Boolean
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const ClientInfo = mongoose.model("clientInfo", schema);
  return ClientInfo;
};