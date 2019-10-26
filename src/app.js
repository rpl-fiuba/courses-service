const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const configs = require('./configs')();
const errorMiddleware = require('./middlewares/errorMiddleware');
const initialMiddleware = require('./middlewares/initialMiddleware');
const requestLoggerMiddleware = require('./middlewares/requestLoggerMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');

const statusController = require('./controllers/statusController');
const coursesController = require('./controllers/coursesController');
const usersController = require('./controllers/usersController');
const guidesController = require('./controllers/guidesController');

const app = express();
const { port } = configs.app;

//  Body parser middleware
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);

// Routes
router.get('/ping', (req, res) => statusController.ping(req, res));

router.use(initialMiddleware);
router.use(authMiddleware);

// Courses
router.get('/courses', coursesController.getCourses);
router.get('/my-courses', coursesController.getUserCourses);
router.post('/courses', coursesController.addCourse);
router.get('/courses/:courseId', coursesController.getCourse);
router.put('/courses/:courseId', coursesController.updateCourse);
router.delete('/courses/:courseId', coursesController.deleteCourse);

// Users
router.get('/courses/:courseId/users', usersController.getUsers);
router.get('/courses/:courseId/users/:userId', usersController.getUser);
router.post('/courses/:courseId/users', usersController.addUser);
router.delete('/courses/:courseId/users/:userId', usersController.deleteUser);
router.put('/courses/:courseId/users/:userId', usersController.updateUser);

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
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
