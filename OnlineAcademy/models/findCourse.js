const db = require('../utils/db');

module.exports = {
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
  async findACourseInParticipating(CourseID) {
      
    const sql = `select * from participatingcourse where CourseID = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    console.log(rows.length);
    if(rows.length===0)
      return null;
    return rows[0];
},

async allCoursesByCatAndLecturer(Cat1ID,Cat2ID,LectureID) {
  
  let sql = `select * 
  from course c join user u on c.LectureID = u.UserID join category1 
      cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
  where `;
  if(Cat1ID!== null){
    sql+= `cat1.Cat1ID = ${Cat1ID} `
      if(Cat2ID!==null){
      sql+= `and cat2.Cat2ID = ${Cat2ID} `
      } 
      if(LectureID!==null){
        sql+= `and u.UserID = ${LectureID} `
      }
  }
  else{
      if(Cat2ID!==null){
        sql+= `cat2.Cat2ID = ${Cat2ID} `
        if(LectureID!==null){
          sql+= `and u.UserID = ${LectureID} `
        }
      } else {
        if(LectureID!==null){
          sql+= `u.UserID = ${LectureID} `
      }
    }
  }
  console.log(sql);
  const [rows, fields] = await db.load(sql);
  return rows;
},

async findACourseInWatchList(CourseID,StudentID) {
      
  const sql = `select * from watchlist where CourseID = ${CourseID} and StudentID = ${StudentID}`;
  const [rows, fields] = await db.load(sql);
  console.log(rows.length);
  if(rows.length===0)
    return null;
  return rows[0];
},
async addPart(entity) {
      
  const [result, fields] = await db.add(entity, 'participatingcourse');
    // console.log(result);
  return result;
},

async update(course) {
  const condition = {
    CourseID: course.CourseID
  };
  delete (course.CourseID);
  const [result, fields] = await db.update(course, condition, 'course');
  return result;
},
async updateParticipating(feedback) {//update course set views = views+1 where courseid = ${CourseID}
  const sql = `update participatingcourse set star = ${feedback.star}, review = '${feedback.review}', date_review = ${feedback.date_review} where CourseID = ${feedback.CourseID} and StudentID = ${feedback.StudentID}`;
  const [rows, fields] = await db.load(sql);
  console.log(rows.length);
  return true;
}
};