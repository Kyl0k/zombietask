const { catchAsync, ZombieError, ifNotFound } = require("../utils");
const Zombie = require("../models/Zombie");
const axios = require("axios");

exports.createZombie = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const zombie = new Zombie({ name });
  await zombie.save();
  return res.status(201).json({
    status: "success",
    data: { zombie },
  });
});

exports.getZombies = catchAsync(async (req, res, next) => {
  const zombies = await Zombie.find({});
  return res.status(200).json({
    status: "success",
    data: { zombies },
  });
});

exports.getZombieItems = catchAsync(async (req, res, next) => {
  const {
    params: { zombieId },
  } = req;
  const zombie = await Zombie.find(zombieId).select(["items"]);
  ifNotFound(zombie, "Zombie");
  const { _id, ...zombieDetails } = JSON.parse(JSON.stringify(zombie));
  return res.status(200).json({
    status: "success",
    data: { zombieDetails },
  });
});

exports.editZombieById = catchAsync(async (req, res, next) => {
  const {
    params: { zombieId },
    body: { name },
  } = req;
  const zombie = await Zombie.findByIdAndUpdate(
    zombieId,
    { name },
    {
      new: true,
    }
  );
  ifNotFound(zombie, "Zombie");
  return res.status(200).json({
    staus: "success",
    data: { zombie },
  });
});

exports.removeZombieById = catchAsync(async (req, res, next) => {
  const { zombieId } = req.params;
  console.log(zombieId);
  const zombie = await Zombie.findByIdAndRemove(zombieId);
  ifNotFound(zombie, "Zombie");
  return res.status(200).json({
    status: "success",
    message: "Your zombie has been removed",
  });
});

exports.getZombieById = catchAsync(async (req, res, next) => {
  const { zombieId } = req.params;
  const zombie = await Zombie.findById(zombieId).select(["name", "createdAt"]);
  const { _id, ...zombieDetails } = JSON.parse(JSON.stringify(zombie));
  ifNotFound(zombie, "Zombie");
  return res.status(200).json({
    status: "success",
    data: { zombie: zombieDetails },
  });
});

exports.addItemToZombieById = catchAsync(async (req, res, next) => {
  const { zombieId, itemId } = req.params;
  const zombie = await Zombie.findById(zombieId);
  const items = (
    await axios.get("https://zombie-items-api.herokuapp.com/api/items")
  ).data;
  const item = items.items.find((item) => item.id === parseInt(itemId));
  ifNotFound(zombie, "Zombie");
  ifNotFound(item, "Item");
  const { price, id, name } = item;
  zombie.items.push({ fixedId: id, name });
  await zombie.save();
  return res.status(200).json({
    status: "success",
    data: { zombie },
  });
});

exports.removeItemFromZombieById = catchAsync(async (req, res, next) => {
  const { zombieId, itemId } = req.params;
  const zombie = await Zombie.findById(zombieId);
  ifNotFound(zombie, "Zombie");
  const itemIndex = zombie.items.findIndex((item) => item._id == itemId);
  if (itemIndex === -1) {
    throw new ZombieError("Item not found", 404);
  }
  zombie.items.splice(itemIndex, 1);
  await zombie.save();
  return res.status(200).json({
    status: "success",
    data: { zombie },
  });
});

exports.getZombieValueById = catchAsync(async (req, res, next) => {
  const { zombieId } = req.params;
  const zombie = await Zombie.findById(zombieId);
  ifNotFound(zombie, "Zombie");
  const shopItems = (
    await axios.get("https://zombie-items-api.herokuapp.com/api/items")
  ).data.items;
  const currencies = (
    await axios.get("http://api.nbp.pl/api/exchangerates/tables/C/today/")
  ).data[0].rates;
  const usd = currencies.find((curr) => curr.code === "USD");
  const eur = currencies.find((curr) => curr.code === "EUR");
  if (zombie.items.length > 0) {
    const prices = zombie.items.map((item) => {
      for (const shopItem of shopItems) {
        if (item.fixedId === shopItem.id) return shopItem.price;
      }
    });
    const value = prices.reduce((prev, curr) => prev + curr, 0);
    const valueInEur = (value / eur.ask).toFixed(2);
    const valueInUSD = (value / usd.ask).toFixed(2);
    const totalValues = {
      pln: `${value} PLN`,
      eur: `${valueInEur} EUR`,
      usd: `${valueInUSD} USD`,
    };
    return res.status(200).json({
      status: "success",
      data: {
        description: "Total value of zombie in selcted currencies",
        totalValues,
      },
    });
  }
  return res.status(200).json({
    status: "success",
    data: {
      description: "Your zombie stinks",
      totalValue: 0,
    },
  });
});
