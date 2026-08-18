package user

import "errors"


var (
	ErrEmptyUserID      = errors.New("el ID de usuario no puede estar vacío")
	ErrEmptyUserName    = errors.New("el nombre de usuario no puede estar vacío")
	ErrInvalidUserEmail = errors.New("el correo electrónico no es válido")
	ErrEmptyPassword    = errors.New("la contraseña es obligatoria para el registro tradicional")
	ErrInvalidPoints    = errors.New("la cantidad de puntos a canjear no es válida")
	ErrUserNotFound     = errors.New("usuario no encontrado")
)