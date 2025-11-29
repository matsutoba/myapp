package controller

import (
	"net/http"
	"strconv"

	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/user/dto"
	"github.com/matsubara/myapp/internal/user/service"

	"github.com/gin-gonic/gin"
)

/*
 * interface
 */
type UserController struct {
	service service.UserService
}

/*
 * struct
 */

func NewUserController(s service.UserService) *UserController {
	return &UserController{service: s}
}

func (uc *UserController) GetUsers(c *gin.Context) {

	const defaultTake = 20
	maxTake := 100

	// take の解析
	takeParam := c.DefaultQuery("take", "")
	take := defaultTake
	if takeParam != "" {
		if t, err := strconv.Atoi(takeParam); err == nil {
			take = t
		}
	}
	if take <= 0 {
		take = defaultTake
	}
	if take > maxTake {
		take = maxTake
	}

	// skip の解析（デフォルト 0）
	skip := 0
	if skipParam := c.DefaultQuery("skip", ""); skipParam != "" {
		if s, err := strconv.Atoi(skipParam); err == nil && s >= 0 {
			skip = s
		}
	}

	keyword := c.Query("keyword")
	users, total, err := uc.service.GetUsers(skip, take, keyword)
	if err != nil {
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, dto.ToUserListPagedResponse(users, total, skip, take))
}

func (uc *UserController) GetUserByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}

	user, err := uc.service.FindUserByID(uint(id))
	if err != nil {
		if err == errors.AppErrUserNotFound || err == errors.ErrNotFound {
			errors.WriteError(c, http.StatusNotFound, err)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, dto.ToUserResponse(user))
}

func (uc *UserController) CreateUser(c *gin.Context) {
	var user dto.CreateUserRequest
	if err := c.ShouldBindJSON(&user); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	newUser, err := uc.service.CreateUser(user)
	if err != nil {
		if err == errors.AppErrUserAlreadyExists {
			errors.WriteError(c, http.StatusConflict, err)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusCreated, dto.ToUserResponse(newUser))
}

func (uc *UserController) UpdateUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}

	var user dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&user); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	_, err = uc.service.UpdateUser(uint(id), user)
	if err != nil {
		if err == errors.AppErrUserNotFound || err == errors.ErrNotFound {
			errors.WriteError(c, http.StatusNotFound, err)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (uc *UserController) DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}
	if err := uc.service.DeleteUser(uint(id)); err != nil {
		// 削除対象が存在しない場合でも No Content を返す
		if err == errors.ErrNotFound || err == errors.AppErrUserNotFound {
			c.Status(http.StatusNoContent)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.Status(http.StatusNoContent)
}
