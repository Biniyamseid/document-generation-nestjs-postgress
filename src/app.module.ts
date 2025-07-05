import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { User } from './users/entities/user.entity';
import { Document } from './documents/entities/document.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_DATABASE', 'document_management'),
        entities: [User, Document],
        synchronize: configService.get('NODE_ENV') !== 'production', // Only sync in development
        logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,
        ssl: configService.get('NODE_ENV') === 'production' ? {
          rejectUnauthorized: false, // For managed databases like AWS RDS
        } : false,
        // Production optimizations
        maxQueryExecutionTime: 10000, // 10 seconds timeout
        retryAttempts: 3,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    DocumentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 