const express = require("express");
const router = express.Router();
const zombieController = require("../controllers/zombieController");
const { validate } = require("express-validation");
const { validation } = require("../utils");

router
  .route("/zombie")
  .post(validate(validation.zombieName), zombieController.createZombie);

router.route("/zombies").get(zombieController.getZombies);

router
  .route("/zombie/:zombieId")
  .get(zombieController.getZombieById)
  .delete(zombieController.removeZombieById)
  .put(validate(validation.zombieName), zombieController.editZombieById);

router
  .route("/zombie/:zombieId/value")
  .get(zombieController.getZombieValueById);

router
  .route("/zombie/:zombieId/:itemId")
  .put(zombieController.addItemToZombieById)
  .delete(zombieController.removeItemFromZombieById);

module.exports = router;
