package controllers

import (
	"net/http"

	"github.com/matsubara/myapp/internal/crm/services"

	"github.com/gin-gonic/gin"
)

func GetCustomers(c *gin.Context) {
	customers := services.GetAllCustomers()
	c.JSON(http.StatusOK, customers)
}
