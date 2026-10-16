FROM php:8.2-fpm

# Install system dependencies and Node.js (needed for Vite / Inertia build)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    nodejs \
    npm

# Clear cache to keep image size small
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (including pdo_pgsql and zip)
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files into the container
COPY . /var/www/html

# Install PHP production dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies and build your Inertia/React frontend assets
RUN npm install && npm run build

# Set proper permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port (Render overrides this with $PORT)
EXPOSE 10000

# Run migrations and start the server using Render's dynamic port
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}