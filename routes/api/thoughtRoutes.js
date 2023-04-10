const router = require("express").Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
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

// DELETE route to remove a thought by its _id
// router.delete("/thoughts/:id", async (req, res) => {
//   try {
//     const deletedThought = await Thought.findByIdAndDelete(req.params.id);
//     if (!deletedThought) {
//       return res
//         .status(404)
//         .json({ message: "No thought found with this id!" });
//     }
//     // remove the thought from the associated user's thoughts array field
//     await User.findByIdAndUpdate(deletedThought.userId, {
//       $pull: { thoughts: deletedThought._id },
//     });
//     // remove all reactions associated with the thought
//     await Reaction.deleteMany({ _id: { $in: deletedThought.reactions } });
//     res.json(deletedThought);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // DELETE a reaction by its reactionId value
// router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
//   try {
//     const { thoughtId, reactionId } = req.params;

//     const updatedThought = await Thought.findOneAndUpdate(
//       { _id: thoughtId },
//       { $pull: { reactions: { reactionId } } },
//       { new: true }
//     );

//     if (!updatedThought) {
//       return res
//         .status(404)
//         .json({ message: "No thought found with this id!" });
//     }

//     await Reaction.findOneAndDelete({ reactionId });

//     res.status(200).json(updatedThought);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
