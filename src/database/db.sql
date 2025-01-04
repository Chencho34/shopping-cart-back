CREATE TABLE products (
    id SERIAL PRIMARY KEY, -- Identificador único
    img TEXT NOT NULL, -- URL de la imagen
    title TEXT NOT NULL, -- Título del producto
    price NUMERIC(10, 2) NOT NULL, -- Precio del producto
    quantity INTEGER NOT NULL, -- Cantidad de productos (debe ser >= 0)
    description TEXT NOT NULL, -- Descripción del producto
    category TEXT NOT NULL, -- Categoría del producto
    discount NUMERIC(5, 2) -- Descuento en porcentaje (opcional)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);