import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    // Create admin user
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      const admin = this.userRepository.create({
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log('Admin user created: admin@example.com / admin123');
    }

    // Create regular user
    const userExists = await this.userRepository.findOne({
      where: { email: 'user@example.com' },
    });

    if (!userExists) {
      const user = this.userRepository.create({
        fullName: 'Regular User',
        email: 'user@example.com',
        password: 'user123',
        role: UserRole.USER,
      });
      await this.userRepository.save(user);
      console.log('Regular user created: user@example.com / user123');
    }
  }
} 