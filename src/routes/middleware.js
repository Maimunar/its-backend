const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

module.exports.upload = upload;

module.exports.handlePicture = itemPictures => async (req, res, next) => {
  try{
    if (!req.file) return next();
    if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
      return next(new Error('File format is not supported'));
    }
    req.file.storedFilename = await itemPictures.store(req.file.buffer);
    return next();
  } catch(err){
    return next(err);
  }

};