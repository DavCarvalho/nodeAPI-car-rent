import { parse } from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

interface IImportCategory {
  name: string;
  description: string;
}

@injectable()
class ImportCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoryRepository: ICategoriesRepository
  ) { }

  //responsavel somente por fazer a leitura das nossas categorias
  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const categories: IImportCategory[] = [];

      //funcao que fazer a leitura do nosso arquivo em partes 
      const stream = fs.createReadStream(file.path);

      const parseFile = parse();
      //pega o que esta lendo dentro do nosso stream, e joga pro lugar que a gente determina
      stream.pipe(parseFile);

      parseFile.on("data", async (line) => {
        //receebr ["name", "description"]
        const [name, description] = line;
        categories.push({
          name,
          description
        });
      });
      //quando terminar a promise do meu arquivo quero que vc resolve meu categories
      parseFile.on("end", () => {
        fs.promises.unlink(file.path);
        resolve(categories);
      });
      parseFile.on("err", (err) => {
        reject(err);
      })
    })
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    categories.map(async category => {
      const { name, description } = category;

      const existCategory = await this.categoryRepository.findByName(name);

      if (!existCategory) {
        await this.categoryRepository.create({
          name,
          description,
        });
      }
    });
  }
}

export { ImportCategoryUseCase };