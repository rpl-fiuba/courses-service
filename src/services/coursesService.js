const courses = require('../databases/coursesDb')

const getCourses = ({pageNumber}) => {
  return courses.getCourses({pageNumber})
}

module.exports = {
  getCourses
}