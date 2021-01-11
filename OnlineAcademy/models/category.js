const db = require('../utils/db');
const { allCoursesByCategory1, allCoursesByCategory2 } = require('./course');

module.exports = {
  async allCat1() {
    const sql = 'select * from category1';
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async allCat2(Cat1ID) {
    const sql = `select * from category2 where Cat1ID = ${Cat1ID}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async top4Cat1BuyLastWeek() {
    const sql = `
    SELECT count(p.StudentID) as 'Number', cat1.Cat1Name,c.cat1id
    from participatingcourse p join course c on p.CourseID = c.CourseID join user u on u.userid = c.lectureid join category1 cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where DATEDIFF(CURRENT_DATE(), date_resgistered ) <= 7
    group by c.cat1id,cat1.Cat1Name
    ORDER BY  count(p.StudentID) Desc LIMIT 4
    `;
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async findCat1(Cat1ID) {
    const sql = `select * from category1
    where Cat1ID =${Cat1ID} `;
    const [rows, fields] = await db.load(sql);
    if(rows.length===0)
        return null;
      return rows[0];
  },
  async findCat2(Cat2ID) {
    const sql = `select * from category2 where Cat2ID = ${Cat2ID}`;
    const [rows, fields] = await db.load(sql);
    if(rows.length===0)
        return null;
      return rows[0];
  
  },

  async addCat2(category2) {
    const [result, fields] = await db.add(category2, 'Category2');
    // console.log(result);
    return result;
  },

  async delCat2(id) {
    if(await allCoursesByCategory2(id)!==null)
      return false;
    const condition = {
      Cat2ID: id
    };
    const [result, fields] = await db.del(condition, 'Category2');
    return true;
  },

  async updateCat2(entity) {
    const condition = {
      Cat2ID: entity.Cat2ID
    };
    delete (entity.Cat2ID);

    const [result, fields] = await db.update(entity, condition, 'Category2');
    return result;
  },
  async addCat1(category1) {
    const [result, fields] = await db.add(category1, 'Category1');
    // console.log(result);
    return result;
  },

  async delCat1(id) {
    if( await allCoursesByCategory1(id).length!==0)
      return false;
    const condition = {
      Cat1ID: id
    };
    const [result, fields] = await db.del(condition, 'Category1');
    return true;
  },

  async updateCat1(entity) {
    const condition = {
      Cat1ID: entity.Cat1ID
    };
    delete (entity.Cat1ID);

    const [result, fields] = await db.update(entity, condition, 'Category1');
    return result;
  }
};
