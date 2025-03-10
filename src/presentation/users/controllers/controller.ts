import { Request, Response } from "express";
import { UserRepository } from "@/domain/repositories";
import { UpdateUserDto } from "@/domain/dtos";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  GetUsers,
  UpdateUser,
} from "@/domain/use-cases";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { AuthRepository } from "@/domain/repositories/auth.repository";

export class UserController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository
  ) {}

  public createUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterDto.create(req.body);

    if (error) return res.status(400).json({ error });

    new CreateUser(this.authRepository, this.userRepository)
      .execute(registerDto!)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };

  public getUsers = (req: Request, res: Response) => {
    new GetUsers(this.userRepository)
      .execute()
      .then((users) => res.json(users))
      .catch((error) => res.status(400).json(error));
  };

  public getUserById = (req: Request, res: Response) => {
    const { id } = req.params;

    new GetUser(this.userRepository)
      .execute(id)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };

  public updateUser = (req: Request, res: Response) => {
    const [error, updateUserDto] = UpdateUserDto.create(req.body);
    if (error) {
      res.status(400).json(error);
      return;
    }

    new UpdateUser(this.userRepository)
      .execute(updateUserDto!)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };
  public deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;

    new DeleteUser(this.userRepository)
      .execute(id)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };
}
