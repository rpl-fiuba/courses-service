const express = require('express');
const cors = require('cors');

const router = express.Router();
const bodyParser = require('body-parser');

const configs = require('./configs')();
const errorMiddleware = require('./middlewares/errorMiddleware');
const userActivityMiddleware = require('./middlewares/userActivityMiddleware');
const courseCheckMiddleware = require('./middlewares/courseCheckMiddleware');
const initialMiddleware = require('./middlewares/initialMiddleware');
const requestLoggerMiddleware = require('./middlewares/requestLoggerMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');

const statusController = require('./controllers/statusController');
const coursesController = require('./controllers/coursesController');
const usersController = require('./controllers/usersController');
const guidesController = require('./controllers/guidesController');
const statisticsController = require('./controllers/statisticsController');

const app = express();
const { port } = configs.app;

app.use(cors());

//  Body parser middleware
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);

// Routes
router.get('/ping', (req, res) => statusController.ping(req, res));

router.use(initialMiddleware);
router.use(authMiddleware);

// Courses
router.get('/courses/search', coursesController.searchCourses);
router.get('/courses', coursesController.getUserCourses);
router.post('/courses', coursesController.addCourse);

router.use('/courses/:courseId/', courseCheckMiddleware);
router.use('/courses/:courseId/', userActivityMiddleware);

router.get('/courses/:courseId', coursesController.getCourse);
router.put('/courses/:courseId', coursesController.updateCourse);
router.put('/courses/:courseId/publish', coursesController.publishCourse);
router.post('/courses/:courseId/copy', coursesController.copyCourse);
router.delete('/courses/:courseId', coursesController.deleteCourse);

// Users
router.get('/courses/:courseId/users', usersController.getUsersFromCourse);
router.get('/courses/:courseId/users/statistics/activity', statisticsController.getUsersActivity);
router.post('/courses/:courseId/users', usersController.addUserToCourse);
router.delete('/courses/:courseId/users/:userId', usersController.deleteUserFromCourse);
router.put('/courses/:courseId/users/:userId', usersController.updateUser);
router.get('/courses/:courseId/users/:userId', usersController.getUser);

// Guides
router.get('/courses/:courseId/guides', guidesController.getGuides);
router.post('/courses/:courseId/guides', guidesController.addGuide);
router.get('/courses/:courseId/guides/:guideId', guidesController.getGuide);
router.put('/courses/:courseId/guides/:guideId', guidesController.updateGuide);
router.delete('/courses/:courseId/guides/:guideId', guidesController.deleteGuide);


app.use(router);

app.use(errorMiddleware);

//  Setting the invalid enpoint message for any other route
app.get('*', (req, res) => {
  res.status(400).json({ message: 'Invalid endpoint' });
});

//  Start server on port
const server = app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

module.exports = {
  server
};
