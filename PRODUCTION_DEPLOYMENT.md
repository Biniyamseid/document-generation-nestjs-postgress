# Production Deployment Guide

## 🏗️ **PostgreSQL Production Setup**

This guide helps you deploy your Document Management System with PostgreSQL in production.

## 📋 **Prerequisites**

- Docker & Docker Compose
- Domain name (for HTTPS)
- SSL certificates (Let's Encrypt recommended)

## 🚀 **Option 1: Self-Hosted PostgreSQL**

### **1. Create Production Environment File**

Create a `.env.production` file (never commit this to git):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-super-secure-password-here
DB_DATABASE=document_management_prod

# JWT Configuration
JWT_SECRET=your-256-bit-secret-key-for-production
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=production

# Optional: Enable SSL for database
DB_SSL=true
```

### **2. Deploy with Docker Compose**

```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up -d

# Build and start your application
npm run build
npm run start:prod
```

## ☁️ **Option 2: AWS RDS PostgreSQL (Recommended)**

### **1. Create RDS Instance**

```bash
# AWS CLI example
aws rds create-db-instance \
  --db-instance-identifier document-management-prod \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password your-secure-password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name your-subnet-group
```

### **2. Update Environment Variables**

```env
# Use RDS endpoint
DB_HOST=document-management-prod.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password
DB_DATABASE=document_management
NODE_ENV=production
```

## 🔒 **Security Best Practices**

### **1. Database Security**

- ✅ Use strong passwords (minimum 16 characters)
- ✅ Enable SSL connections
- ✅ Restrict network access (VPC/Security Groups)
- ✅ Regular backups
- ✅ Update PostgreSQL regularly

### **2. Application Security**

- ✅ Use HTTPS only
- ✅ Strong JWT secrets
- ✅ Environment-based configurations
- ✅ No sensitive data in logs

## 📊 **Performance Optimizations**

### **1. Database Optimizations** (Already configured)

```typescript
// In your TypeORM config:
maxQueryExecutionTime: 10000, // 10 seconds timeout
retryAttempts: 3,
retryDelay: 3000,
```

### **2. PostgreSQL Settings** (In docker-compose.prod.yml)

```yaml
command:
  [
    'postgres',
    '-c',
    'max_connections=200',
    '-c',
    'shared_buffers=256MB',
    '-c',
    'effective_cache_size=1GB',
  ]
```

## 🔄 **Database Migrations**

Since `synchronize` is disabled in production, use TypeORM migrations:

```bash
# Generate migration
npm run typeorm:migration:generate -- -n CreateInitialTables

# Run migrations in production
npm run typeorm:migration:run
```

## 📈 **Monitoring & Maintenance**

### **1. Database Monitoring**

- Monitor connection counts
- Watch query performance
- Set up alerts for errors
- Regular backup verification

### **2. Application Monitoring**

- Health check endpoints
- Error rate monitoring
- Performance metrics
- Log aggregation

## 🚦 **Deployment Steps**

1. **Prepare Environment**:

   ```bash
   # Copy environment file
   cp .env.example .env.production
   # Edit with production values
   ```

2. **Database Setup**:

   ```bash
   # Start PostgreSQL
   docker-compose -f docker-compose.prod.yml up -d postgres
   ```

3. **Application Deployment**:

   ```bash
   # Build application
   npm run build

   # Start in production mode
   NODE_ENV=production npm run start:prod
   ```

4. **Verify Deployment**:

   ```bash
   # Check health
   curl http://localhost:3000/health

   # Check API docs
   curl http://localhost:3000/api
   ```

## 🔧 **Troubleshooting**

### **Common Issues**:

1. **Connection Issues**:

   - Check firewall rules
   - Verify database credentials
   - Test database connectivity

2. **Performance Issues**:

   - Monitor database queries
   - Check connection pool settings
   - Review slow query logs

3. **SSL Issues**:
   - Verify SSL certificates
   - Check SSL configuration
   - Test with SSL disabled first

## 📱 **Health Checks**

Add this endpoint to monitor your application:

```bash
# Check if application is healthy
curl http://localhost:3000/health

# Expected response:
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

## 🎯 **Your Current Setup Benefits**

✅ **Same codebase** for development and production  
✅ **PostgreSQL everywhere** - no database complexity  
✅ **Production-ready** configurations included  
✅ **Scalable** with managed services (RDS)  
✅ **Secure** with proper SSL and environment separation  
✅ **Maintainable** with clear deployment processes

Your choice to stick with PostgreSQL everywhere was perfect! 🎉
