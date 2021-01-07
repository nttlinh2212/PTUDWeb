const db = require('../utils/db');

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
  }

};
