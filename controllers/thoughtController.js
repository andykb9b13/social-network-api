const { Thought, User } = require("../models");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().sort({ createdAt: -1 });
      res.status(200).json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
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
  },
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      res.status(200).json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
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
  },
  async deleteThought(req, res) {
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
  },
  async createReaction(req, res) {
    try {
      const reaction = req.body;
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: reaction } },
        { new: true }
      );
      res.status(200).json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteReaction(req, res) {
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
      res.status(200).json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
