const db = require('../utils/db');
const { getSecond } = require('../utils/helpers');

module.exports = {
  async allLessonsAndSections(CourseID) {
    const sql = `select * from sectionscourse where courseid = ${CourseID} `;
    const [sections, fields] = await db.load(sql);
    let res = [];
    for (const s of sections) {
        let temp = {section:s};
        const sql = `select * from lessionscourse where sectionid = ${s.sectionid} `;
        const [ls, fields] = await db.load(sql);
        temp.lessions = ls;
        console.log(temp);
        res.push(temp)
    }
    return res;
  },
  async findALessionHistory(LessionID,StudentID) {
    const sql = `select * from historywatch where lessionid = ${LessionID} and studentid = ${StudentID}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows.length);
    if(rows.length===0)
      return null;
    return rows[0];
  },
  async updateALessionHistory(entity) {
    
    const condition = {
      lessionid: entity.lessionid,
      studentid:entity.studentid
    };
    delete (entity.lessionid);
    delete (entity.studentid);
    console.log(entity,condition);
    entity.last_point = Math.floor(entity.last_point);

    //INSERT INTO table (id, name, age) VALUES(1, "A", 19) ON DUPLICATE KEY UPDATE  name="A", age=19
    //const sql = `update historywatch set last_point = ${+entity.last_point} and done = ${entity.done} where lessionid = ${condition.lessionid} and studentid = ${condition.studentid}`;
    const sql = `INSERT INTO historywatch value (${condition.lessionid},${condition.studentid}, ${entity.last_point},${entity.done}) 
    ON DUPLICATE KEY UPDATE last_point = ${entity.last_point}, done = ${entity.done}`;
    //console.log(sql);
    const [result, fields] = await db.load(sql);
    //console.log(result);
    return result;
  },
  async findALession(LessionID) {
    
    const sql = `select * from lessionscourse where lessionid = ${LessionID}`;
    const [rows, fields] = await db.load(sql);
    console.log(rows.length);
    if(rows.length===0)
      return null;
    return rows[0];
  }
};
