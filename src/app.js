const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const configs = require('../configs');
const errorMiddleware = require('./middlewares/errorMiddleware');
const initialMiddleware = require('./middlewares/initialMiddleware');
const requestLoggerMiddleware = require('./middlewares/requestLoggerMiddleware');

const statusController = require('./controllers/statusController');
const coursesController = require('./controllers/coursesController');

const app = express();
const { port } = configs.app;

//  Body parser middleware
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);

// Routes
router.get('/ping', (req, res) => statusController.ping(req, res));

router.use(initialMiddleware);

// Courses
router.get('/courses', coursesController.getCourses);
router.post('/courses', coursesController.addCourse);

// //TODO
// router.get('/courses/{courseId}', coursesController.getCourse);
// router.patch('/courses/{courseId}', coursesController.getCourse);
// router.delete('/courses/{courseId}', coursesController.getCourse);
// router.get('/courses/{courseId}/users', coursesController.getCourses);
// router.post('/courses/{courseId}/users', coursesController.getCourses);
// router.delete('/courses/{courseId}/users/{userId}', coursesController.getCourses);
// router.patch('/courses/{courseId}/users/{userId}', coursesController.getCourses);

// //Guides
// router.get('/courses/{courseId}/guides', coursesController.getCourses);
// router.post('/courses/{courseId}/guides', coursesController.getCourses);
// router.get('/courses/{courseId}/guides/{guideId}', coursesController.getCourses);
// router.patch('/courses/{courseId}/guides/{guideId}', coursesController.getCourses);
// router.delete('/courses/{courseId}/guides/{guideId}', coursesController.getCourses);
// router.get('/courses/{courseId}/guides/{guideId}/exercises', coursesController.getCourses);
// router.post('/courses/{courseId}/guides/{guideId}/exercises', coursesController.getCourses);

// // Exercises Service has the rest of the logic
// router.delete('/courses/{courseId}/guides/{guideId}/exercises/{exerciseId}',
// coursesController.getCourses);


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
