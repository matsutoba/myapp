package errors

import (
	"fmt"
)

type AppError struct {
	Code    int
	Message string
}

func (e *AppError) Error() string {
	return fmt.Sprintf("[%d] %s", e.Code, e.Message)
}

func NewAppError(code int, message string) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
	}
}

var (
	// DB Errors
	ErrDuplicateEntry = NewAppError(1001, "duplicate entry")
	ErrNotFound       = NewAppError(1002, "not found")
	ErrInsertFailed   = NewAppError(1003, "create failed")
	ErrUpdateFailed   = NewAppError(1004, "update failed")
	ErrDeleteFailed   = NewAppError(1005, "delete failed")

	// Validation Errors
	ErrInvalidInput  = NewAppError(2001, "invalid input")
	ErrBindingFailed = NewAppError(2002, "binding failed")

	// Application Errors (users)
	AppErrUserAlreadyExists = NewAppError(10001, "user already exists")
	AppErrUserNotFound      = NewAppError(10002, "user not found")
	AppErrUserUpdateFailed  = NewAppError(10003, "user update failed")

	// Application Errors (customers)
	AppErrCustomerAlreadyExists = NewAppError(11001, "customer already exists")
	AppErrCustomerNotFound      = NewAppError(11002, "customer not found")
	AppErrCustomerUpdateFailed  = NewAppError(11003, "customer update failed")
)
