import { getRepository, Repository } from "typeorm";

import { Category } from "../entities/Category";
import { ICategoriesRepository, ICreateCategoryDTO } from "@modules/cars/repositories/ICategoriesRepository";

//singleton


class CategoriesRepository implements ICategoriesRepository {

  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async create({ description, name }: ICreateCategoryDTO): Promise<void> {
    //vai criar nossa entidade para passar
    const category = this.repository.create({
      description,
      name,
    });
    await this.repository.save(category)
  }

  async list(): Promise<Category[]> {
    // o find vai retornar uma lista
    const categories = await this.repository.find();
    return categories;
  }

  async findByName(name: string): Promise<Category> {
    //trazer um registro 
    //Select * from categories where  name = "name" limit 1
    const category = await this.repository.findOne({ name })
    return category;
  }

}

export { CategoriesRepository }