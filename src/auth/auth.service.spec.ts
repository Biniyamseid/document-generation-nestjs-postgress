import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../common/enums/user-role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: '1',
    fullName: 'Test User',
    email: 'test@example.com',
    role: UserRole.USER,
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser as any);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: '1',
          fullName: 'Test User',
          email: 'test@example.com',
          role: UserRole.USER,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      usersService.findByEmail.mockResolvedValue(mockUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      mockUser.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
    });

    it('should return null if credentials are invalid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      mockUser.validatePassword.mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });
}); 