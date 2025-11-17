const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getStoreList,
  rateStore,
  changePassword,
} = require("../controllers/userController");

router.get("/stores", getStoreList);

router.post("/rate", auth(["user"]), rateStore);

router.post("/change-password", auth(["user", "store-owner", "admin"]), changePassword);

module.exports = router;
