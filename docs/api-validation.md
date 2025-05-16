# Expense Tracker API Validation Documentation

This document outlines the validation rules applied to API requests in the Expense Tracker API.

## Expense Endpoints

### POST /api/expense/add-expense

Creates a new expense or income transaction.

**Validation Rules:**
- `title`: Required, string, 2-100 characters
- `amount`: Required, numeric, greater than 0
- `category`: Required, valid MongoDB ObjectId
- `type`: Required, must be either "income" or "expense"
- `date`: Optional, must be in ISO8601 format (YYYY-MM-DD)

### PUT /api/expense/update-expense/:id

Updates an existing expense.

**Validation Rules:**
- `id` (URL parameter): Required, valid MongoDB ObjectId
- `title`: Optional, string, 2-100 characters
- `amount`: Optional, numeric, greater than 0
- `category`: Optional, valid MongoDB ObjectId
- `type`: Optional, must be either "income" or "expense"
- `date`: Optional, must be in ISO8601 format (YYYY-MM-DD)

### GET /api/expense/get-expense-by-user

Gets all expenses for the authenticated user.

**Query Parameters:**
- `page`: Optional, numeric, default: 1
- `limit`: Optional, numeric, default: 10
- `sortBy`: Optional, field to sort by, default: 'date'
- `sortOrder`: Optional, 'asc' or 'desc', default: 'desc'

### GET /api/expense/get-expense-by-id/:id

Gets a specific expense by ID.

**Validation Rules:**
- `id` (URL parameter): Required, valid MongoDB ObjectId

### GET /api/expense/get-expense-by-type

Gets expenses filtered by type.

**Validation Rules:**
- `type` (Query parameter): Required, must be either "income" or "expense"
- `page`: Optional, numeric, default: 1
- `limit`: Optional, numeric, default: 10
- `sortBy`: Optional, field to sort by, default: 'date'
- `sortOrder`: Optional, 'asc' or 'desc', default: 'desc'

### GET /api/expense/get-expense-by-category

Gets expenses filtered by category.

**Validation Rules:**
- `category` (Query parameter): Required, valid MongoDB ObjectId
- `page`: Optional, numeric, default: 1
- `limit`: Optional, numeric, default: 10
- `sortBy`: Optional, field to sort by, default: 'date'
- `sortOrder`: Optional, 'asc' or 'desc', default: 'desc'

### GET /api/expense/get-expense-by-date-range

Gets expenses between two dates.

**Validation Rules:**
- `startDate`: Required, ISO8601 format (YYYY-MM-DD)
- `endDate`: Required, ISO8601 format (YYYY-MM-DD)
- `page`: Optional, numeric, default: 1
- `limit`: Optional, numeric, default: 10
- `sortBy`: Optional, field to sort by, default: 'date'
- `sortOrder`: Optional, 'asc' or 'desc', default: 'desc'

**Additional rule:** `endDate` must be after or equal to `startDate`

### DELETE /api/expense/delete-expense/:id

Deletes an expense.

**Validation Rules:**
- `id` (URL parameter): Required, valid MongoDB ObjectId

## Error Responses

When validation fails, the API responds with:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "param": "field_name",
      "msg": "Error message",
      "location": "body|query|param"
    }
  ]
}
```

## Pagination Response Format

List endpoints return paginated results in the following format:

```json
{
  "success": true,
  "message": "Expenses fetched successfully",
  "expenses": [...],
  "pagination": {
    "totalExpenses": 25,
    "totalPages": 3,
    "currentPage": 1,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
``` 