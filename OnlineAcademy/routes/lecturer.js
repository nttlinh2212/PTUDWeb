var express = require('express');
const { allCat1, allCat2 } = require('../models/category');
const { addNewInfoCourse, addLessonsCourse, allCoursesByLecturer } = require('../models/course');
var router = express.Router();


var multer = require('multer');
const fs = require('fs');
const path = require('path');

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


var pathVIDEO = path.join(__dirname, `../private`);
var storageVIDEO = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, `${pathVIDEO}/temp`)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var uploadVIDEO = multer({ storage: storageVIDEO }).array('video', 50);



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('account/lecturer/dashboard', { title: 'Express', layout: false });
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

  res.render('account/lecturer/addCourseDetail', { title: 'Express', layout: false, list_cat1, list_cat2 });
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
  const mycourses = await allCoursesByLecturer(req.session.authUser.UserID);
  // console.log(mycourses);

  res.render('account/lecturer/myCourses', { title: 'Express', layout: false, mycourses });
});


router.get('/add-course-outline/:idCourse', function (req, res, next) {
  console.log(req.params.idCourse);

  // Tạo folder temp lưu video
  fs.mkdirSync(`${pathVIDEO}/temp`, { recursive: true }, function (err) {
    if (err) throw err;
    console.log("Folder created.");
  });


  res.render('account/lecturer/addCourseOutline', { title: 'Express', layout: false, courseID: req.params.idCourse });
});

router.post('/add-course-outline', function (req, res, next) {
  uploadVIDEO(req, res, async function (err) {
    if (err) {
      throw err;
    }
    console.log(req.files);
    // File upload successfully.
    console.log(req.body);
    res.redirect('/lecturer/my-course');
  })
});




router.post('/add-lessons-course', async function (req, res, next) {

  console.log(req.body);//req.body phai co dang nhu bien test duoi nay
  const test = {
    CourseID: 16,
    status: 0,
    num_lessions: 5,
    outline: [
      {
        sectionTitle: 'Intro to Web',
        lessons: [{ lessonTitle: 'Intro HTML5', preview: 1 }, { lessonTitle: 'Intro CSS3', preview: 0 }]
      },
      {
        sectionTitle: 'Overview',
        lessons: [{ lessonTitle: 'Overview HTML5', preview: 1 }, { lessonTitle: 'Overview CSS3', preview: 0 }]
      },
      {
        sectionTitle: 'Conclusion',
        lessons: [{ lessonTitle: 'Conclusion HTML5 & CSS3', preview: 0 }]
      }
    ]
  }
  //const result = await addLessonsCourse(req.body);
  const result = await addLessonsCourse(test);
  res.json(result);
});

module.exports = router;
