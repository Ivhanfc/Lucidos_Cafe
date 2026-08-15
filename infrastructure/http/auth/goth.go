package auth

import (
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
	store := sessions.NewCookieStore([]byte(cfg.SessionSecret))
	store.MaxAge(int(12 * time.Hour) / time.Now().Second())
	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = false
	store.Options.SameSite = http.SameSiteLaxMode // SameSiteLaxMode

	gothic.Store = store
	goth.UseProviders(
		google.New(cfg.GoogleKey, cfg.GoogleSecret, cfg.CallbackURL),
	)
}