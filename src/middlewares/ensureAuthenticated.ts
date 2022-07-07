import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string;
}


export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("token missing", 401);
  }

  //Bearer asdklfnsdikonoisdfk292i490
  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, "2da89e5a6e7012ac4f6bc4a418c92ab4") as IPayload;

    const usersRepository = new UsersRepository();
    usersRepository.findById(user_id);

    if (!user_id) {
      throw new AppError("User does not exist!", 401);
    }

    request.user = {
      id: user_id
    }

    next();
  }
  catch {
    throw new AppError("Invalid token!", 401);
  }
}

