# Angular + Spring Boot Hello Application

This project demonstrates a simple connection between an Angular frontend and a Spring Boot backend.

## Project Structure

```
angular-app/
├── first/                 # Angular application
│   ├── src/app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.config.ts
│   │   └── hello.service.ts
│   └── package.json
└── spring-backend/        # Spring Boot application
    ├── src/main/java/com/example/demo/
    │   ├── DemoApplication.java
    │   └── HelloController.java
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

## How to Run

### 1. Start Spring Boot Backend

```bash
cd spring-backend
mvn spring-boot:run
```

The Spring Boot application will start on `http://localhost:8080`

### 2. Start Angular Frontend

```bash
cd first
npm install
ng serve
```

The Angular application will start on `http://localhost:4200`

## Features

- **Spring Boot Backend**: Provides a REST API endpoint at `/api/hello` that returns "Hello from Spring Boot!"
- **Angular Frontend**: Displays the hello message from the backend and includes a refresh button
- **CORS Configuration**: Spring Boot is configured to allow requests from Angular (localhost:4200)
- **Error Handling**: Angular handles connection errors gracefully

## API Endpoints

- `GET http://localhost:8080/api/hello` - Returns a hello message from Spring Boot

## Technologies Used

- **Backend**: Spring Boot 3.2.0, Java 17
- **Frontend**: Angular 17, TypeScript
- **Build Tools**: Maven (backend), npm (frontend)
