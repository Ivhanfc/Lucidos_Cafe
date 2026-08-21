package postgres

import (
	"context"
	"testing"

	"lucidos_cafe/internal/domain/user"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestUserRepositorySave_InsertsAllUserFields(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to create sqlmock: %v", err)
	}
	defer db.Close()

	repo := NewUserRepository(db)
	newUser, err := user.NewUser("user-123", "Test User", "test@example.com", "hashed-password")
	if err != nil {
		t.Fatalf("failed to build user: %v", err)
	}

	createdAt := newUser.GetCreatedAt()
	updatedAt := newUser.GetUpdatedAt()

	mock.ExpectExec("INSERT INTO users").
		WithArgs(
			"user-123",
			"Test User",
			"test@example.com",
			"hashed-password",
			"",
			0,
			nil,
			0,
			createdAt,
			updatedAt,
		).
		WillReturnResult(sqlmock.NewResult(1, 1))

	if err := repo.Save(context.Background(), newUser); err != nil {
		t.Fatalf("Save returned error: %v", err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet SQL expectations: %v", err)
	}
}
