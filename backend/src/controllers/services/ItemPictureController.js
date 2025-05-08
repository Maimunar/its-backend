import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import util from 'util';
import path from 'path';
import fs from 'fs';

const fsunlink = util.promisify(fs.unlink);

/*
  This class handles the storing and formatting of a picture
  received as a product image
  It uses sharp for the image processing and v4 for name generation
*/
class ItemPictureController {
  constructor(directory) {
    this.directory = directory;
  }
  /*
    resizes and stores the needed picture
  */
  async store(buffer) {
    const filename = ItemPictureController.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(200, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath);
    return filename;
  }
  /*
    Lists the picture in the needed format
  */
  async listView(filename) {
    return sharp(this.filepath(filename))
      .resize(130, 185)
  }
  /*
    Handles deleting a file
  */
  async delete(filename) {
    return fsunlink(this.filepath(filename));
  }
  /*
    Handles the creation of a random filename
  */
  static filename() {
    return `${uuidv4()}.jpg`;
  }
  /*
    Handles giving the full filepath of the required file
  */
  filepath(filename) {
    return path.resolve(`${this.directory}/${filename}`);
  }
  /*
    Handles returning the filepath of a default picture for when
    another one isn't available
  */
  defaultFilepath() {
    return path.join(__dirname, '../../../public/defaultPictures/noImageAvailable.jpg')
  }
}

module.exports = ItemPictureController;
