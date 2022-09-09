const { User, Thought } = require('../models');

const userController = {
 getAllUser(req, res) {
    User.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
         .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
},
}

module.exports = userController;
