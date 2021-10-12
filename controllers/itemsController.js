const axios = require("axios");
const { catchAsync } = require("../utils");

exports.getItems = catchAsync(async (req, res, next) => {
  const items = (
    await axios.get("https://zombie-items-api.herokuapp.com/api/items")
  ).data;
  return res.status(200).json({
    status: "success",
    data: items,
  });
});
