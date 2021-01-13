const db = require('../utils/db');

module.exports = {
    async findALecture(LectureID) {
        const sql = `SELECT * 
        from user u join lecture l on u.UserID = l.LectureID where l.LectureID = ${LectureID}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    async find(UserID) {
        const sql = `select * from user where UserID = ${UserID}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
      
    },
    async findOneByEmail(email) {
        const sql = `SELECT * 
        from user where email like '${email}'`;
        const [rows, fields] = await db.load(sql);
        //console.log(rows,typeof(rows));
        if (rows.length === 0)
            return null;
        return rows[0];
    },

    async addAStudent(student) {
        const [result, fields] = await db.add(student, 'user');
        return result;
    },
    async allStuAndLecturer() {
        const sql = `SELECT * 
        from user where type_of_account <= 1`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async add(user) {
        //console.log(this.findOneByEmail(user.email));
        if (await this.findOneByEmail(user.email)!== null){
            //console.log(this.findOneByEmail(user.email));
            return false;
        }
           
        const [result, fields] = await db.add(user, 'user');
        // console.log(result);
        return true;
      },
    
      async del(id) {
        const condition = {
          UserID: id
        };
        const [result, fields] = await db.del(condition, 'user');
        return result;
      },
    
      async update(entity) {
        const condition = {
            UserID: entity.UserID
        };
        delete (entity.UserID);

        if('email' in entity === true){
            console.log('in undefied');
            if (await this.findOneByEmail(entity.email)!==null)
            return false;
        }
        console.log(entity,condition);
        const [result, fields] = await db.update(entity, condition, 'user');
        return true;
      },
      async updateLecture(entity) {
        const condition = {
            LectureID: entity.LectureID
        };
        delete (entity.UserID);
        console.log(entity,condition);
        const [result, fields] = await db.update(entity, condition, 'lecture');
        return true;
      },
      
};