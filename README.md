# ToGGar Backend API

## Overview
This is the standalone backend API for the ToGGar e-commerce platform. It provides RESTful endpoints for managing products, categories, user authentication, and admin operations.

## Features
- ✅ User authentication with JWT tokens
- ✅ Role-based access control (Admin/User)
- ✅ Product management
- ✅ Category management
- ✅ MySQL database integration
- ✅ CORS support
- ✅ Password hashing with bcrypt
- ✅ Input validation and error handling

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone or navigate to the backend directory:**
   ```bash
   cd toggar-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup database:**
   ```bash
   npm run setup
   # or
   node setup.js
   ```

4. **Start the server:**
   ```bash
   npm start
   # or
   node server.js
   ```

### Development
```bash
npm run dev  # Starts with nodemon for auto-restart
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/category/:categoryId` - Get products by category

### Categories
- `GET /api/categories` - Get all categories

### Admin Routes (Protected)
- `POST /api/admin/categories` - Add category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `POST /api/admin/products` - Add product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Configuration

### Environment Variables (.env)
```env
# Database Configuration
DB_HOST=db27716.public.databaseasp.net
DB_USER=db27716
DB_PASSWORD=Yn7@3N@dEo5%
DB_NAME=db27716

# JWT Secret Key
JWT_SECRET=d70d2f8adaf3a1e8ff9497ad931302c74466833ad61e3dd429726da1df1fb29097dd16e9920f10c6ed8c4277e469a6c1e5766d25925fa3a13a299858811caa33

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Setup
The setup script will create:
- `accounts` table for user management
- `categories` table for product categories
- `products` table for product inventory
- Sample data including admin and regular users

### Default Credentials
- **Admin:** admin@toggar.com / password
- **User:** user@toggar.com / password

## Project Structure
```
toggar-backend/
├── server.js          # Main server file
├── setup.js           # Database setup script
├── package.json       # Dependencies and scripts
├── .env              # Environment configuration
└── README.md         # This file
```

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@toggar.com","password":"password"}'
```

### Get Products (Protected Route)
```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Input validation
- SQL injection prevention

## Deployment

### Local Development
```bash
npm install
npm run setup  # Setup database
npm run dev    # Start development server
```

### Production
```bash
npm install --production
npm run setup  # Setup database
npm start      # Start production server
```

## Troubleshooting

### Database Connection Issues
1. Verify database credentials in `.env`
2. Check if your IP is whitelisted by the hosting provider
3. Ensure the database server allows remote connections

### Port Issues
- Default port is 5000
- Change PORT in `.env` if needed
- Ensure no other application is using the port

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Support
For issues and questions:
1. Check the troubleshooting section
2. Verify your database configuration
3. Ensure all environment variables are set correctly

## License
MIT License - see package.json for details.
