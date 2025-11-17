const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getDashboardStats,
  addUser,
  addStore,
  listUsers,
  getUserDetails,
  listStores,
} = require("../controllers/adminController");

router.get("/dashboard", auth(["admin"]), getDashboardStats);

router.post("/add-user", auth(["admin"]), addUser);
router.post("/add-store", auth(["admin"]), addStore);

router.get("/users", auth(["admin"]), listUsers);
router.get("/users/:id", auth(["admin"]), getUserDetails);

router.get("/stores", auth(["admin"]), listStores);

module.exports = router;
