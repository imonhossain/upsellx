module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      url:
      {
        type: String,
        unique: true,
        required: [true, "url required."],
      },
      facebookInfo: Object,
      linkedInInfo: Object,
      twitterInfo: Object,
      posts: Object,
      prices: Object,
      socialLinks: Object,
      copyright: String,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const ClientInfo = mongoose.model("clientInfo", schema);
  return ClientInfo;
};