package errors

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type apiError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func WriteError(c *gin.Context, status int, err error) {
	var body apiError
	if ae, ok := err.(*AppError); ok && ae != nil {
		body = apiError{Code: ae.Code, Message: ae.Message}
	} else {
		switch status {
		case http.StatusBadRequest:
			body = apiError{Code: ErrInvalidInput.Code, Message: ErrInvalidInput.Message}
		case http.StatusNotFound:
			body = apiError{Code: ErrNotFound.Code, Message: ErrNotFound.Message}
		case http.StatusConflict:
			body = apiError{Code: ErrDuplicateEntry.Code, Message: ErrDuplicateEntry.Message}
		default:
			body = apiError{Code: 5000, Message: "internal server error"}
		}
	}
	c.JSON(status, gin.H{"error": body})
}
