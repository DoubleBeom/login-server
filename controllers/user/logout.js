const { auth } = require('../../middleware/auth');
const { User } = require('../../models/User');

module.exports = async (req, res, next) => {
  User.findOneAndDelete(
    {
      _id: req.user._id,
    },
    { token: '' },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
};
