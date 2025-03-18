# Lista de Compras Backend

This is the backend for the "Lista de Compras" application, which manages a shopping list. It is built using Node.js, Express, and MongoDB.

## Features

- Add, update, delete, and fetch items from the shopping list
- CORS support for cross-origin requests
- Environment variable configuration using dotenv
- TypeScript for type safety
- Express for routing
- Online MongoDB database

## Requirements

- Node.js
- MongoDB

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/lista-de-compras-backend.git
    cd lista-de-compras-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    MONGO_DATABASE=your_database_name
    MONGO_COLLECTION=your_collection_name
    MONGO_USER=your_mongo_user
    MONGO_PASSWORD=your_mongo_password
    MONGO_CLUSTER=your_mongo_cluster
    MONGO_SETTINGS=your_mongo_settings
    PORT=3000
    ```

## Running the Application

### Development

To run the application in development mode:
```sh
npm run dev
```

### Production

To run the application in production mode:
```sh
npm run build
npm start
```

## API Documentation

The API documentation is available at TODO

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have any improvements to the project.

## License

This project is licensed under the [MIT License](LICENSE) file for details.
