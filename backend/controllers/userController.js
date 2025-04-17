const User = require('../models/User');

exports.submitUserData = async (req, res) => {
  try {

    const existingUser = await User.findOne({ cnic: req.body.cnic });
    // console.log(existingUser)
    
    if (existingUser) {
      await User.findOneAndUpdate({ cnic: req.body.cnic }, req.body);
      res.status(200).json({ message: 'User is already registered' });
    } else {
      const newUser = User.create(req.body);
    //   await newUser.save();
    //   console.log(newUser)
      res.status(200).json({ message: 'User data saved' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserByCNIC = async (req, res) => {
    // console.log("sheeraz",req.params.cnic)
  try {
    const user = await User.findOne({ cnic: req.params.cnic });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
