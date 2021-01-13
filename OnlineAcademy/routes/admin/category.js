const express = require('express');
const categoryModel = require('../../models/category');
const router = express.Router();

router.get('/', async function (req, res) {
  const cat1 = await categoryModel.allCat1();

  console.log(cat1);
  res.render('account/admin/category/index', {
    title: "Admin-Category",
    cat1: cat1,
    empty: cat1.length === 0,
    layout: false
  });
})

router.get('/get-list-cat2', async function (req, res, next) {
  //truyen vao list cat1 ,cat2
  console.log(req.query);
  const Cat1ID = req.query.cat1ID;
  const list_cat2 = await categoryModel.allCat2(Cat1ID);//list cat2 cho truong hop chon cat1id la 1
  //khi nguoi dung cho cat1id khac thi getjson de lay lai list cat2 id
  console.log('here cat2:', list_cat2);

  res.json(list_cat2);
});




router.get('/edit-cat2', async function (req, res) {
  const cat2Item = req.query;
  console.log(cat2Item);
  const result = await categoryModel.updateCat2(cat2Item);
  console.log('RESULT:', result);

  res.json(result);
})


router.get('/edit-cat1', async function (req, res) {
  const cat1Item = req.query;
  console.log(cat1Item);

  // Validate Cat1 New Name
  const listCat1 = await categoryModel.allCat1();
  var check = true;
  listCat1.forEach(function (item) {
    if (cat1Item.Cat1Name === item.Cat1Name) {
      check = false;
    }
  })
  if (check) {
    await categoryModel.updateCat1(cat1Item);
    res.json({ result: "true" });
  }
  else {
    res.json({ result: "false" });
  }
})


router.get('/add-cat2', async function (req, res) {
  const cat2Item = req.query;
  console.log(cat2Item);

  // Validate New Cat2's Name
  const list_cat2 = await categoryModel.allCat2(cat2Item.Cat1ID);
  var check = false;
  list_cat2.forEach(function (item) {
    if (item.Cat2Name === cat2Item.Cat2Name) {
      check = true;
    }
  })

  // New Cat2's Name is already exist
  if (check) {
    res.json({ result: "false" });
  } else {
    await categoryModel.addCat2(cat2Item);
    res.json({ result: "true" });
  }
})


router.get('/add-cat1', async function (req, res) {
  const cat1Item = req.query;
  console.log(cat1Item);

  // Validate New Cat1's Name
  const list_cat1 = await categoryModel.allCat1();
  var check = false;
  list_cat1.forEach(function (item) {
    if (item.Cat1Name === cat1Item.Cat1Name) {
      check = true;
    }
  })
  console.log(check);

  // New Cat2's Name is already exist
  if (check) {
    res.json({ result: "false" });
  } else {
    await categoryModel.addCat1(cat1Item);
    res.json({ result: "true" });
  }
})



router.get('/deleteCat1', async function (req, res) {
  var Cat1ID = req.query.Cat1ID;
  console.log(req.query);
  console.log(Cat1ID);

  var result = await categoryModel.delCat1(Cat1ID);
  console.log(result);
  if (result === true) {
    res.json({ result: "true" });
  }
  else {
    res.json({ result: "false" });
  }
})


router.get('/deleteCat2', async function (req, res) {
  var Cat2ID = req.query.Cat2ID;
  console.log(Cat2ID);
  var result = await categoryModel.delCat2(Cat2ID);
  console.log(result);

  
  if (result) {
    res.json({ result: "true" });
  }
  else {
    res.json({ result: "false" });
  }
})



module.exports = router;