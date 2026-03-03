const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const rideModel = require('../models/ride.model');

module.exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalCaptains = await captainModel.countDocuments();
        const totalRides = await rideModel.countDocuments();
        const completedRides = await rideModel.countDocuments({ status: 'completed' });
        const revenue = await rideModel.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$fare' } } }
        ]);

        const recentRides = await rideModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'fullname email')
            .populate('captainId', 'fullname vehicle');

        res.status(200).json({
            totalUsers,
            totalCaptains,
            totalRides,
            completedRides,
            totalRevenue: revenue[0]?.total || 0,
            recentRides
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};