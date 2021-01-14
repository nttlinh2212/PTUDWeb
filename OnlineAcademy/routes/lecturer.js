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
const { getTime, getMySQLDateTime1 } = require('../utils/helpers');
const { findACourse } = require('../models/findCourse');
const { updateInfoLecture } = require('../models/lecturer');
const userModel = require('../models/user');

var pathIMAGE = path.join(__dirname, `../public/images/courses`);
var pathImageUser = path.join(__dirname, `../public/images/users`);

var storageIMAGE = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${pathIMAGE}/temp`)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname)
    }
})//.array('picture', 2);upload.
var uploadIMAGE = multer({ storage: storageIMAGE }).
fields([{ name: 'main.jpg', maxCount: 1 }, { name: 'thumb.jpg', maxCount: 1 }])

var storageImageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${pathImageUser}`)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var uploadImageUser = multer({ storage: storageImageUser }).single('imageUser');


router.get('/', function (req, res, next) {
    res.render('account/lecturer/dashboard', { title: 'Dashboard', layout: false });
});



router.get('/my-profile', async function (req, res, next) {
    const lecturer = await userModel.findALecture(req.session.authUser.UserID);
    console.log(lecturer);
    res.render('account/lecturer/editLecturer', { lecturer, title: 'Update Info' });
});



router.post('/update-info-withUploadImage', async function (req, res, next) {
    uploadImageUser(req, res, async function (err) {
        if (err) {
            throw err;
        }
        // File upload successfully.
        console.log(req.file);

        const lecturer = req.body;
        lecturer.UserID = req.session.authUser.UserID;
        console.log(lecturer);

        var result = await updateInfoLecture(lecturer);
        console.log(result);
        if (result) {
            // rename file
            fs.renameSync(`${pathImageUser}/${req.file.filename}`, `${pathImageUser}/${lecturer.UserID}.jpg`, function (err) {
                console.log(err);
            });
        }
        res.redirect('/lecturer/my-course');
    });
});


router.post('/update-info-withoutUploadImage', async function (req, res, next) {

    const lecturer = req.body;
    lecturer.UserID = req.session.authUser.UserID;
    console.log(lecturer);
    console.log("HAHAAAAAAAAAAAA");

    var result = await updateInfoLecture(lecturer);
    console.log(result);

    res.redirect('/lecturer/my-course');
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

    res.render('account/lecturer/addCourseDetail', { title: 'Express', list_cat1, list_cat2 });
});

router.get('/update-course-detail/:id', async function (req, res, next) {
    req.session.CourseID = req.params.id;
    const course = await findACourse(req.params.id);
    // console.log(course);
    const list_cat1 = await allCat1();//trong view co the getJson de lay list cat2 khi thay doi su lua cho cat1
    const list_cat2 = await allCat2(course.Cat1ID);

    var date_public = course.date_public.split(" ");
    var date_public = date_public[0];
    console.log(date_public);

    var end_discount = course.end_discount.split(" ");
    var end_discount = end_discount[0];
    console.log(end_discount);

    course.date_public = date_public;
    course.end_discount = end_discount;

    res.render('account/lecturer/editCourseDetail', { title: 'Edit Course Detail', course, list_cat1, list_cat2 });
});

router.post('/update-course-detail', async function (req, res, next) {
    console.log(req.session.CourseID);
    fs.mkdirSync(`./public/images/courses/${req.session.CourseID}`, { recursive: true }, function (err) {
        if (err) {
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
            cb(null, file.fieldname);
        }
    });
    const upload = multer({ storage: storage });//upload.array('picture',2)
    upload.fields([{ name: 'main.jpg', maxCount: 1 }, { name: 'thumb.jpg', maxCount: 1 }])(req, res, async function (err) {
        console.log(req.body);
        if (err) {
            console.log(err);
        } else {
            
            date_public = getMySQLDateTime1(req.body.date_public);
            end_discount = getMySQLDateTime1(req.body.end_discount);
            const course = {
                CourseID: req.session.CourseID,
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
        // var date_public = req.body.date_public.split("-");
        // var end_discount = req.body.end_discount.split("-");
        // date_public = date_public[2] + "/" + date_public[1] + "/" + date_public[0];
        // end_discount = end_discount[2] + "/" + end_discount[1] + "/" + end_discount[0];

        // console.log(req.body.end_discount + "___" + req.body.end_discount);
        // console.log(end_discount);
        // console.log("________________");

        // console.log(req.body.date_public + "___" + req.body.date_public);
        // console.log(date_public);
        // console.log("________________");
        date_public = getMySQLDateTime1(req.body.date_public);
        end_discount = getMySQLDateTime1(req.body.end_discount);
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
            // if (req.files[0].size > req.files[1].size) {
            //     fs.renameSync(`${pathIMAGE}/temp/${req.files[0].filename}`, `${pathIMAGE}/temp/main.jpg`, function (err) {
            //         console.log(err);
            //     });
            //     // Bắt buộc đợi nó rename xong mới cho chạy tiếp!
            //     fs.renameSync(`${pathIMAGE}/temp/${req.files[1].filename}`, `${pathIMAGE}/temp/thumb.jpg`, function (err) {
            //         console.log(err);
            //     });
            // }
            // else {
            //     fs.renameSync(`${pathIMAGE}/temp/${req.files[0].filename}`, `${pathIMAGE}/temp/thumb.jpg`, function (err) {
            //         console.log(err);
            //     });
            //     // Bắt buộc đợi nó rename xong mới cho chạy tiếp!
            //     fs.renameSync(`${pathIMAGE}/temp/${req.files[1].filename}`, `${pathIMAGE}/temp/main.jpg`, function (err) {
            //         console.log(err);
            //     });
            // }

            // Rename Asynchornize
            fs.rename(`${pathIMAGE}/temp`, `${pathIMAGE}/${courseID}`, function (err) {
                console.log("rename file successfully.");
            });

            res.redirect('/lecturer/my-course');
        }
    })
});


router.get('/get-list-cat2', async function (req, res, next) {
    const Cat1ID = req.query.cat1ID;
    const list_cat2 = await allCat2(Cat1ID);
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
    res.render('account/lecturer/addCourseOutline', { title: 'Add Course Outline', courseID: req.params.idCourse, layout: false, });
});

router.get('/addVideo/:idCourse', async function (req, res, next) {
    CourseID = req.params.idCourse;
    const course = await courseModel.findACourse(CourseID);
    req.session.CourseID = CourseID;
    const lessions = await lessionModel.allLessonsAndSections(CourseID);
    res.render('account/lecturer/addVideo', { title: 'Add Video', lessions, course });
});

router.get('/addAVideo', async function (req, res, next) {
    console.log(req.query);
    const lession = await lessionModel.findALession(req.query.lessionid);
    const course = await findACourse(req.query.courseid);

    res.render('account/lecturer/addAVideo', { title: 'Add A Video', lession, course });
});
router.get('/addPreviewVideo', async function (req, res, next) {
    console.log(req.query);
    const lession = await lessionModel.findALession(req.query.lessionid);
    const course = await findACourse(req.query.courseid);

    res.render('account/lecturer/addAVideo', { title: 'Add A Video', lession, course });
});


router.post('/add-course-outline', async function (req, res, next) {
    let k = 0;
    console.log('res body', req.body);
    index = req.body.lectureOfEachSessionInOrder.split(',');
    for (let i = 0; i < index.length; i++) {
        index[i] = + index[i]

    }
    if (typeof req.body.session === 'string')
        req.body.session = [req.body.session]
    if (typeof req.body.lecture === 'string')
        req.body.lecture = [req.body.lecture]
    console.log('res index', index);
    let outline = [];
    for (let i = 0; i < req.body.session.length; i++) {
        let object = { sectionTitle: req.body.session[i], lessons: [] };
        let j = 0;
        for (j = k; j < k + index[i]; j++) {
            object.lessons.push({
                lessonTitle: req.body.lecture[j],
                preview: req.body.preview[j]
            })

        }
        k = j;
        outline.push(object)
    }
    const c = await findACourse(req.body.courseID);
    const send = {
        CourseID: req.body.courseID,
        outline,
        num_lessions: req.body.lecture.length + c.num_lessions,
    }
    console.log(JSON.stringify(outline));
    const result = await addLessonsCourse(send);
    await updateStatus(req.body.courseID);
    res.redirect('/lecturer/my-course');
});



router.post('/addAVideo', function (req, res) {
    console.log(req.session.CourseID);
    fs.mkdirSync(`./private/${req.session.CourseID}`, { recursive: true }, function (err) {
        if (err) {
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
            const lesson = {
                LessionID: req.body.lessionid,
                duration: getTime(req.body.duration),
                status: 1
            }
            console.log('here lesson:', lesson);
            await update(lesson);
            await updateDuration(req.session.CourseID);
            res.redirect(`/lecturer/addVideo/${req.session.CourseID}`);
        }
    });
});



router.get('/delete-course', async function (req, res, next) {
    console.log(req.query);
    const CourseID = req.query.CourseID;
    console.log(CourseID);
    const result = await courseModel.del(CourseID);
    console.log(result);
    if (result) {
        res.json({ result: "true" });
    }
    else {
        res.json({ result: "false" });
    }
});

router.post('/addPreviewVideo', function (req, res) {
    console.log(req.session.CourseID);
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./public/video`);
        },
        filename: function (req, file, cb) {
            cb(null, `${req.session.CourseID}.mp4`);
        }
    });
    const upload = multer({ storage: storage });
    upload.single('fuMain')(req, res, async function (err) {
        console.log(req.body);
        if (err) {
            console.log(err);
        } else
            res.redirect(`/lecturer/addVideo/${req.session.CourseID}`);
        
    });
    
});


module.exports = router;

// console.log(req.session.CourseID);
//     fs.mkdirSync(`./public/images/courses/${req.session.CourseID}`, { recursive: true }, function (err) {
//         if (err) {
//             if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
//             else cb(err);
//         }
//         console.log("Folder created.");
//     });
//     //console.log(req.body,'in here');
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, `./public/images/courses/${req.session.CourseID}`);
//         },
//         filename: function (req, file, cb) {
//             cb(null, file.originalname);
//         }
//     });
//     const upload = multer({ storage: storage });
//     upload.single('bigpicture')(req, res, async function (err) {
//         console.log(req.body);
//         if (err) {
//             console.log(err);
//         } else {
//             if (req.files[0].size > req.files[1].size) {
//                 fs.renameSync(`./public/images/courses/${req.session.CourseID}/${req.files[0].filename}`, `./public/images/courses/${req.session.CourseID}/main.jpg`, function (err) {
//                     console.log(err);
//                 });
//                 // Bắt buộc đợi nó rename xong mới cho chạy tiếp!
//                 fs.renameSync(`./public/images/courses/${req.session.CourseID}/${req.files[1].filename}`, `./public/images/courses/${req.session.CourseID}/thumb.jpg`, function (err) {
//                     console.log(err);
//                 });
//             }
//             else {
//                 fs.renameSync(`./public/images/courses/${req.session.CourseID}/${req.files[0].filename}`, `./public/images/courses/${req.session.CourseID}/thumb.jpg`, function (err) {
//                     console.log(err);
//                 });
//                 // Bắt buộc đợi nó rename xong mới cho chạy tiếp!
//                 fs.renameSync(`${pathIMAGE}/temp/${req.files[1].filename}`, `${pathIMAGE}/temp/main.jpg`, function (err) {
//                     console.log(err);
//                 });
//             }
//             fs.renameSync(`./public/images/courses/${req.session.CourseID}/${req.files[1].filename}`, `./public/images/courses/${req.session.CourseID}/thumb.jpg`, function (err) {
//                 console.log(err);
//             });

//             const course = {
//                 CourseID: req.session.CourseID,
//                 title: req.body.title,
//                 promotional_price: req.body.promotional_price,
//                 price: req.body.price,
//                 Cat1ID: req.body.Cat1ID,
//                 cat2ID: req.body.Cat2ID,
//                 date_public: date_public,
//                 brief_des: req.body.brief_des,
//                 detail: req.body.detail,
//                 end_discount: end_discount
//             };
//             await courseModel.update(course);
//             res.redirect(`/lecturer/my-course`);
//         }
//     });
