🔥 Burning Bros Service

🚀 Getting Started

Follow these steps to set up and run the service.

1️⃣ Create Your .env File

Copy .env.example to .env and update any necessary configurations.

cp .env.example .env

2️⃣ Start MongoDB with Docker

Run the following command to start MongoDB using Docker:

docker-compose up -d

3️⃣ Install Dependencies

Run the following command to install the required packages:

npm install

4️⃣ Start the Service

Run the application in development mode:

npm run start:dev

5️⃣ Check Logs

If the service is running successfully, you should see:

LOG BURNING BROS SERVICE IS RUNNING ON PORT 3000

6️⃣ Access the API Documentation

Open your browser and go to:

http://localhost:3000/api-docs

🛠️ Features

🔑 Authentication (/auth)

Handles user authentication, including login and registration.

🛒 Product Management (/products)

Manages products, including creation, retrieval, like
