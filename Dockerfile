# FROM python:3.9.18-alpine3.18

# RUN apk add build-base

# RUN apk add postgresql-dev gcc python3-dev musl-dev

# ARG FLASK_APP
# ARG FLASK_ENV
# ARG DATABASE_URL
# ARG SCHEMA
# ARG SECRET_KEY

# WORKDIR /var/www

# COPY requirements.txt .

# RUN pip install -r requirements.txt
# RUN pip install psycopg2

# COPY . .

# RUN flask db upgrade
# RUN flask seed all
# CMD gunicorn app:app
FROM python:3.9.18-alpine3.18

# Install necessary build tools and PostgreSQL development files
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev

# Set environment variables
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

# Set the working directory
WORKDIR /var/www

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Run database migrations and seed the database
RUN flask db upgrade
RUN flask seed all

# Start the application with gunicorn
CMD ["gunicorn", "app:app"]

