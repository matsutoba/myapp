package controllers

import (
	"net/http"

	"github.com/matsubara/myapp/internal/crm/services"

	"github.com/gin-gonic/gin"
)

/*
 * interface
 */
type UserController struct {
	service services.UserService
}

/*
 * struct
 */

func NewUserController(s services.UserService) *UserController {
	return &UserController{service: s}
}

func (cc *UserController) GetUsers(c *gin.Context) {
	customers, err := cc.service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, customers)
}
