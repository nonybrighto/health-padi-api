/* eslint-disable class-methods-use-this */
import { nthIndex } from './general';

const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const mkdirp = require('mkdirp');
const cpFile = require('cp-file');
const fs = require('fs');

const fsPromises = fs.promises;

class FileUploader {
  fileUploadHandler({
    fieldName = 'file',
    bodyValid = null,
    folder = null
  } = {}) {
    const filter = async (req, file, cb) => {
      if (!bodyValid || (bodyValid && (await bodyValid(req.body)))) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };

    const currentTimeString = new Date().toISOString();
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const filePath = FileUploader.createUploadsPath(
          folder,
          this.createFileName({
            currentTimeString,
            file,
            folder,
            user: req.user
          })
        );
        mkdirp.sync(filePath);
        cb(null, filePath);
      },
      filename: (req, file, cb) => {
        cb(
          null,
          this.createFileName({
            currentTimeString,
            file,
            folder,
            user: req.user,
            showExtension: true
          })
        );
      }
    });

    const upload = multer({ storage, fileFilter: filter });
    return upload.single(fieldName);
  }

  createFileName({
    currentTimeString,
    file,
    folder,
    showExtension,
    user
  } = {}) {
    const name = md5(
      folder === 'avatars' ? user.id : currentTimeString + file.originalname
    );

    return showExtension ? name + path.extname(file.originalname) : name;
  }

  async moveTempToPermanent(fileLink, locationFolder) {
    try {
      const permaLink = this.createPermaLink(fileLink, locationFolder);
      await cpFile(fileLink, permaLink);
      return permaLink;
    } catch (error) {
      return false;
    }
  }

  async deleteFile(fileLink) {
    try {
      await fsPromises.unlink(fileLink);
      return true;
    } catch (err) {
      return false;
    }
  }

  createPermaLink(fileLink, locationFolder) {
    return `uploads/${locationFolder}${fileLink.substring(
      nthIndex(fileLink, '/', 2)
    )}`;
  }

  static createUploadsPath(base, fileName) {
    const path1 = fileName.substr(0, 2);
    const path2 = fileName.substr(2, 2);
    const path3 = fileName.substr(4, 2);

    return `uploads/${base}/${path1}/${path2}/${path3}/`;
  }

  static generateSavePath(file, storageType = 'disk') {
    if (storageType === 'disk') {
      return `${file.destination}${file.filename}`;
    }
    return file.key;
  }
}

const fileUploader = new FileUploader();
export { FileUploader, fileUploader };
