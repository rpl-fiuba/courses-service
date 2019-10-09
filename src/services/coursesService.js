const courses = require('../databases/coursesDb')

const getCourses = ({page}) => {
  return courses.getCourses({page, limit})
}

module.exports = {
  getCourses
}