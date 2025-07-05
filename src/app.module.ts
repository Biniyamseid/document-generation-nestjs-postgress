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
        synchronize: true, // Note: Set to false in production
        logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,
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