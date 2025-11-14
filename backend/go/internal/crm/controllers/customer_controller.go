package controllers

import (
	"net/http"
	"strconv"

	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/crm/dto"
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

func (cc *CustomerController) GetCustomerByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.ErrInvalidInput})
		return
	}

	customer, err := cc.service.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, customer)
}

func (cc *CustomerController) CreateCustomer(c *gin.Context) {
	var customer dto.CreateCustomerRequest
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.ErrBindingFailed})
		return
	}

	newCustomer, err := cc.service.CreateCustomer(customer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, newCustomer)
}

func (cc *CustomerController) UpdateCustomer(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.ErrInvalidInput})
		return
	}

	var customer dto.UpdateCustomerRequest
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.ErrBindingFailed})
		return
	}

	err = cc.service.UpdateCustomer(uint(id), customer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (cc *CustomerController) DeleteCustomer(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errors.ErrInvalidInput})
		return
	}
	if err := cc.service.DeleteCustomer(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
