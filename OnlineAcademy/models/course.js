const db = require('../utils/db');
const { getMySQLDateTime } = require('../utils/helpers');
const { paginate } = require('./../config/default.json');
const { findACourseInParticipating, update, findACourseInWatchList } = require('./findCourse');
const { addASection, addALession, getPercentageCompleting, checkAllStatus } = require('./lession');

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
  
  async allCoursesByLecturer(LecturerID) {
    const sql = `select * 
    from course c join user u on c.LectureID = u.UserID join category1 
        cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where c.LectureID=${LecturerID}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async checkCourseByLecturer(LecturerID, CourseID) {
    const sql = `select * 
    from course c join user u on c.LectureID = u.UserID join category1 
        cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where c.LectureID=${LecturerID} and CourseID=${CourseID}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    if(rows.length===0)
        return null;
      return rows[0];
  },
  async allCoursesByStudent(StudentID) {
    const sql = `select * 
    from course c inner join user u on c.LectureID = u.UserID inner join category1 
        cat1 on c.Cat1ID = cat1.Cat1ID inner join category2 cat2 on c.Cat2ID = cat2.Cat2ID
        inner join participatingcourse p on p.CourseID = c.CourseID
    where p.StudentID=${StudentID}`;
    const [rows, fields] = await db.load(sql);
    for (const c of rows) {
      const per = await getPercentageCompleting(c.CourseID,StudentID);
      console.log(per,c.CourseID);
      c.complete = per;
    }
    return rows;
  },
  async watchlist(StudentID) {
    const sql = `select * 
    from course c inner join user u on c.LectureID = u.UserID inner join category1 
        cat1 on c.Cat1ID = cat1.Cat1ID inner join category2 cat2 on c.Cat2ID = cat2.Cat2ID
        inner join watchlist w on w.CourseID = c.CourseID
    where w.StudentID=${StudentID}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async delACourseFromWatchlist(CourseID,StudentID) {
    const sql = `Delete
    from watchlist
    where StudentID=${StudentID} and CourseID=${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async del(CourseID) {
    if(await findACourseInParticipating(CourseID)!==null)
      return false;
    const sql = `Delete
    from course
    where CourseID=${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return true;
  },

  async addACourseFromWatchlist(entity) {
    if(await findACourseInWatchList(entity.CourseID,entity.StudentID) !== null)
      return false;
    const [result, fields] = await db.add(entity, 'watchlist');
    // console.log(result);
    return true;
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
    //c.number_of_students,c.title,u.full_name,c.star1,c.star2,c.star3,c.star4,c.star5,c.promotional_price,c.price
    const sql = `SELECT c.*,u.*,cat1.Cat1Name,cat2.Cat2Name
    from  course c  join user u on u.userid = c.lectureid join category1 cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where cat1.Cat1ID = ${Cat1ID} and c.CourseID <>${CourseID}
    ORDER BY  c.number_of_students Desc LIMIT 5`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  //by number_of_students registering last week
  async top4HotCoursesLastWeek() {
    //SELECT count(p.StudentID) as 'NumberofStudentTakingCourseWeek',c.title,u.full_name,c.star1,c.star2,c.star3,c.star4,c.star5,c.promotional_price,c.price,cat1.Cat1Name,cat2.Cat2Name,cat1.Cat1ID,cat2.Cat2ID,c.CourseID
    
    const sql = `select count(p.StudentID) as 'NumberofStudentTakingCourseWeek',u.*,c.*,cat1.Cat1Name,cat2.Cat2Name,cat1.Cat1ID,cat2.Cat2ID,u.full_name
    from participatingcourse p join course c on p.CourseID = c.CourseID join user u on u.userid = c.lectureid join category1 cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where DATEDIFF(CURRENT_DATE(), date_resgistered ) <= 7
    group by c.CourseID
    ORDER BY  count(p.StudentID) Desc LIMIT 4`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async top10CoursesByViews() {
    //views,c.title,u.full_name,c.star1,c.star2,c.star3,c.star4,c.star5,c.promotional_price,c.price
    const sql = `SELECT c.*,u.*,cat1.Cat1Name,cat2.Cat2Name
    from  course c  join user u on u.userid = c.lectureid join category1 cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    ORDER BY  c.views Desc LIMIT 10`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async top10NewCourses() {
    //date_public,c.title,u.full_name,c.star1,c.star2,c.star3,c.star4,c.star5,c.promotional_price,c.price,
    const sql = `SELECT c.*,u.*,cat1.Cat1Name,cat2.Cat2Name
    from  course c  join user u on u.userid = c.lectureid join category1 cat1 on c.Cat1ID = cat1.Cat1ID join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    ORDER BY  c.date_public Desc LIMIT 10`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async allfeedback(CourseID) {
    const sql = `select p.*,u.full_name
    from participatingcourse p join course c on p.CourseID = c.CourseID join user u on u.userid = p.studentid
    where p.courseid = ${CourseID} and star is not null
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
    return rows;
  },
  async updateNumberOfStudent(CourseID) {
    const sql = `update course set number_of_students = number_of_students+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async updateStar1(CourseID) {
    const sql = `update course set star1 = star1+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async updateStar2(CourseID) {
    const sql = `update course set star2 = star2+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async updateStar3(CourseID) {
    const sql = `update course set star3 = star3+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async updateStar4(CourseID) {
    const sql = `update course set star4 = star4+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async updateStar5(CourseID) {
    const sql = `update course set star5 = star5+1 where courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async updateStatus(CourseID) {
   if(await checkAllStatus(CourseID) == true){
    update({CourseID,status: 1});
   }
   else
    update({CourseID,status: 0});
  },

  async checkAStudenntParticipatingCourse(CourseID,StudentID) {
    const sql = `select* from participatingcourse where courseid = ${CourseID} and studentid = ${StudentID}`;
    const [rows, fields] = await db.load(sql);
    if(rows.length===0)
      return null;
    return rows[0];
  },
  async full_text_search(key,offset) {
    
    const sql = `SELECT c.*,u.full_name,cat1.Cat1Name,cat2.Cat2Name,0 as 'isnew',0 as 'isbestseller'
    from  course c  inner join user u on u.userid = c.lectureid 
    inner join category1 cat1 on c.Cat1ID = cat1.Cat1ID inner join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where match(c.title) against (${key}) or match(cat1.cat1name) against (${key}) 
    or match(cat2.cat2name) against (${key})
    limit ${paginate.limit} offset ${offset}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    for (const c of rows) {
      if(await this.isintop10NewCourses(c.CourseID)!== null){
        console.log(c.CourseID+"new");
        c.isnew = 1;
      }
      if(await this.isintop4BestSellerCourses(c.CourseID)!== null){
        console.log(c.CourseID+"bestseller");
        c.isbestseller = 1;
      }
    }
    return rows;
  },
  async count_result(key) {
    
    const sql = `SELECT count(*) as 'total'
    from  course c 
    inner join category1 cat1 on c.Cat1ID = cat1.Cat1ID inner join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where match(c.title) against (${key}) or match(cat1.cat1name) against (${key}) 
    or match(cat2.cat2name) against (${key})`;
    console.log(sql);
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows[0].total;
  },
  async full_text_search_by_rating(key,offset) {
    
    const sql = `SELECT c.*,u.full_name,cat1.Cat1Name,cat2.Cat2Name,0 as 'isnew',0 as 'isbestseller',c.star1+c.star2+c.star3+c.star4+c.star5 as 'total', TRUNCATE((c.star1+c.star2*2+c.star3*3+c.star4*4+c.star5*5)/(c.star1+c.star2+c.star3+c.star4+c.star5),1) as rating
    from  course c  inner join user u on u.userid = c.lectureid 
    inner join category1 cat1 on c.Cat1ID = cat1.Cat1ID inner join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where match(c.title) against (${key}) or match(cat1.cat1name) against (${key}) 
    or match(cat2.cat2name) against (${key})
    order by rating desc
    limit ${paginate.limit} offset ${offset}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    for (const c of rows) {
      if(await this.isintop10NewCourses(c.CourseID)!== null){
        console.log(c.CourseID+"new");
        c.isnew = 1;
      }
      if(await this.isintop4BestSellerCourses(c.CourseID)!== null){
        console.log(c.CourseID+"bestseller");
        c.isbestseller = 1;
      }
    }
    return rows;
  },
  async full_text_search_by_price(key,offset) {
    
    const sql = `SELECT c.*,u.full_name,cat1.Cat1Name,cat2.Cat2Name,0 as 'isnew',0 as 'isbestseller'
    from  course c  inner join user u on u.userid = c.lectureid 
    inner join category1 cat1 on c.Cat1ID = cat1.Cat1ID inner join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where match(c.title) against (${key}) or match(cat1.cat1name) against (${key}) 
    or match(cat2.cat2name) against (${key})
    order by c.promotional_price asc
    limit ${paginate.limit} offset ${offset}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    for (const c of rows) {
      if(await this.isintop10NewCourses(c.CourseID)!== null){
        console.log(c.CourseID+"new");
        c.isnew = 1;
      }
      if(await this.isintop4BestSellerCourses(c.CourseID)!== null){
        console.log(c.CourseID+"bestseller");
        c.isbestseller = 1;
      }
    }
    return rows;
  },
  async full_text_search_cat2(key) {
    
    const sql = `SELECT cat2.*,cat1.*
    from  course c  inner join user u on u.userid = c.lectureid 
    inner join category1 cat1 on c.Cat1ID = cat1.Cat1ID inner join category2 cat2 on c.Cat2ID = cat2.Cat2ID
    where match(c.title) against (${key}) or match(cat1.cat1name) against (${key}) 
    or match(cat2.cat2name) against (${key})
    group by cat2.Cat2ID`;
    console.log(sql);
    const [rows, fields] = await db.load(sql);
    //console.log(rows,typeof(rows));
    return rows;
  },
  async isintop10NewCourses(CourseID) {
    const sql = `SELECT *
    from 
    (SELECT *
    from  course c 
    ORDER BY  c.date_public Desc LIMIT 10) r
    where r.courseid = ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows);
    if(rows.length===0){
      //console.log('nullnew');
      return null;
    }
    return rows[0];
  },
  async isintop4BestSellerCourses(CourseID) {
    const sql = `SELECT *
    from 
    (select c.*
      from participatingcourse p inner join course c on p.CourseID = c.CourseID 
      where DATEDIFF(CURRENT_DATE(), date_resgistered ) <= 7
      group by c.CourseID
      ORDER BY  count(p.StudentID) Desc LIMIT 4) r
    where r.courseid =  ${CourseID}`;
    const [rows, fields] = await db.load(sql);
    //console.log(rows);
    if(rows.length === 0){
      //console.log('nullbestseller');
      return null;
    }
      
    return rows[0];
  },
  async addNewInfoCourse(course) {
 
    course.date_public = getMySQLDateTime(course.date_public);
    course.end_discount = getMySQLDateTime(course.end_discount);
    console.log('here course',course);
    const [result, fields] = await db.add(course, 'course');
    console.log(result);
    return result.insertId;

  },
  async addLessonsCourse(course) {
    
    const outline = course.outline;
    delete(course.outline);
    console.log('here course',course);
    const CourseID = course.CourseID;
    const condition = {
      CourseID: course.CourseID
    };
    delete (course.CourseID);

    const [result, fields] = await db.update(course, condition, 'course');

    console.log(result);
    
    //let listSections  = [];
    let listLessons  = [];
    for (const s of outline) {
      const section = {
        namest :s.sectionTitle,
        courseid: CourseID
      };
      //listSections.push(section);
      const res_sec = await addASection(section);
      console.log(listLessons,'list Lessons',res_sec)
      let listEach =[];
      for (const l of s.lessons) {
        const lesson = {
          namels :l.lessonTitle,
          preview: l.preview,
          sectionid: res_sec.insertId,
        };
        const res_les = await addALession(lesson);
        const new_lession = {
          lessonid : res_les.insertId,
          lessonTitle: l.lessonTitle,
        };
        listLessons.push(new_lession);
      }
      //listLessons.push(listEach);
    }
    
    return listLessons;

  },



};
