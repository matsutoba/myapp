package controller

import (
	"net/http"
	"strconv"

	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/customer/dto"
	"github.com/matsubara/myapp/internal/customer/service"

	"github.com/gin-gonic/gin"
)

/*
 * interface
 */
type CustomerController struct {
	service service.CustomerService
}

/*
 * struct
 */

func NewCustomerController(s service.CustomerService) *CustomerController {
	return &CustomerController{service: s}
}

func (cc *CustomerController) GetCustomers(c *gin.Context) {
	// ページネーション/検索対応
	if c.Query("page") == "" && c.Query("skip") == "" && c.Query("take") == "" {
		// キーワード検索がなければ全件
		keyword := c.Query("keyword")
		if keyword == "" {
			customers, err := cc.service.GetAllCustomers()
			if err != nil {
				errors.WriteError(c, http.StatusInternalServerError, err)
				return
			}
			c.JSON(http.StatusOK, dto.ToCustomerListResponse(customers))
			return
		}

		// キーワードあり：検索（全件取得ではなく検索結果）
		customers, _, err := cc.service.GetCustomers(0, 1000, keyword)
		if err != nil {
			errors.WriteError(c, http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, dto.ToCustomerListResponse(customers))
		return
	}

	const defaultTake = 20
	maxTake := 100

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

	skip := 0
	if pageParam := c.DefaultQuery("page", ""); pageParam != "" {
		if p, err := strconv.Atoi(pageParam); err == nil && p > 0 {
			skip = (p - 1) * take
		}
	} else if skipParam := c.DefaultQuery("skip", ""); skipParam != "" {
		if s, err := strconv.Atoi(skipParam); err == nil && s >= 0 {
			skip = s
		}
	}

	keyword := c.Query("keyword")
	customers, total, err := cc.service.GetCustomers(skip, take, keyword)
	if err != nil {
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, dto.ToCustomerListPagedResponse(customers, total, skip, take))
}

func (cc *CustomerController) GetCustomerByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}

	customer, err := cc.service.FindByID(uint(id))
	if err != nil {
		if err == errors.AppErrCustomerNotFound || err == errors.ErrNotFound {
			errors.WriteError(c, http.StatusNotFound, err)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, dto.ToCustomerResponse(customer))
}

func (cc *CustomerController) CreateCustomer(c *gin.Context) {
	var customer dto.CreateCustomerRequest
	if err := c.ShouldBindJSON(&customer); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	newCustomer, err := cc.service.CreateCustomer(customer)
	if err != nil {
		if err == errors.AppErrCustomerAlreadyExists {
			errors.WriteError(c, http.StatusConflict, err)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusCreated, dto.ToCustomerResponse(newCustomer))
}

func (cc *CustomerController) UpdateCustomer(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}

	var customer dto.UpdateCustomerRequest
	if err := c.ShouldBindJSON(&customer); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	_, err = cc.service.UpdateCustomer(uint(id), customer)
	if err != nil {
		if err == errors.AppErrCustomerNotFound || err == errors.ErrNotFound {
			errors.WriteError(c, http.StatusNotFound, err)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (cc *CustomerController) DeleteCustomer(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}
	if err := cc.service.DeleteCustomer(uint(id)); err != nil {
		// 削除対象が存在しない場合でも No Content を返す
		if err == errors.ErrNotFound || err == errors.AppErrCustomerNotFound {
			c.Status(http.StatusNoContent)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.Status(http.StatusNoContent)
}
