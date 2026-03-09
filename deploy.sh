#!/bin/bash
# Script deploy trên server production

# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Stop và remove containers cũ
docker-compose -f docker-compose.prod.yml down

# Start containers mới
docker-compose -f docker-compose.prod.yml up -d

# Show status
docker-compose -f docker-compose.prod.yml ps

# Show logs
echo "Đang xem logs..."
docker-compose -f docker-compose.prod.yml logs -f --tail=50
