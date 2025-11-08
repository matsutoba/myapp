package controllers

import (
	"net/http"

	"github.com/matsubara/myapp/internal/crm/services"

	"github.com/gin-gonic/gin"
)

/*
 * interface
 */
type CustomerController struct {
	service services.CustomerService
}

/*
 * struct
 */

func NewCustomerController(s services.CustomerService) *CustomerController {
	return &CustomerController{service: s}
}

func (cc *CustomerController) GetCustomers(c *gin.Context) {
	customers, err := cc.service.GetAllCustomers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, customers)
}
