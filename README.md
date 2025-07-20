# 🚀 Microservice Architecture with DevOps Pipeline

This project demonstrates a **microservice architecture** using **Node.js**, **Python**, **React (Frontend)**, and **MongoDB**, all containerized with **Docker** and orchestrated with **Docker Compose**.  
It also integrates **CI/CD with Jenkins** for automated builds and deployments.

---

## 📌 **Architecture Overview**

### **Services**
1. **Auth Service (Node.js)**
   - Handles **user signup, login, authentication** (JWT-based).
   - Manages **cart and orders**.
   - Exposes REST APIs for the frontend.

2. **Payment & Health Service (Python Flask)**
   - Handles **order payments**.
   - Provides **health-food suggestions** based on preferences.
   - Communicates with the Auth Service.

3. **React Frontend**
   - A modern UI built with React.
   - Consumes REST APIs from Node.js & Python services.
   - Handles login, signup, product listing, cart, and payments.

4. **MongoDB Database**
   - Stores users, products, and order details.

---

## ⚙ **Tech Stack**

- **Frontend:** React, Axios, React Router, Toastify
- **Backend:** Node.js (Express), Python (Flask)
- **Database:** MongoDB
- **Containerization:** Docker, Docker Compose
- **Authentication:** JWT
- **CI/CD:** Jenkins
- **Others:** CORS, dotenv

---

## 🏗 **Project Structure**

## **Prerequisites**

Before running the project, make sure you have the following installed:

- **[Node.js](https://nodejs.org/)** (v16+ recommended)
- **[npm](https://www.npmjs.com/)** (comes with Node.js)
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**
- **[MongoDB](https://www.mongodb.com/try/download/community)** (if using local MongoDB)
- **[Git](https://git-scm.com/)**


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file for Nodejs Service


```
MONGO_URI=mongodb://host.docker.internal:27017/MicroService
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=6h
```






## **Run Locally** 

### **1. Clone the Repository**
```bash
git clone https://github.com/Angat13/Microservice-Architecture-DevOps.git
cd Microservice-Architecture-DevOps
```

## **2. Run Backend Services with Docker**
Make sure Docker Desktop is running, then execute:

```bash
docker-compose up --build

```

This will build and start all backend microservices:

Node.js service → http://localhost:5000

Python service → http://localhost:5002

## ***3. Run the React Frontend***
In a separate terminal:

```bash

cd Frontend
npm install
npm start
```

The React app will start on http://localhost:3000 and will communicate with the backend services.


## ***4. MongoDB Requirement***
Ensure MongoDB is installed and running locally (or in a container).
If using a local MongoDB instance, run:

```bash
mongod
```
