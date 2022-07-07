import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", folder),
        filename: (request, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString("hex"); //não ter arquivos co mnomes complicados
          const fileName = `${fileHash}-${file.originalname}`;

          return callback(null, fileName)
        }
      })
    }
  }
}