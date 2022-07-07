import { compare } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";


interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  },
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }


  async execute({ email, password }: IRequest): Promise<IResponse> {
    //Usuario existe
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect");
    }

    //Senha esta correta
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect");
    }

    //Gerar jsonweb
    // colocar informações n criticas tipo nome, se tem permissões
    //2 parametro palavra secreta para auxiliar a criacao do jsonwebtoken
    const token = sign({}, "cfe275a5908b5650488e0b0342c2d6cc", {
      subject: String(user.id),
      expiresIn: "1d"
    })

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return tokenReturn;

  }
}

export { AuthenticateUserUseCase };