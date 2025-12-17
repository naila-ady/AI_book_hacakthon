FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        gnupg \
        libpq-dev \
        gcc \
        postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Change to the backend directory
WORKDIR /app/backend/chatbot-backend

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Create a startup script
RUN echo '#!/bin/bash\nexec uvicorn app.main:app --host=0.0.0.0 --port=${PORT:-8000}' > /start.sh
RUN chmod +x /start.sh

# Run the application
CMD ["/start.sh"]