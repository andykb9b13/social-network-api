const router = require("express").Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

// GET all thoughts
// POST to create a new thought
router.route("/").get(getThoughts).post(createThought);

// GET a single thought by its _id
// PUT to update a thought by its _id
// DELETE to remove a thought by its _id
router
  .route("/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// POST a reaction to a thought's reactions array
router.route("/:thoughtId/reactions").post(createReaction);
// DELETE a reaction to a thought
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

module.exports = router;
