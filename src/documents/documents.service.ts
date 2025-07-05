import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, user: User): Promise<Document> {
    const document = this.documentRepository.create({
      ...createDocumentDto,
      ownerId: user.id,
    });

    return await this.documentRepository.save(document);
  }

  async findAll(user: User): Promise<Document[]> {
    if (user.role === UserRole.ADMIN) {
      return await this.documentRepository.find({
        relations: ['owner'],
        order: { createdAt: 'DESC' },
      });
    }

    return await this.documentRepository.find({
      where: { ownerId: user.id },
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Check if user has access to this document
    if (user.role !== UserRole.ADMIN && document.ownerId !== user.id) {
      throw new ForbiddenException('You do not have permission to access this document');
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, user: User): Promise<Document> {
    const document = await this.findOne(id, user);

    // Check if user can edit this document
    if (user.role !== UserRole.ADMIN && document.ownerId !== user.id) {
      throw new ForbiddenException('You do not have permission to edit this document');
    }

    Object.assign(document, updateDocumentDto);
    return await this.documentRepository.save(document);
  }

  async remove(id: string, user: User): Promise<void> {
    const document = await this.findOne(id, user);

    // Only admins can delete documents
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can delete documents');
    }

    await this.documentRepository.remove(document);
  }
} 