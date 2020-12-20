const db = require('../utils/db');

module.exports = {
    async findALecture(LectureID) {
        const sql = `SELECT * 
        from user u join lecture l on u.UserID = l.LectureID where l.LectureID = ${LectureID}`;
        const [rows, fields] = await db.load(sql);
        //console.log(rows,typeof(rows));
        return rows;
      },
    async findOneByEmail(email) {
        const sql = `SELECT * 
        from user where email like '${email}'`;
        const [rows, fields] = await db.load(sql);
        //console.log(rows,typeof(rows));
        return rows;
      },
    
    async addAStudent(student) {
      const [result, fields] = await db.add(user, 'user');
      return result;
      },
  

};
