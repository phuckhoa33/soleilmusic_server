// types.ts
import { Express } from 'express';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  stream: Express.Multer.File['stream'];
}
