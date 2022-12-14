const { User, Thought } = require("../models");

const userController = {
//get all
  getAllUser(req, res) {
    User.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },
//get all by ID
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate([
        { path: "thoughts", select: "-__v" },
        { path: "friends", select: "-__v" },
      ])
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
//create
  createUser({ params, body }, res) {
    console.log(params);
    User.create(body)
      .then((dbUserData) => {
        console.log(dbUserData);
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
//update
  updateUser({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $set: body },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
//delete
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((deletedUser) => {
        if (!deletedUser) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        return Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      })
      .then(() => {
        res.json({ message: "User and user's thoughts have been deleted!" });
      })
      .catch((err) => res.json(err));
  },
//add Friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbFriendData) => {
        if (!dbFriendData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbFriendData);
      })
      .catch((err) => res.json(err));
  },
//remove Friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: { friendId: params.friendId } } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
