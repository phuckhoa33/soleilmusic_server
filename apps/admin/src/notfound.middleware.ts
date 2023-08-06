// not-found.middleware.ts
import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        throw new NotFoundException(); // Khi yêu cầu không hợp lệ, ném ra NotFoundException
    }
}