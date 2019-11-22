
exports.seed = async (knex) => {
  const currentCourses = await knex('courses').select();
  const currentGuides = await knex('guides').select();
  const currentUsers = await knex('course_users').select();

  // Professors in users service
  const lucas = {
    user_id: '111975156652135962164'
  };
  const diego = {
    user_id: 'diego-id'
  };
  const mendez = {
    user_id: 'mendez-id'
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

  const courses = [{
    course_id: 'analisis-matematico-ii-curso-2',
    name: 'Analisis matematico II - Curso 2',
    description: 'Este es el curso de analisis matematico 2',
    course_status: 'draft',
    password: null,
    created_at: '2019-11-16T20:55:28.423Z',
  }, {
    course_id: 'analisis-matematico-infinito-curso-2',
    name: 'Analisis matematico Infinito - Curso 3',
    description: 'Este es el curso de analisis matemático 3. Donde todas tus dudas se resolverán cursando la materia al menos 6 veces con suerte',
    course_status: 'published',
    password: null,
    created_at: '2019-11-16T20:55:28.423Z',
  }, {
    course_id: 'fisica-ii-curso-2',
    name: 'Fisica II - Curso 2',
    description: 'Curso de Fisica II. Inscribite si estás dispuesto a sufrir, sino anda a jugar a la play',
    course_status: 'published',
    password: null,
    created_at: '2019-11-16T20:55:28.423Z',
  }, {
    course_id: 'algebra-ii-curso-2',
    name: 'Algebra II - Curso 3',
    description: 'Un camino de ida... la gloria o el fracaso los separa un signo',
    course_status: 'published',
    password: 'grymberg',
    created_at: '2019-11-16T20:55:28.423Z',
  }];

  const professors = [{
    ...diego,
    course_id: 'analisis-matematico-ii-curso-2',
    role: 'creator'
  }, {
    ...lucas,
    course_id: 'analisis-matematico-ii-curso-2',
    role: 'professor'
  }, {
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
    ...mendez,
    course_id: 'fisica-ii-curso-2',
    role: 'creator'
  }, {
    ...juanma,
    course_id: 'fisica-ii-curso-2',
    role: 'professor'
  }, {
    ...juanma,
    course_id: 'algebra-ii-curso-2',
    role: 'creator'
  }];

  const students = [{
    ...pillud,
    course_id: 'analisis-matematico-infinito-curso-2',
    role: 'student'
  }, {
    ...licha,
    course_id: 'analisis-matematico-infinito-curso-2',
    role: 'student'
  }];

  if (!currentCourses.length) {
    await knex('courses').insert(courses);
  }
  if (!currentUsers.length) {
    await knex('course_users').insert(professors.concat(students));
  }
  if (!currentGuides.length) {
    await knex('guides').insert([]);
  }
};
