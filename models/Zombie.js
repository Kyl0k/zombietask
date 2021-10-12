const { model, Schema } = require("mongoose");
const { validateItems } = require("../utils");

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    items: {
      type: [{ fixedId: Number, name: String }],
      validate: {
        validator: validateItems,
        propsParameter: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Zombie", schema);
