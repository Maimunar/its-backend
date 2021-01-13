const multer = require('multer');

/*
  Middleware that handles pictures and uploads
  Uses multer's upload and gives it a file limit for security reasons
  handle picture stores the filename in the request locals if the format is right
*/
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports.upload = upload;

module.exports.handlePicture = itemPictures => async (req, res, next) => {
  try {
    if (!req.file) return next();
    if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
      return next(new Error('File format is not supported'));
    }
    req.file.storedFilename = await itemPictures.store(req.file.buffer);
    return next();
  } catch (err) {
    console.log('Error with picture')
    return next(err);
  }

};
