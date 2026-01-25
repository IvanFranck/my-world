import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { SlugGenerator } from '../common/utils/slug-generator.util';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoryEntity } from './entities/categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly repository: CategoriesRepository,
    private readonly slugGenerator: SlugGenerator,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
    // Vérifier que le nom n'existe pas déjà
    const nameExists = await this.repository.nameExists(dto.name);
    if (nameExists) {
      throw new ConflictException(
        `Category with name "${dto.name}" already exists`,
      );
    }

    // Générer ou valider le slug
    const slug = dto.slug || this.slugGenerator.generate(dto.name);

    // Vérifier que le slug n'existe pas
    const slugExists = await this.repository.slugExists(slug);
    if (slugExists) {
      throw new ConflictException(
        `Category with slug "${slug}" already exists`,
      );
    }

    // Créer l'entité
    const category = new CategoryEntity(
      uuid(),
      dto.name,
      slug,
      dto.description || null,
      dto.color || null,
    );

    // Valider la couleur
    if (category.color && !category.isValidColor()) {
      throw new BadRequestException('Invalid color format. Use #RRGGBB');
    }

    return this.repository.create(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.repository.findAll();
  }

  async findAllWithArticleCount() {
    return this.repository.findAllWithArticleCount();
  }

  async findById(id: string): Promise<CategoryEntity> {
    const category = await this.repository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    return category;
  }

  async findBySlug(slug: string): Promise<CategoryEntity> {
    const category = await this.repository.findBySlug(slug);

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryEntity> {
    await this.findById(id); // Vérifier que ça existe

    // Si le nom change, vérifier qu'il n'existe pas déjà
    if (dto.name) {
      const nameExists = await this.repository.nameExists(dto.name, id);
      if (nameExists) {
        throw new ConflictException(
          `Category with name "${dto.name}" already exists`,
        );
      }
    }

    // Si le slug change, vérifier qu'il n'existe pas
    if (dto.slug) {
      const slugExists = await this.repository.slugExists(dto.slug, id);
      if (slugExists) {
        throw new ConflictException(
          `Category with slug "${dto.slug}" already exists`,
        );
      }
    }

    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Vérifier que ça existe
    await this.repository.delete(id);
  }
}
