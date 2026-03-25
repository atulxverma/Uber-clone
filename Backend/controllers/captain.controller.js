const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const validationResult = require('express-validator').validationResult;
const blacklistTokenModel = require('../models/blacklistToken.model');


module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if(isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain with this email already exists' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname : fullname.firstname,
        lastname : fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate : vehicle.plate,
        capacity : vehicle.capacity,
        vehicleType : vehicle.vehicleType
    });

    const token = captain.generateAuthToken();
    res.status(201).json({ captain, token });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    const {email, password} = req.body;
    
    const captain = await captainModel.findOne({ email }).select('+password');

    if(!captain) {
        return res.status(401).json({ message: 'Invalid email or passwod'});
    }

    const isMatch = await captain.comparePassword(password);

    if(!isMatch) {
        return res.status(401).json({ message: 'Invalid email or passwod'});
    }

    const token = captain.generateAuthToken();

    res.status(200).json({ captain, token });   

}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({captain: req.captain}); 
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}


module.exports.getCaptainStats = async (req, res) => {
    try {
        const stats = await captainService.getCaptainStats(req.captain._id);
        return res.status(200).json(stats);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.updateCaptainProfile = async (req, res, next) => {
    try {
        const { fullname, vehicle } = req.body;
        
        const updatedCaptain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            { 
                "fullname.firstname": fullname.firstname, 
                "fullname.lastname": fullname.lastname,
                "vehicle.plate": vehicle.plate,
                "vehicle.color": vehicle.color 
            },
            { new: true } // Return updated doc
        );

        res.status(200).json(updatedCaptain);
    } catch (err) {
        res.status(500).json({ message: "Failed to update profile" });
    }
};