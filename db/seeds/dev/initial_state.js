const userActivity = require('../user_activity');

exports.seed = async (knex) => {
  const currentCourses = await knex('courses').select();
  const currentGuides = await knex('guides').select();
  const currentUsers = await knex('course_users').select();

  // Professors in users service
  const lucas = {
    user_id: '111975156652135962164'
  };
  const diego = {
    user_id: '117307029770597899245'
  };
  const mendez = {
    user_id: 'mendez-id'
  };
  const grymberg = {
    user_id: 'grymberg-id'
  };
  const juanma = {
    user_id: 'juanma-id'
  };

  // Students in users service
  const licha = {
    user_id: 'licha-id'
  };
  const pillud = {
    user_id: 'pillud-id'
  };
  const milito = {
    user_id: 'milito-id'
  };
  const diaz = {
    user_id: 'diaz-id'
  };

  // Courses
  const greatCourses = [{
    course_id: 'analisis-matematico-ii-curso-2',
    name: 'Analisis matematico II - Curso 2',
    description: 'Este es el curso de analisis matematico 2',
    course_status: 'draft',
    password: null,
    created_at: '2019-12-16T20:55:28.423Z',
  }, {
    course_id: 'analisis-matematico-infinito-curso-2',
    name: 'Analisis matematico Infinito - Curso 3',
    description: 'Este es el curso de analisis matemático 3. Donde todas tus dudas se resolverán cursando la materia al menos 6 veces con suerte',
    course_status: 'published',
    password: null,
    created_at: '2019-11-04T20:55:28.423Z',
  }, {
    course_id: 'algo-ii-curso-2',
    name: 'Algoritmos II - Curso Mendez',
    description: 'Curso de Algoritmos II. No tiene nada que ver con matemática pero pintó',
    course_status: 'published',
    password: null,
    created_at: '2019-11-03T20:55:28.423Z',
  }, {
    course_id: 'proba-1',
    name: 'Probabilidad y Estadística I',
    description: 'Curso de Proba I. Inscribite si estás dispuesto a sufrir, sino anda a jugar a la play',
    course_status: 'published',
    password: 'grymberg',
    created_at: '2019-10-22T20:55:28.423Z',
  }, {
    course_id: 'algebra-ii-curso-2',
    name: 'Algebra II - Curso 3',
    description: 'Un camino de ida... la gloria o el fracaso los separa un signo',
    course_status: 'published',
    password: null,
    created_at: '2019-09-11T20:55:28.423Z',
  }];

  // Users
  const usersOfAMII = [{
    ...diego,
    course_id: 'analisis-matematico-ii-curso-2',
    role: 'creator'
  }, {
    ...lucas,
    course_id: 'analisis-matematico-ii-curso-2',
    role: 'professor'
  }];

  const usersOfAMInf = [{
    ...lucas,
    course_id: 'analisis-matematico-infinito-curso-2',
    role: 'creator'
  }, {
    ...diego,
    course_id: 'analisis-matematico-infinito-curso-2',
    role: 'professor'
  }, {
    ...juanma,
    course_id: 'analisis-matematico-infinito-curso-2',
    role: 'professor'
  }, {
    ...mendez,
    course_id: 'analisis-matematico-infinito-curso-2',
    role: 'professor'
  }, {
    ...pillud,
    course_id: 'analisis-matematico-ii-curso-2',
    role: 'student'
  }, {
    ...licha,
    course_id: 'analisis-matematico-ii-curso-2',
    role: 'student'
  }, {
    ...milito,
    course_id: 'analisis-matematico-ii-curso-2',
    role: 'student'
  }, {
    ...diaz,
    course_id: 'analisis-matematico-ii-curso-2',
    role: 'student'
  }];

  const usersOfAlgoII = [{
    ...mendez,
    course_id: 'algo-ii-curso-2',
    role: 'creator'
  }, {
    ...juanma,
    course_id: 'algo-ii-curso-2',
    role: 'student'
  }, {
    ...lucas,
    course_id: 'algo-ii-curso-2',
    role: 'student'
  }, {
    ...diego,
    course_id: 'algo-ii-curso-2',
    role: 'student'
  }];

  const usersOfAlgeII = [{
    ...juanma,
    course_id: 'algebra-ii-curso-2',
    role: 'creator'
  }, {
    ...lucas,
    course_id: 'algebra-ii-curso-2',
    role: 'student'
  }, {
    ...diego,
    course_id: 'algebra-ii-curso-2',
    role: 'student'
  }];

  const usersOfProba = [{
    ...grymberg,
    course_id: 'proba-1',
    role: 'creator'
  }, {
    ...lucas,
    course_id: 'proba-1',
    role: 'student'
  }, {
    ...diego,
    course_id: 'proba-1',
    role: 'student'
  }, {
    ...mendez,
    course_id: 'proba-1',
    role: 'student'
  }];


  // Default courses
  const defaultCourses = [{
    course_id: 'alg-III',
    name: 'Algebra III',
    description: 'Tan difícil como parece',
    course_status: 'published',
    password: null,
    created_at: '2019-08-11T20:55:28.423Z',
  }, {
    course_id: 'alg-IV',
    name: 'Algebra IV',
    description: 'Difícil pero no imposible',
    course_status: 'published',
    password: null,
    created_at: '2019-08-11T20:55:28.423Z',
  }, {
    course_id: 'fisica-cuantica',
    name: 'Física cuántica',
    description: 'Apenas aprobaste física II, y querés meterte acá ?',
    course_status: 'published',
    password: null,
    created_at: '2019-08-11T20:55:28.423Z',
  }, {
    course_id: 'am-easy',
    name: 'Análisis matemático para principiantes',
    description: 'Ideal si no sabés qué es una derivada',
    course_status: 'published',
    password: null,
    created_at: '2019-08-11T20:55:28.423Z',
  }, {
    course_id: 'am-easy-ii',
    name: 'Análisis matemático para principiantes II',
    description: 'Derivadas, integrales y mucho más para divertirse',
    course_status: 'published',
    password: null,
    created_at: '2019-08-11T20:55:28.423Z',
  }, {
    course_id: 'am-medium',
    name: 'Análisis matemático intermedio',
    description: 'Si salís vivo de acá estás listo para la FIUBA',
    course_status: 'published',
    password: null,
    created_at: '2019-08-11T20:55:28.423Z',
  }];

  const idsOfDefaultCourses = ['alg-III', 'alg-IV', 'fisica-cuantica', 'am-easy', 'am-easy-ii', 'am-medium'];
  const usersOfDefaultCourses = idsOfDefaultCourses.reduce((acum, courseId) => {
    const defaultUsers = [{
      ...mendez,
      course_id: courseId,
      role: 'creator'
    }, {
      ...grymberg,
      course_id: courseId,
      role: 'professor'
    }];

    return [
      ...acum,
      ...defaultUsers
    ];
  }, []);


  // Guides
  const defaultGuides = [{ // eslint-disable-line
    guide_id: 'guide-i',
    name: 'Primera guía',
    description: 'Esta es la primera guía que vas a resolver',
    guide_status: 'published'
  }, {
    guide_id: 'guide-ii',
    name: 'Segunda guía',
    description: 'Segunda guía para resolver',
    guide_status: 'published'
  }];

  const especialGuides = [{
    guide_id: 'derivadas',
    name: 'Guía derivadas',
    description: 'Esta es la guía con ejercicios para resolver de derivadas',
    guide_status: 'published'
  }, {
    guide_id: 'integrales',
    name: 'Guía integrales',
    description: 'Esta es la guía con ejercicios para resolver de integrales',
    guide_status: 'published'
  }];

  const guidesForGreatCourses = greatCourses.reduce((acum, course) => {
    const guides = especialGuides.map((guide) => ({
      ...guide,
      course_id: course.course_id
    }));

    return [
      ...acum,
      ...guides
    ];
  }, []);

  const guidesForDefaultCourses = defaultCourses.reduce((acum, course) => {
    const guides = especialGuides.map((guide) => ({
      ...guide,
      course_id: course.course_id
    }));

    return [
      ...acum,
      ...guides
    ];
  }, []);


  // Inserting
  const courses = [
    ...greatCourses,
    ...defaultCourses
  ];

  const users = [
    ...usersOfAMII,
    ...usersOfAMInf,
    ...usersOfAlgeII,
    ...usersOfAlgoII,
    ...usersOfProba,
    ...usersOfDefaultCourses
  ];

  const guides = [
    ...guidesForGreatCourses,
    ...guidesForDefaultCourses
  ];

  if (!currentCourses.length) {
    await knex('courses').insert(courses);
  }
  if (!currentUsers.length) {
    await knex('course_users').insert(users);
  }
  if (!currentGuides.length) {
    await knex('guides').insert(guides);
  }

  await userActivity.addActivityToCourses(knex, courses);
};
