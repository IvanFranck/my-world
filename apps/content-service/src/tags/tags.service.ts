// src/tags/tags.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { v4 as uuid } from 'uuid';
import { SlugGenerator } from '../common/utils/slug-generator.util';
import { TagsRepository } from './repositories/tags.reposiory';

@Injectable()
export class TagsService {
  constructor(
    private readonly repository: TagsRepository,
    private readonly slugGenerator: SlugGenerator,
  ) {}

  async create(dto: CreateTagDto): Promise<TagEntity> {
    // Vérifier que le nom n'existe pas déjà
    const nameExists = await this.repository.nameExists(dto.name);
    if (nameExists) {
      throw new ConflictException(`Tag with name "${dto.name}" already exists`);
    }

    // Générer ou valider le slug
    const slug = dto.slug || this.slugGenerator.generate(dto.name);

    // Vérifier que le slug n'existe pas
    const slugExists = await this.repository.slugExists(slug);
    if (slugExists) {
      throw new ConflictException(`Tag with slug "${slug}" already exists`);
    }

    // Créer l'entité
    const tag = new TagEntity(uuid(), dto.name, slug);

    return this.repository.create(tag);
  }

  async findAll(): Promise<TagEntity[]> {
    return this.repository.findAll();
  }

  async findAllWithArticleCount() {
    return this.repository.findAllWithArticleCount();
  }

  async findById(id: string): Promise<TagEntity> {
    const tag = await this.repository.findById(id);

    if (!tag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    return tag;
  }

  async findBySlug(slug: string): Promise<TagEntity> {
    const tag = await this.repository.findBySlug(slug);

    if (!tag) {
      throw new NotFoundException(`Tag with slug "${slug}" not found`);
    }

    return tag;
  }

  async update(id: string, dto: UpdateTagDto): Promise<TagEntity> {
    await this.findById(id);

    // Si le nom change, vérifier qu'il n'existe pas déjà
    if (dto.name) {
      const nameExists = await this.repository.nameExists(dto.name, id);
      if (nameExists) {
        throw new ConflictException(
          `Tag with name "${dto.name}" already exists`,
        );
      }
    }

    // Si le slug change, vérifier qu'il n'existe pas
    if (dto.slug) {
      const slugExists = await this.repository.slugExists(dto.slug, id);
      if (slugExists) {
        throw new ConflictException(
          `Tag with slug "${dto.slug}" already exists`,
        );
      }
    }

    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.delete(id);
  }

  async search(query: string, limit?: number) {
    return this.repository.search(query, limit);
  }

  async findPopular(limit?: number) {
    return this.repository.findPopular(limit);
  }
}
