var express = require('express');
const { allCat1, allCat2 } = require('../models/category');
const { addNewInfoCourse, addLessonsCourse, allCoursesByLecturer, updateStatus } = require('../models/course');
var router = express.Router();
const courseModel = require('../models/course');
var lessionModel = require('../models/lession')
var multer = require('multer');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const { update, updateDuration } = require('../models/lession');
const { getTime } = require('../utils/helpers');
const { findACourse } = require('../models/findCourse');
const { updateInfoLecture } = require('../models/lecturer');


var pathIMAGE = path.join(__dirname, `../public/images/courses`);

var storageIMAGE = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${pathIMAGE}/temp`)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var uploadIMAGE = multer({ storage: storageIMAGE }).array('picture', 5);



router.get('/', function (req, res, next) {
  res.render('account/lecturer/dashboard', { title: 'Dashboard', layout: false });
});

//xem cai nay de biet bo cuc update-info
router.get('/update-info', async function (req, res, next) {
  const lecturer = {
    UserID: req.session.authUser.UserID,
    full_name: 'Tim Barack',
    occupation:'Web Java Python Android Expert Developer ',
    LectureInfo:`<p>Tim's been a professional software developer for over 35 years.&nbsp; During his career, he has worked for major companies such as Fujitsu, Mitsubishi, and Saab.<br><br>His video courses are used to train developers in major companies such as Mercedes-Benz, Paypal, VW, Pitney Bowes, IBM, and T-Mobile just to name a few (via the Udemy for Business program).<br><br>What makes Tim unique is his professional programming career - many instructors have never programmed professionally, let alone had a distinguished professional development career like Tim.<br><br>Tim has trained over 847,000 students how to program, way more than a typical IT&nbsp;Professor at a college does in a lifetime.<br><br>In fact, Tim's courses are often purchased by students struggling to get through college programming courses.</p><p>"I am learning a lot about Java very quickly. I wish my college courses worked this way, they drag the same amount of material out over months." - Thomas Neal<br><br>"I love this guy. I'm in school for java right now at a local college and I bought this course hoping it would help clarify the fuzzy areas of my coursework. There's no comparison. Every time I get lost in my textbook, I watch a couple more of these videos and I'm right back on track. He explains everything so perfectly. It sinks right in." - Kristen Andreani<br><br>"Tim is a great instructor, I have more courses from him and all are great. This one really helped me with my understanding of Java from the very beginnings. In fact, I was able to find a job as Java developer with the knowledge gained from this course, so I basically owe Mr. Buchalka my career" - Daniel KubÃ¡nyi<br><br>Tim's mission is simple:&nbsp; to make a difference in your life by helping you to become a software developer. &nbsp;Tim does that through his Java, Python, C#, Spring Framework, and Android development courses.</p><p>When Tim started programming over thirty-five years ago, there was no online&nbsp;video training. &nbsp;</p><p>There was no "easy" way to learn. &nbsp;The Internet, in its current form, didn't exist, and as a result, Tim&nbsp;couldn't "Google" for help, or watch videos on Youtube.</p><p>After learning the hard way, Tim&nbsp;was determined to become the best teacher he could, and to make his training&nbsp;as painless as possible, so that you, or anyone else with the desire to&nbsp;become a software developer, could become one.</p><p>In between doing that, Tim&nbsp;spent the best part of those years as a professional software developer writing 
    applications in Java and a variety of other languages. &nbsp;In addition, he spent many years with J2EE&nbsp;(as it was then known), now known as Java Enterprise Edition (JEE), designing and developing enterprise applications.</p><p>Tim is&nbsp;relatively unique, in that<strong>&nbsp;he is&nbsp;a professional, experienced software developer </strong>who also has <strong>exceptional teaching skills</strong>. &nbsp;<br><br>Many instructors have no work experience in the field. &nbsp;Make sure the person you trust with your education is a real expert with substantial previous professional experience.<br></p><p><strong>The bottom line for you is, when taking any of Tim's&nbsp;courses, is that&nbsp;you will learn the right way to do things from an expert, 
    in the shortest possible amount of time.</strong></p><p>Tim's Java, Android, and Python courses, here on Udemy are of the highest quality as reviewed by his students. &nbsp;<strong> Ten's of thousands
     of students, just like you,&nbsp;have taken his&nbsp;classes,</strong> <strong>thousands have left glowing reviews,
     </strong> and many&nbsp;have gone on to full-time jobs, or consulting/freelancing opportunities after completing one of his&nbsp;courses.</p><p>Tim&nbsp;recently
      placed in the top ten Udemy instructors as voted for by his students and&nbsp;Udemy themselves. &nbsp;</p><p><strong>What does all of this mean for you?</strong></p><p>You can have full confidence that Tim's 
      courses are of exceptional quality, and that he<strong>&nbsp;can teach you to become a software developer</strong> if you have the desire to become one.</p><p>Are you ready to start? &nbsp;You can get started today. &nbsp;No previous experience is necessary.</p><p>In 2020, video training is the quickest way to learn, and with Tim's experience and training, it is possible for you to become a software developer. &nbsp;You can do this.</p><p>Why not start today? &nbsp;Click one of his&nbsp;courses below, and watch his&nbsp;introductory video, to find out more about who he is&nbsp;and what he&nbsp;can offer you.</p>`
  }
  await updateInfoLecture(lecturer);
  res.render('account/lecturer/update-info', { title: 'Update Info' });
});
// Add-Course-Detail page
router.get('/add-course-detail', async function (req, res, next) {
  //truyen vao list cat1 ,cat2
  const list_cat1 = await allCat1();
  const list_cat2 = await allCat2(1);//list cat2 cho truong hop chon cat1id la 1
  //khi nguoi dung cho cat1id khac thi getjson de lay lai list cat2 id
  // console.log('here cat1:', list_cat1);
  // console.log('here cat2:', list_cat2);

  // Tạo folder temp lưu image
  fs.mkdirSync(`${pathIMAGE}/temp`, { recursive: true }, function (err) {
    if (err) throw err;
    console.log("Folder created.");
  });

  res.render('account/lecturer/addCourseDetail', { title: 'Express',  list_cat1, list_cat2 });
});

router.get('/update-course-detail/:id', async function (req, res, next) {

  req.session.CourseID = req.params.id;
  const course = await findACourse(req.params.id);
  const list_cat1 = await allCat1();//trong view co the getJson de lay list cat2 khi thay doi su lua cho cat1
  const list_cat2 = await allCat2(course.cat1ID);
  

  res.render('account/lecturer/editCourse', { title: 'Edit Course Detail', course,list_cat1,list_cat2 });
});

router.post('/update-course-detail', async function (req, res, next) {
  console.log(req.session.CourseID);
  fs.mkdirSync(`./public/images/courses/${req.session.CourseID}`, { recursive: true }, function (err) {
    if (err)  {
      if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
      else cb(err); 
    }
    console.log("Folder created.");
  });
  //console.log(req.body,'in here');
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/images/courses/${req.session.CourseID}`);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({ storage: storage });
  upload.array('picture',2)(req, res, async function (err) {
    console.log(req.body);
    if (err) {
      console.log(err);
    } else {
      if (req.files[0].size > req.files[1].size) {
        fs.renameSync(`./public/images/courses/${req.session.CourseID}/${req.files[0].filename}`, `./public/images/courses/${req.session.CourseID}/main.jpg`, function (err) {
          console.log(err);
        });
        // Bắt buộc đợi nó rename xong mới cho chạy tiếp!
        fs.renameSync(`./public/images/courses/${req.session.CourseID}/${req.files[1].filename}`, `./public/images/courses/${req.session.CourseID}/thumb.jpg`, function (err) {
          console.log(err);
        });
      }
      else {
        fs.renameSync(`./public/images/courses/${req.session.CourseID}/${req.files[0].filename}`, `./public/images/courses/${req.session.CourseID}/thumb.jpg`, function (err) {
          console.log(err);
        });
        // Bắt buộc đợi nó rename xong mới cho chạy tiếp!
        fs.renameSync(`${pathIMAGE}/temp/${req.files[1].filename}`, `${pathIMAGE}/temp/main.jpg`, function (err) {
          console.log(err);
        });
      }
      fs.renameSync(`./public/images/courses/${req.session.CourseID}/${req.files[1].filename}`, `./public/images/courses/${req.session.CourseID}/thumb.jpg`, function (err) {
        console.log(err);
      });
      
      const course = {
        CourseID:req.session.CourseID,
        title: req.body.title,
        promotional_price: req.body.promotional_price,
        price: req.body.price,
        Cat1ID: req.body.Cat1ID,
        cat2ID: req.body.Cat2ID,
        date_public: date_public,
        brief_des: req.body.brief_des,
        detail: req.body.detail,
        end_discount: end_discount
      }; 
    await courseModel.update(course);
    res.redirect(`/lecturer/my-course`);
    }
  }); 
  
});

router.post('/add-course-detail', async function (req, res, next) {
  uploadIMAGE(req, res, async function (err) {
    if (err) {
      throw err;
    }
    // File upload successfully.
    // console.log(req.body);
    // console.log(req.files);

    // Create Course In DB => Get CourseID

    //Convert Date
    var date_public = req.body.date_public.split("-");
    var end_discount = req.body.end_discount.split("-");
    date_public = date_public[2] + "/" + date_public[1] + "/" + date_public[0];
    end_discount = end_discount[2] + "/" + end_discount[1] + "/" + end_discount[0];

    console.log(req.body.end_discount + "___" + req.body.end_discount);
    console.log(end_discount);
    console.log("________________");

    console.log(req.body.date_public + "___" + req.body.date_public);
    console.log(date_public);
    console.log("________________");

    const course = {
      LectureID: req.session.authUser.UserID,
      title: req.body.title,
      promotional_price: req.body.promotional_price,
      price: req.body.price,
      Cat1ID: req.body.Cat1ID,
      cat2ID: req.body.Cat2ID,
      date_public: date_public,
      brief_des: req.body.brief_des,
      detail: req.body.detail,
      end_discount: end_discount
    };

    console.log(course);

    const courseID = await addNewInfoCourse(course);

    // Create Course is failed
    if (Number.isNaN(courseID)) {
      console.log("CREATE COURSE IS FAILED. PLEASE CHECK AGAIN!");
    }
    // Create Course is successful
    else {
      // Rename the file 
      if (req.files[0].size > req.files[1].size) {
        fs.renameSync(`${pathIMAGE}/temp/${req.files[0].filename}`, `${pathIMAGE}/temp/main.jpg`, function (err) {
          console.log(err);
        });
        // Bắt buộc đợi nó rename xong mới cho chạy tiếp!
        fs.renameSync(`${pathIMAGE}/temp/${req.files[1].filename}`, `${pathIMAGE}/temp/thumb.jpg`, function (err) {
          console.log(err);
        });
      }
      else {
        fs.renameSync(`${pathIMAGE}/temp/${req.files[0].filename}`, `${pathIMAGE}/temp/thumb.jpg`, function (err) {
          console.log(err);
        });
        // Bắt buộc đợi nó rename xong mới cho chạy tiếp!
        fs.renameSync(`${pathIMAGE}/temp/${req.files[1].filename}`, `${pathIMAGE}/temp/main.jpg`, function (err) {
          console.log(err);
        });
      }

      // Rename Asynchornize
      fs.rename(`${pathIMAGE}/temp`, `${pathIMAGE}/${courseID}`, function (err) {
        console.log("rename file successfully.");
      });

      res.redirect('/lecturer/my-course');
    }
  })
});


// getJson('/get-list-cat2',{cat1id=2})
router.get('/get-list-cat2', async function (req, res, next) {
  //truyen vao list cat1 ,cat2
  // console.log(req.query);
  const Cat1ID = req.query.cat1ID;
  const list_cat2 = await allCat2(Cat1ID);//list cat2 cho truong hop chon cat1id la 1
  //khi nguoi dung cho cat1id khac thi getjson de lay lai list cat2 id
  console.log('here cat2:', list_cat2);

  res.json(list_cat2);
});


router.get('/my-course', async function (req, res, next) {
  let mycourses = await allCoursesByLecturer(req.session.authUser.UserID);
  for (const c of mycourses) {
    await updateStatus(c.CourseID);
  }
  // console.log(mycourses);
  mycourses = await allCoursesByLecturer(req.session.authUser.UserID);
  res.render('account/lecturer/myCourses', { title: 'Express', layout: false, mycourses });
});

router.get('/view-course-detail/:idCourse', function (req, res, next) {
  res.redirect(`/course/detail/${req.params.idCourse}`);
});


router.get('/add-course-outline/:idCourse', function (req, res, next) {
  console.log(req.params.idCourse);
  res.render('account/lecturer/addCourseOutline', { title: 'Add Course Outline', courseID: req.params.idCourse, layout: false,  });
});
router.get('/addVideo/:idCourse', async function (req, res, next) {
  CourseID =  req.params.idCourse;
  const course = await courseModel.findACourse(CourseID);
  req.session.CourseID = CourseID;
  const lessions = await lessionModel.allLessonsAndSections(CourseID);
  res.render('account/lecturer/addVideo', {title: 'Add Video',  lessions, course });
});

router.get('/addAVideo', async function (req, res, next) {
  console.log(req.query);
  const lession =  await lessionModel.findALession(req.query.lessionid);
  const course = await findACourse(req.query.courseid);
  
  res.render('account/lecturer/addAVideo', {title: 'Add A Video',lession  , course });
});


router.post('/add-course-outline', async function (req, res, next) {
    let k = 0;
    console.log('res body',req.body);
    index = req.body.lectureOfEachSessionInOrder.split(',');
    for (let i = 0; i< index.length; i++) {
      index[i] = + index[i] 
      
    }
    if(typeof req.body.session ==='string')
      req.body.session = [req.body.session]
    if(typeof req.body.lecture ==='string')
      req.body.lecture = [req.body.lecture]
    console.log('res index',index);
    let outline = [];
    for(let i = 0;i<req.body.session.length;i++) {
      let object = {sectionTitle: req.body.session[i], lessons:[]};
      let j = 0;
      for(j = k; j<k+index[i];j++){
        object.lessons.push({
          lessonTitle: req.body.lecture[j],
          preview: req.body.preview[j]
        })
        
      }
      k= j;
      outline.push(object)
    }
    const c =  await findACourse(req.body.courseID);
    const send = {
      CourseID: req.body.courseID,
      outline,
      num_lessions: req.body.lecture.length+c.num_lessions,
    }
    console.log(JSON.stringify(outline));
    const result = await addLessonsCourse(send);
    await updateStatus(req.body.courseID);
    res.redirect('/lecturer/my-course');
  
});

router.post('/addAVideo', function (req, res) {
  console.log(req.session.CourseID);
  fs.mkdirSync(`./private/${req.session.CourseID}`, { recursive: true }, function (err) {
    if (err)  {
      if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
      else cb(err); 
    }
    console.log("Folder created.");
  });
  //console.log(req.body,'in here');
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./private/${req.session.CourseID}`);
    },
    filename: function (req, file, cb) {
      cb(null, 'wysiwyg.mp4');
    }
  });
  const upload = multer({ storage: storage });
  upload.single('fuMain')(req, res, async function (err) {
    console.log(req.body);
    if (err) {
      console.log(err);
    } else {
      fs.renameSync(`./private/${req.session.CourseID}/wysiwyg.mp4`, `./private/${req.session.CourseID}/${req.body.lessionid}.mp4`, function (err) {
        console.log(err);
      });
      const lesson ={
        LessionID: req.body.lessionid,
        duration: getTime(req.body.duration),
        status: 1
      }
      console.log('here lesson:',lesson);
    await update(lesson);
    await updateDuration(req.session.CourseID);
    res.redirect(`/lecturer/addVideo/${req.session.CourseID}`);
    }
  });
})





module.exports = router;
