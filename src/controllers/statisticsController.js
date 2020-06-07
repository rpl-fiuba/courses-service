const expressify = require('expressify')();
const statisticsService = require('../services/statisticsService');

const getUsersActivity = async (req, res) => {
  const { context } = req;
  const { courseId } = req.params;
  const statistics = await statisticsService.getUsersActivity({ context, courseId });

  return res.status(200).json(statistics);
};

module.exports = expressify({
  getUsersActivity
});
