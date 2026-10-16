FROM php:8.2-fpm

# Install system dependencies & modern Node.js (needed for Vite / Inertia build)
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
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Clear cache to keep image size small
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files into the container
COPY . /var/www/html

# Install PHP production dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies (we build during startup now so env vars are present)
RUN npm install

# Set proper permissions for Laravel storage, cache, and public build assets
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public

# Expose port (Render overrides this with $PORT)
EXPOSE 10000

# Build frontend assets at runtime (accessing Render env vars), clear caches, migrate, and start server
CMD npm run build && \
    php artisan config:clear && \
    php artisan cache:clear && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-10000}