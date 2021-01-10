var express = require('express');
const { allCat1, allCat2 } = require('../models/category');
const { addNewInfoCourse, addLessonsCourse, allCoursesByLecturer } = require('../models/course');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('account/lecturer/dashboard', { title: 'Express', layout: false });
});
router.get('/add', async function (req, res, next) {
  //truyen vao list cat1 ,cat2
  const list_cat1 = await allCat1();
  const list_cat2 = await allCat2(1);//list cat2 cho truong hop chon cat1id la 1
  //khi nguoi dung cho cat1id khac thi getjson de lay lai list cat2 id
  console.log('here cat1:',list_cat1);
  console.log('here cat2:',list_cat2);
  
  res.render('account/lecturer/addCourse', { title: 'Express', layout: false, list_cat1, list_cat2 });
});
// getJson('/get-list-cat2',{cat1id=2})
router.get('/get-list-cat2', async function (req, res, next) {
  //truyen vao list cat1 ,cat2
  const Cat1ID = req.query.cat1id;
  const list_cat2 = await allCat2(Cat1ID);//list cat2 cho truong hop chon cat1id la 1
  //khi nguoi dung cho cat1id khac thi getjson de lay lai list cat2 id
  console.log('here cat2:',list_cat2);
  
  res.json(list_cat2);
});
router.get('/my-course', async function (req, res, next) {
  const mycourses = await allCoursesByLecturer(req.session.authUser.UserID);
  console.log(mycourses);
  res.render('account/lecturer/addCourse', { title: 'Express', layout: false,mycourses });
});


//postJSOn('/add-information-course',parameter(giong bien test),function(data))
router.post('/add-information-course', async function (req, res, next) {
  //const{title,promotional_price,price,Cat1ID,cat2ID,date_public
  //brief_des, detail,end_discount,status,number_lessions, outline}=req.body;
  // yeu cau trong req.body phai chua nhung thong tin nay
  console.log(req.body);//req.body phai co dang nhu bien test duoi nay
  const test = {
    LectureID: 2,
    title: 'Build Responsive Real World Websites with HTML5 and CSS3',
    promotional_price: 100000,
    price: 500000,
    Cat1ID: 1,
    cat2ID: 1,
    date_public: '09/01/2021',
    brief_des:'The easiest way to learn modern web design, HTML5 and CSS3 step-by-step from scratch. Design AND code a huge project.',
    detail:`<p><strong><em>***&nbsp;The #1 HTML5 and CSS3 course in the official Udemy rankings! ***</em></strong></p><p><em>"Having gone
     through other related courses on other platforms, I can say this course is the most practical and readily applicable course on web design
      and development I have taken." —</em> Bernie Pacis</p><p><br></p><p>Are you looking for the best way to learn how to build&nbsp;
      beautiful websites with HTML5 and CSS3? That even&nbsp;look great on your phone?</p><p>Have you taken other HTML and CSS courses,
       but still wonder how to code a real-world website, not just some basic examples?</p><p>If your answer is a big YES...&nbsp;
       Then this is exactly the course you are looking for!</p><p><br></p><p><strong><em>So why is this course so unique and popular?</em></strong></p>
       <p><strong>Reason #1:&nbsp;The&nbsp;course is completely project-based</strong></p><p>Together we&nbsp;hand-code&nbsp;a beautiful and responsive
        landing page for a fictional company that I made up just for the course. Step-by-step, you will learn more and more&nbsp;HTML5 and&nbsp;CSS3&nbsp;
        features, from beginner to advanced. These are the latest web technologies, used by every website in the world.&nbsp;And&nbsp;we even added some jQuery 
        to the mix.</p>`,
    end_discount:'18/01/2021',
    
  }
  const result = await addNewInfoCourse(test);
  //const result = await addNewInfoCourse(req.body);
  res.json(result);//return courseid
});
router.post('/add-lessons-course', async function (req, res, next) {
  
  console.log(req.body);//req.body phai co dang nhu bien test duoi nay
  const test = {
    CourseID:16,
    status:0,
    num_lessions:5,
    outline:[
      {
        sectionTitle: 'Intro to Web',
        lessons: [{lessonTitle: 'Intro HTML5', preview: 1},{lessonTitle: 'Intro CSS3', preview: 0}]
      },
      {
        sectionTitle: 'Overview',
        lessons: [{lessonTitle: 'Overview HTML5', preview: 1},{lessonTitle: 'Overview CSS3', preview: 0}]
      },
      {
        sectionTitle: 'Conclusion',
        lessons: [{lessonTitle: 'Conclusion HTML5 & CSS3', preview: 0}]
      }
    ]
  }
  //const result = await addLessonsCourse(req.body);
  const result = await addLessonsCourse(test);
  res.json(result);
});

module.exports = router;
