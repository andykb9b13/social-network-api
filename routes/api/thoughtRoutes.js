const router = require("express").Router();
const { Thought, User, Reaction } = require("../../models");

// GET all thoughts
router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 });
    res.status(200).json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET a single thought by its _id
router.get("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      res.status(404).json({ message: "Thought not found" });
      return;
    }
    res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST to create a new thought
router.post("/", async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: thought._id },
    });
    res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// PUT to update a thought by its _id
router.put("/:thoughtId", async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body,
      { new: true }
    );
    if (!updatedThought) {
      res.status(404).json({ message: "Thought not found" });
      return;
    }
    res.status(200).json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE to remove a thought by its _id
router.delete("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!thought) {
      res.status(404).json({ message: "Thought not found" });
      return;
    }
    await User.findByIdAndUpdate(thought.userId, {
      $pull: { thoughts: thought._id },
    });
    res.status(200).json({ message: "Thought deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// PUT route to update a thought by its _id
router.put("/thoughts/:id", async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedThought) {
      return res
        .status(404)
        .json({ message: "No thought found with this id!" });
    }
    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE route to remove a thought by its _id
router.delete("/thoughts/:id", async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (!deletedThought) {
      return res
        .status(404)
        .json({ message: "No thought found with this id!" });
    }
    // remove the thought from the associated user's thoughts array field
    await User.findByIdAndUpdate(deletedThought.userId, {
      $pull: { thoughts: deletedThought._id },
    });
    // remove all reactions associated with the thought
    await Reaction.deleteMany({ _id: { $in: deletedThought.reactions } });
    res.json(deletedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a reaction to a thought's reactions array
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const reaction = await Reaction.create(req.body);

    const updatedThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: reaction._id } },
      { new: true }
    );

    res.status(200).json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a reaction by its reactionId value
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;

    const updatedThought = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $pull: { reactions: { reactionId } } },
      { new: true }
    );

    if (!updatedThought) {
      return res
        .status(404)
        .json({ message: "No thought found with this id!" });
    }

    await Reaction.findOneAndDelete({ reactionId });

    res.status(200).json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
