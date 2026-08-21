package auth

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

type OAuthConfig struct {
	SessionSecret string
	GoogleKey string
	GoogleSecret string
	CallbackURL string
}
func InitOAuth(cfg OAuthConfig) {
	if cfg.CallbackURL == "" {
		log.Fatalf("CRITICAL ERROR: CallbackURL is empty. Check your .env file at the project root and include CALLBACK_URL=http://localhost:8080/auth/google/callback")
	}
	
	store := sessions.NewCookieStore([]byte(cfg.SessionSecret))
	store.MaxAge(int(12 * time.Hour.Seconds()))
	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = false
	store.Options.SameSite = http.SameSiteLaxMode // SameSiteLaxMode

	gothic.Store = store
	goth.UseProviders(
		google.New(cfg.GoogleKey, cfg.GoogleSecret, cfg.CallbackURL, "email", "profile"),
	)
}