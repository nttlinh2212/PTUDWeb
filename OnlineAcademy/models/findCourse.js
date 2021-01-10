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

};