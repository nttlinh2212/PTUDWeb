const db = require('../utils/db');

module.exports = {
  async all() {
    const sql = `select * from course c join user u on c.LectureID = u.UserID join category1 
    cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async allCoursesByCategory1(Cat1ID) {
    const sql = `select * 
    from course c join user u on c.LectureID = u.UserID join category1 
        cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where cat1.Cat1ID = ${Cat1ID}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async allCoursesByCategory2(Cat2ID) {
    const sql = `select * 
    from course c join user u on c.LectureID = u.UserID join category1 
        cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where cat2.Cat2ID = ${Cat2ID}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async top5TheSameCategory1CoursesBuy(CourseID) {
    const course = await this.findACourse(CourseID);
    if (course==null)
        return null;
    const Cat1ID = course.Cat1ID;
    const sql = `SELECT c.number_of_students,c.title,u.full_name,c.star1,c.star2,c.star3,c.star4,c.star5,c.promotional_price,c.price,cat1.Cat1Name,cat2.Cat2Name
    from  course c  join user u on u.userid = c.lectureid join category1 cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where cat1.Cat1ID = ${Cat1ID}
    ORDER BY  c.number_of_students Desc LIMIT 5`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  //by number_of_students registering last week
  async top4HotCoursesLastWeek() {
    const sql = `SELECT count(p.StudentID) as 'NumberofStudentTakingCourseWeek',c.title,u.full_name,c.star1,c.star2,c.star3,c.star4,c.star5,c.promotional_price,c.price,cat1.Cat1Name,cat2.Cat2Name
    from participatingcourse p join course c on p.CourseID = c.CourseID join user u on u.userid = c.lectureid join category1 cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where DATEDIFF(CURRENT_DATE(), date_resgistered ) <= 7
    group by c.CourseID
    ORDER BY  count(p.StudentID) Desc LIMIT 4`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async top10CoursesByViews() {
    const sql = `SELECT c.views,c.title,u.full_name,c.star1,c.star2,c.star3,c.star4,c.star5,c.promotional_price,c.price,cat1.Cat1Name,cat2.Cat2Name
    from  course c  join user u on u.userid = c.lectureid join category1 cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    ORDER BY  c.views Desc LIMIT 10`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async top10NewCourses() {
    const sql = `SELECT c.date_public,c.title,u.full_name,c.star1,c.star2,c.star3,c.star4,c.star5,c.promotional_price,c.price,cat1.Cat1Name,cat2.Cat2Name
    from  course c  join user u on u.userid = c.lectureid join category1 cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    ORDER BY  c.date_public Desc LIMIT 10`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async allfeedback(CourseID) {
    const sql = `select p.*,u.full_name
    from participatingcourse p join course c on p.CourseID = c.CourseID join user u on u.userid = p.studentid
    where p.courseid = ${CourseID} 
    `;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  //fuction search key parameter can be integer(id) or string(title)
  async findACourse(CourseID) {
    
      const sql = `select * from course c join user u on c.LectureID = u.UserID join category1 
      cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID where CourseID = ${CourseID}`;
      const [rows, fields] = await db.load(sql);
      console.log(rows.length);
      if(rows.length===0)
        return null;
      return rows[0];
    },
    
  async add(course) {
    const [result, fields] = await db.add(course, 'course');
    // console.log(result);
    return result;
  },

  async del(id) {
    const condition = {
      id
    };
    const [result, fields] = await db.del(condition, 'course');
    return result;
  },

  async update(course) {
    const condition = {
      id: course.id
    };
    delete (course.id);
    const [result, fields] = await db.update(course, condition, 'course');
    return result;
  }
  ,

  async updateViews(CourseID) {
    const sql = `update course set views = views+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return result;
  },
  async updateNumberOfStudent(CourseID) {
    const sql = `update course set number_of_students = number_of_students+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return result;
  },
  async updateStar1(CourseID) {
    const sql = `update course set star1 = star1+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return result;
  },
  async updateStar2(CourseID) {
    const sql = `update course set star2 = star2+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return result;
  },
  async updateStar3(CourseID) {
    const sql = `update course set star3 = star3+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return result;
  },
  async updateStar4(CourseID) {
    const sql = `update course set star4 = star4+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return result;
  },
  async updateStar5(CourseID) {
    const sql = `update course set star5 = star5+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return result;
  }
};
