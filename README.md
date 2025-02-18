# Quiz Application

Medical testing application built with Next.js and MariaDB.

## Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Run development containers:
```bash
docker-compose up --build
```

## Production Deployment

### Prerequisites
- Docker and Docker Compose
- Git
- Domain pointing to your server (stomtest.nsmu.ru)

### Deployment Steps

1. Clone the repository on your server
2. Create `.env` file from `.env.example` and update values:
   - Change all passwords
   - Set NEXTAUTH_URL to your domain
   - Generate NEXTAUTH_SECRET (you can use `openssl rand -base64 32`)

3. Build and start containers:
```bash
docker-compose up -d --build
```

4. Initialize database:
```bash
# Run migrations
docker-compose exec app npx prisma db push

# Create admin user
docker-compose exec db mariadb -uquiz_user -p<your-password> quiz_db -e "INSERT INTO Admin (username, password) VALUES ('admin', '$2b$10$8nMJXg.YhQtQpBIrpOxFn.c0qTh0TBc9l9g5VLqYO7uFEMAyoqIpC') ON DUPLICATE KEY UPDATE password = VALUES(password);"
```

### Default Credentials

Admin Panel:
- URL: http://stomtest.nsmu.ru/admin
- Username: admin
- Password: admin123 (change this after first login)

## Security Notes

1. Never commit `.env` files
2. Change all default passwords in production
3. Keep your NEXTAUTH_SECRET secure
4. Regularly update dependencies
