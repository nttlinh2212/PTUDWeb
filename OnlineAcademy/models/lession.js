const db = require('../utils/db');
const { getSecond } = require('../utils/helpers');
const { findACourse } = require('./course');

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
    //console.log(rows.length);
    if(rows.length===0)
      return null;
    return rows[0];
  },
  async updateLastLession(LessionID,CourseID,StudentID) {
    
    const sql = `update participatingcourse set last_lession = ${LessionID} where courseid = ${CourseID} and studentid = ${StudentID} `;
    //console.log(sql);
    const [result, fields] = await db.load(sql);
    //console.log(result);
    return result;
  },
  async getLastLession(CourseID,StudentID) {
    
    const sql = `select l.*,s.* from participatingcourse p inner join lessionscourse l on p.last_lession = l.lessionid inner join sectionscourse s on s.sectionid = l.sectionid  where p.courseid = ${CourseID} and p.studentid = ${StudentID} `;
    const [rows, fields] = await db.load(sql);
    console.log(sql,rows);
    if(rows.length===0)
      return null;
    return rows[0];
  },
  async getPercentageCompleting(CourseID,StudentID) {
    let count = 0;
    const sql = `select count(*) as total from historywatch h inner join lessionscourse l on h.lessionid = l.lessionid 
    inner join sectionscourse s on s.sectionid = l.sectionid 
    where s.courseid = ${CourseID} and h.studentid = ${StudentID} and h.done = 1 `;
    const [rows, fields] = await db.load(sql);
    console.log(sql,rows);
    if(rows.length!==0)
      count = rows[0].total;
    const course = await findACourse(CourseID);
    console.log(count,'/',course.num_lessions,'count/numlession');
    if(course!==null)
      return Math.round(count*100/course.num_lessions);
    return(0);
  },
  async addALession(lesion) {
    const [result, fields] = await db.add(lesion, 'lessionscourse');
    return result;
  },
  async addASection(section) {
    const [result, fields] = await db.add(section, 'sectionscourse');
    return result;
  },
};
