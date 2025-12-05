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
	ErrDuplicateEntry = NewAppError(1001, "重複したエントリです")
	ErrNotFound       = NewAppError(1002, "対象が見つかりません")
	ErrInsertFailed   = NewAppError(1003, "作成に失敗しました")
	ErrUpdateFailed   = NewAppError(1004, "更新に失敗しました")
	ErrDeleteFailed   = NewAppError(1005, "削除に失敗しました")

	// Validation Errors
	ErrInvalidInput  = NewAppError(2001, "無効な入力です")
	ErrBindingFailed = NewAppError(2002, "バインディングに失敗しました")

	// Authentication Errors (3xxx)
	ErrUnauthorized  = NewAppError(3001, "メールアドレスまたはパスワードが不正です")
	ErrInvalidToken  = NewAppError(3002, "トークンが無効または期限切れです")
	ErrInvalidAPIKey = NewAppError(3003, "APIキーが無効です")
	ErrMissingToken  = NewAppError(3004, "トークンが見つかりません")

	// Authorization Errors (4xxx)
	ErrForbiddenNoUserContext      = NewAppError(4001, "禁止されています: ユーザーコンテキストがありません")
	ErrForbiddenInvalidUserContext = NewAppError(4002, "禁止されています: ユーザーコンテキストが無効です")
	ErrForbiddenInsufficientPerms  = NewAppError(4003, "禁止されています: 権限が不足しています")

	// Application Errors (users)
	AppErrUserAlreadyExists = NewAppError(10001, "ユーザーは既に存在します")
	AppErrUserNotFound      = NewAppError(10002, "ユーザーが見つかりません")
	AppErrUserUpdateFailed  = NewAppError(10003, "ユーザーの更新に失敗しました")

	// Application Errors (customers)
	AppErrCustomerAlreadyExists = NewAppError(11001, "顧客は既に存在します")
	AppErrCustomerNotFound      = NewAppError(11002, "顧客が見つかりません")
	AppErrCustomerUpdateFailed  = NewAppError(11003, "顧客の更新に失敗しました")

	// Application Errors (orders)
	AppErrOrderNotFound     = NewAppError(12001, "注文が見つかりません")
	AppErrOrderCreateFailed = NewAppError(12002, "注文の作成に失敗しました")
	AppErrOrderUpdateFailed = NewAppError(12003, "注文の更新に失敗しました")
	AppErrOrderDeleteFailed = NewAppError(12004, "注文の削除に失敗しました")
)
