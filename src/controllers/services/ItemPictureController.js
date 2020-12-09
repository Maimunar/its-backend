import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import util from 'util';
import path from 'path';
import fs from 'fs';

const fsunlink = util.promisify(fs.unlink);

class ItemPictureController {
  constructor(directory) {
    this.directory = directory;
  }

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

  async listView(filename) {
    return sharp(this.filepath(filename))
      .resize(130, 185)
  }

  async delete(filename) {
    return fsunlink(this.filepath(filename));
  }

  static filename() {
    return `${uuidv4()}.jpg`;
  }

  filepath(filename) {
    return path.resolve(`${this.directory}/${filename}`);
  }
  defaultFilepath() {
    return path.join(__dirname, '../../../public/defaultPictures/noImageAvailable.jpg')
  }
}

module.exports = ItemPictureController;
