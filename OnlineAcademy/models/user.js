const db = require('../utils/db');

module.exports = {
    async findALecture(LectureID) {
        const sql = `SELECT * 
        from user u join lecture l on u.UserID = l.LectureID and l.LectureID = ${LectureID}`;
        const [rows, fields] = await db.load(sql);
        //console.log(rows,typeof(rows));
        return rows;
      },
    
  

};
