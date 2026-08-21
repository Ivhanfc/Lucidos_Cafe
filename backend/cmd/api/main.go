package main

import (
	"database/sql"
	"log"
	appHTTP "lucidos_cafe/internal/infrastructure/http"
	"lucidos_cafe/internal/infrastructure/http/auth"
	"lucidos_cafe/internal/infrastructure/http/handler"
	postgresPersistence "lucidos_cafe/internal/infrastructure/persistence/memory/postgres"
	redisPersistence "lucidos_cafe/internal/infrastructure/persistence/memory/redis"
	"lucidos_cafe/internal/ports"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Info: .env file not found")
	}

	auth.InitOAuth(auth.OAuthConfig{
		SessionSecret: os.Getenv("SESSION_SECRET"),
		GoogleKey:     os.Getenv("CLIENT_ID"),
		GoogleSecret:  os.Getenv("CLIENT_SECRET"),
		CallbackURL:   os.Getenv("CALLBACK_URL"),
	})

	pgCfg := postgresPersistence.Config{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "5432"),
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", ""),
		DBName:   getEnv("DB_NAME", "lucidosdb"),
		SSLMode:  getEnv("DB_SSLMODE", "disable"),
	}

	db, err := postgresPersistence.NewPostgresDB(pgCfg)
	if err != nil {
		log.Fatalf("Error connecting to PostgreSQL: %v", err)
	}
	defer db.Close()

	if err := autoMigrateUsersTable(db); err != nil {
		log.Fatalf("Error running migration for users table: %v", err)
	}

	userRepo := postgresPersistence.NewUserRepository(db)
	orderRepo := postgresPersistence.NewOrderRepository(db)
	var notifier ports.RealtimeNotifier

	redisClient, err := redisPersistence.NewRedisClient("localhost", "6379", "")
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}

	authHandler := handler.NewAuthHandler(userRepo, redisClient)
	orderHandler := handler.NewOrderHandler(orderRepo, notifier)
	router := appHTTP.SetupRouter(authHandler, orderHandler)

	log.Println("Server is running at http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

func autoMigrateUsersTable(db *sql.DB) error {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id VARCHAR(36) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255),
		google_id VARCHAR(255),
		streak_days INT DEFAULT 0,
		loyalty_points INT DEFAULT 0,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		last_order_date TIMESTAMP WITH TIME ZONE
	);
	`
	if _, err := db.Exec(query); err != nil {
		return err
	}

	alterQuery := `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_order_date TIMESTAMP WITH TIME ZONE;`
	if _, err := db.Exec(alterQuery); err != nil {
		return err
	}

	return nil
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}