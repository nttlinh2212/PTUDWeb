const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../models/user');
const auth = require('../middlewares/auth');

const router = express.Router();
