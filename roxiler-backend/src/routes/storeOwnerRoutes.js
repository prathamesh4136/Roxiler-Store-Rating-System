const router = require("express").Router();
const auth = require("../middleware/auth");
const { getMyStoreRatings } = require("../controllers/storeOwnerController");

router.get("/ratings", auth(["store-owner"]), getMyStoreRatings);

module.exports = router;
