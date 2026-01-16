const router = require("express").Router();
const auth = require("../middleware/Design"); // JWT middleware
const controller = require("../controllers/Designauth");

router.use(auth);

router.get("/", controller.getDesigns);
router.post("/", controller.createDesign);
router.put("/:id", controller.updateDesign);
router.delete("/:id", controller.deleteDesign);

module.exports = router;
