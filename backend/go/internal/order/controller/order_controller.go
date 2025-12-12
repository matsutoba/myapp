package controller

import (
	"net/http"
	"time"

	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/matsubara/myapp/internal/common/errors"
	"github.com/matsubara/myapp/internal/domain"
	"github.com/matsubara/myapp/internal/order/dto"
	"github.com/matsubara/myapp/internal/order/service"
	"gorm.io/gorm"
)

type OrderController struct {
	service service.OrderService
}

func NewOrderController(s service.OrderService) *OrderController {
	return &OrderController{service: s}
}

func (oc *OrderController) GetAggregates(c *gin.Context) {
	var req dto.AggregatesRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	period := req.Period
	if period == "" {
		period = "day"
	}

	start, err := time.Parse("2006-01-02", req.Start)
	if err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}
	end, err := time.Parse("2006-01-02", req.End)
	if err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}

	// `End` を日付文字列でパースすると時刻が 00:00:00 になるため、
	// その日を含めるには範囲の終端を `YYYY-MM-DD 23:59:59.999...` にする必要があります。
	// ここでは翌日の 00:00:00 に進めてから 1 ナノ秒戻すことで、実質的に「その日の終わり」を表現します。
	end = end.AddDate(0, 0, 1).Add(-time.Nanosecond)

	rows, err := oc.service.GetAggregates(start, end, period, req.Status, req.Category)
	if err != nil {
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, rows)
}

func (oc *OrderController) GetByCustomer(c *gin.Context) {
	var req dto.ByCustomerRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	limit := req.Limit
	if limit == 0 {
		limit = 20
	}

	data, err := oc.service.GetOrdersByCustomer(req.CustomerID, limit, req.Offset)
	if err != nil {
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, data)
}

func (oc *OrderController) ListOrders(c *gin.Context) {
	// optional pagination
	type reqParams struct {
		Limit  int `form:"limit" binding:"omitempty,min=1"`
		Offset int `form:"offset" binding:"omitempty,min=0"`
	}
	var req reqParams
	if err := c.ShouldBindQuery(&req); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	limit := req.Limit
	if limit == 0 {
		limit = 20
	}

	// optional search query
	q := c.Query("q")
	var data []domain.Order
	var total int64
	var err error
	if q != "" {
		// search mode
		data, err = oc.service.GetOrdersWithQuery(q, limit, req.Offset)
		if err != nil {
			errors.WriteError(c, http.StatusInternalServerError, err)
			return
		}
		total, err = oc.service.CountOrdersWithQuery(q)
		if err != nil {
			errors.WriteError(c, http.StatusInternalServerError, err)
			return
		}
	} else {
		data, err = oc.service.GetOrders(limit, req.Offset)
		if err != nil {
			errors.WriteError(c, http.StatusInternalServerError, err)
			return
		}
		if err := oc.service.CountOrders(&total); err != nil {
			errors.WriteError(c, http.StatusInternalServerError, err)
			return
		}
	}

	// Use DTO converter to build a consistent paged response
	resp := dto.ToOrderListPagedResponse(data, total, req.Offset, limit)
	c.JSON(http.StatusOK, resp)
}

func (oc *OrderController) GetOrderById(c *gin.Context) {
	idParam := c.Param("id")
	var id uint64
	if _, err := fmt.Sscan(idParam, &id); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}

	order, err := oc.service.GetOrderByID(uint(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			errors.WriteError(c, http.StatusNotFound, errors.AppErrOrderNotFound)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, err)
		return
	}

	// Use DTO converter for consistent single-order response
	resp := dto.ToOrderResponse(order)
	c.JSON(http.StatusOK, resp)
}

func (oc *OrderController) CreateOrder(c *gin.Context) {
	var req dto.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	created, err := oc.service.CreateOrder(req)
	if err != nil {
		errors.WriteError(c, http.StatusInternalServerError, errors.AppErrOrderCreateFailed)
		return
	}
	c.JSON(http.StatusCreated, created)
}

func (oc *OrderController) UpdateOrder(c *gin.Context) {
	idParam := c.Param("id")
	var id uint64
	if _, err := fmt.Sscan(idParam, &id); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}

	var req dto.UpdateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrBindingFailed)
		return
	}

	updated, err := oc.service.UpdateOrder(uint(id), req)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			errors.WriteError(c, http.StatusNotFound, errors.AppErrOrderNotFound)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, errors.AppErrOrderUpdateFailed)
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (oc *OrderController) DeleteOrder(c *gin.Context) {
	idParam := c.Param("id")
	var id uint64
	if _, err := fmt.Sscan(idParam, &id); err != nil {
		errors.WriteError(c, http.StatusBadRequest, errors.ErrInvalidInput)
		return
	}

	if err := oc.service.DeleteOrder(uint(id)); err != nil {
		if err == gorm.ErrRecordNotFound {
			errors.WriteError(c, http.StatusNotFound, errors.AppErrOrderNotFound)
			return
		}
		errors.WriteError(c, http.StatusInternalServerError, errors.AppErrOrderDeleteFailed)
		return
	}
	// Ensure 204 No Content is sent explicitly
	// Ensure 204 No Content is returned and no further handlers run
	c.AbortWithStatus(http.StatusNoContent)
}
