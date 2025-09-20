const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
  let connection;

  try {
    // Create connection with remote database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'db27716.public.databaseasp.net',
      user: process.env.DB_USER || 'db27716',
      password: process.env.DB_PASSWORD || 'Yn7@3N@dEo5%',
      port: 3306
    });

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS db27716');
    console.log('✅ Database created successfully');

    // Use the database
    await connection.execute('USE db27716');

    // Create accounts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT DEFAULT 0,
        category_id INT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tables created successfully');

    // Insert default admin user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password', salt);

    await connection.execute(`
      INSERT INTO accounts (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE id=id
    `, ['Admin User', 'admin@toggar.com', passwordHash, 'admin']);

    // Insert default regular user
    await connection.execute(`
      INSERT INTO accounts (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE id=id
    `, ['Regular User', 'user@toggar.com', passwordHash, 'user']);

    console.log('✅ Default users created successfully');

    // Insert sample categories
    const categories = [
      'Screens',
      'Batteries',
      'Cases',
      'Chargers',
      'Cables',
      'Headphones',
      'Screen Protectors'
    ];

    for (const categoryName of categories) {
      await connection.execute(`
        INSERT INTO categories (name)
        VALUES (?)
        ON DUPLICATE KEY UPDATE id=id
      `, [categoryName]);
    }

    console.log('✅ Sample categories created successfully');

    // Insert sample products
    const sampleProducts = [
      ['iPhone 14 Screen', 'Original iPhone 14 OLED Screen Replacement', 299.99, 50, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'],
      ['Samsung Galaxy S23 Battery', 'Original Samsung Galaxy S23 Battery 3900mAh', 45.99, 30, 'https://images.unsplash.com/photo-1609592806719-7d3d7d7f5b2f?w=300'],
      ['iPhone 14 Pro Case', 'Premium Leather Case for iPhone 14 Pro', 39.99, 100, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300'],
      ['Fast Charger 65W', 'USB-C Fast Charger 65W with Cable', 29.99, 75, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300'],
      ['USB-C Cable 2m', 'Premium USB-C to USB-C Cable 2 meters', 15.99, 200, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300'],
      ['Wireless Earbuds', 'Bluetooth 5.0 Wireless Earbuds with Case', 79.99, 40, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300'],
      ['Screen Protector Pack', 'Tempered Glass Screen Protector (3 Pack)', 12.99, 150, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300'],
      ['iPhone 13 Battery', 'Original iPhone 13 Battery Replacement', 39.99, 25, 'https://images.unsplash.com/photo-1609592806719-7d3d7d7f5b2f?w=300']
    ];

    // Get category IDs
    const [categoryRows] = await connection.execute('SELECT id, name FROM categories');
    const categoryMap = {};
    categoryRows.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    for (const [name, description, price, stock, imageUrl] of sampleProducts) {
      // Assign to first few categories
      const categoryId = categoryMap[Object.keys(categoryMap)[Math.floor(Math.random() * 3)]];

      await connection.execute(`
        INSERT INTO products (name, description, price, stock, category_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE id=id
      `, [name, description, price, stock, categoryId, imageUrl]);
    }

    console.log('✅ Sample products created successfully');
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Default Login Credentials:');
    console.log('   Admin: admin@toggar.com / password');
    console.log('   User:  user@toggar.com / password');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
