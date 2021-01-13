
const db = require('../utils/db');
const userModel = require('./user');
module.exports = {
async updateInfoLecture(entity) {
    const tableUser = {
        UserID: entity.UserID,
        full_name: entity.full_name,
    };
    const tableLecture = {
        LectureID: entity.UserID,
        occupation: entity.occupation,
        LectureInfo: entity.LectureInfo
    };
    await userModel.update(tableUser);
    await userModel.updateLecture(tableLecture);
    return true;
  },
};