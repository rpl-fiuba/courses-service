const courses = require('../databases/coursesDb')

const getCourses = ({page}) => {
  return courses.getCourses({page, limit});
}

const addCourse = ({description, name}) => {
  const id = name.toLowerCase().replace(' ', '');
  courses.addCourse({
    
  })
}

module.exports = {
  getCourses
}