import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: jest.Mocked<Repository<Document>>;

  const mockUser: User = {
    id: '1',
    fullName: 'Test User',
    email: 'test@example.com',
    role: UserRole.USER,
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
    documents: [],
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockAdmin: User = {
    ...mockUser,
    id: '2',
    role: UserRole.ADMIN,
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockDocument: Document = {
    id: '1',
    title: 'Test Document',
    content: 'Test content',
    ownerId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get(getRepositoryToken(Document));
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const createDocumentDto: CreateDocumentDto = {
        title: 'New Document',
        content: 'New content',
      };

      repository.create.mockReturnValue(mockDocument);
      repository.save.mockResolvedValue(mockDocument);

      const result = await service.create(createDocumentDto, mockUser);

      expect(result).toEqual(mockDocument);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDocumentDto,
        ownerId: mockUser.id,
      });
    });
  });

  describe('findAll', () => {
    it('should return all documents for admin', async () => {
      repository.find.mockResolvedValue([mockDocument]);

      const result = await service.findAll(mockAdmin);

      expect(result).toEqual([mockDocument]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['owner'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should return only user documents for regular user', async () => {
      repository.find.mockResolvedValue([mockDocument]);

      const result = await service.findAll(mockUser);

      expect(result).toEqual([mockDocument]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { ownerId: mockUser.id },
        relations: ['owner'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return document for owner', async () => {
      repository.findOne.mockResolvedValue(mockDocument);

      const result = await service.findOne('1', mockUser);

      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner and not admin', async () => {
      const otherUserDocument = { ...mockDocument, ownerId: '999' };
      repository.findOne.mockResolvedValue(otherUserDocument);

      await expect(service.findOne('1', mockUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should allow admin to delete any document', async () => {
      repository.findOne.mockResolvedValue(mockDocument);
      repository.remove.mockResolvedValue(mockDocument);

      await service.remove('1', mockAdmin);

      expect(repository.remove).toHaveBeenCalledWith(mockDocument);
    });

    it('should throw ForbiddenException if regular user tries to delete', async () => {
      repository.findOne.mockResolvedValue(mockDocument);

      await expect(service.remove('1', mockUser)).rejects.toThrow(ForbiddenException);
    });
  });
}); 