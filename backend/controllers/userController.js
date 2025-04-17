const User = require('../models/User');

exports.submitUserData = async (req, res) => {
  const {
    cnic,
    employeeNumber,
    email,
    mobile,
    emergencyContact,
    emergencyRelation,
    fullName,
    designation,
    dob,
    address,
    father,
    mother,
    spouse,
    children,
    gender,
    fatherdob,
    
    motherdob,
    // mothercnic,
    spousedob,
   

  } = req.body;
  

    const existingUser = await User.findOne({ cnic: req.body.cnic });
    // console.log(existingUser)
    try{
    if (existingUser) {
      await User.findOneAndUpdate({ cnic: req.body.cnic }, 
        {
          cnic,
          employeeNumber,
          email,
          mobile,
          emergencyContact,
          emergencyRelation,
          fullName,
          designation,
          dob,
          address: {
            house: address.house || '',
            street: address.street || '',
            sector: address.sector || '',
            society: address.society || '',
            district: address.district || ''
          },
          father: {
            name: father.name || '',
            dob: fatherdob || '',
            cnic: father.cnic|| '',
            isDeceased: father.isDeceased || false
          },
          mother: {
            name: mother.name || '',
            dob: motherdob || '',
            cnic: mother.cnic || '',
            isDeceased: mother.isDeceased || false
          },
          spouse: {
            name: spouse.name || '',
            dob: spousedob || '',
            cnic: spouse.cnic || '',
            isMarried: spouse.isMarried || false
          },
          children: children || [],
          gender
        }


      );

      res.status(200).json({ message: 'User is already registered' });
    } else {


     
    
     
        // Create a new user instance and set the values from req.body
        const newUser =  User.create({
          cnic,
          employeeNumber,
          email,
          mobile,
          emergencyContact,
          emergencyRelation,
          fullName,
          designation,
          dob,
          address: {
            house: address.house || '',
            street: address.street || '',
            sector: address.sector || '',
            society: address.society || '',
            district: address.district || ''
          },
          father: {
            name: father.name || '',
            dob: fatherdob || '',
            cnic: father.cnic|| '',
            isDeceased: father.isDeceased || false
          },
          mother: {
            name: mother.name || '',
            dob: motherdob || '',
            cnic: mother.cnic || '',
            isDeceased: mother.isDeceased || false
          },
          spouse: {
            name: spouse.name || '',
            dob: spousedob || '',
            cnic: spouse.cnic || '',
            isMarried: spouse.isMarried || false
          },
          children: children || [],
          gender
        });
    
  
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
