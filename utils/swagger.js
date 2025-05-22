import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Expense Tracker application',
      contact: {
        name: 'API Support',
        email: 'support@expensetracker.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        UserSignup: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['income', 'expense'] },
            user: { type: 'string' }
          }
        },
        CategoryCreate: {
          type: 'object',
          required: ['name', 'type'],
          properties: {
            name: { type: 'string' },
            type: { type: 'string', enum: ['income', 'expense'] }
          }
        },
        CategoryResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            category: { $ref: '#/components/schemas/Category' }
          }
        },
        CategoriesResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            categories: { 
              type: 'array',
              items: { $ref: '#/components/schemas/Category' }
            }
          }
        },
        Expense: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            amount: { type: 'number' },
            type: { type: 'string', enum: ['income', 'expense'] },
            category: { $ref: '#/components/schemas/Category' },
            date: { type: 'string', format: 'date-time' }
          }
        },
        ExpenseCreate: {
          type: 'object',
          required: ['title', 'amount', 'type', 'category'],
          properties: {
            title: { type: 'string' },
            amount: { type: 'number' },
            type: { type: 'string', enum: ['income', 'expense'] },
            category: { type: 'string' },
            date: { type: 'string', format: 'date-time' }
          }
        },
        ExpenseResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            expense: { $ref: '#/components/schemas/Expense' }
          }
        },
        ExpensesResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            expenses: { 
              type: 'array', 
              items: { $ref: '#/components/schemas/Expense' }
            },
            pagination: {
              type: 'object',
              properties: {
                totalExpenses: { type: 'integer' },
                totalPages: { type: 'integer' },
                currentPage: { type: 'integer' },
                limit: { type: 'integer' },
                hasNextPage: { type: 'boolean' },
                hasPrevPage: { type: 'boolean' }
              }
            }
          }
        },
        FinancialSummary: {
          type: 'object',
          properties: {
            totalIncome: { type: 'number' },
            totalExpenses: { type: 'number' },
            balance: { type: 'number' },
            period: {
              type: 'object',
              properties: {
                startDate: { type: 'string' },
                endDate: { type: 'string' }
              }
            }
          }
        },
        CategoryBreakdown: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  categoryId: { type: 'string' },
                  categoryName: { type: 'string' },
                  amount: { type: 'number' },
                  count: { type: 'integer' },
                  percentage: { type: 'string' }
                }
              }
            }
          }
        },
        MonthlyTrend: {
          type: 'object',
          properties: {
            month: { type: 'integer' },
            year: { type: 'integer' },
            monthName: { type: 'string' },
            income: { type: 'number' },
            expense: { type: 'number' },
            balance: { type: 'number' }
          }
        },
        Anomaly: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            currentSpending: { type: 'number' },
            averageSpending: { type: 'number' },
            percentageIncrease: { type: 'string' }
          }
        },
        Insights: {
          type: 'object',
          properties: {
            summary: {
              type: 'object',
              properties: {
                message: { type: 'string' }
              }
            },
            topSpending: {
              type: 'object',
              properties: {
                category: { type: 'string' },
                amount: { type: 'number' },
                message: { type: 'string' }
              }
            },
            trend: {
              type: 'object',
              properties: {
                message: { type: 'string' }
              }
            },
            anomalies: {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                message: { type: 'string' }
              }
            }
          }
        }
      }
    },
    security: [
      { bearerAuth: [] },
      { cookieAuth: [] },
    ],
    paths: {
      '/auth/signup': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserSignup' }
              }
            }
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' }
                }
              }
            }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login a user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserLogin' }
              }
            }
          },
          responses: {
            200: {
              description: 'User logged in successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' }
                }
              }
            }
          }
        }
      },
      '/category/get-categories': {
        get: {
          tags: ['Categories'],
          summary: 'Get all categories',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'type',
              schema: { type: 'string', enum: ['income', 'expense'] },
              description: 'Filter categories by type'
            }
          ],
          responses: {
            200: {
              description: 'Categories fetched successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CategoriesResponse' }
                }
              }
            }
          }
        }
      },
      '/category/add-category': {
        post: {
          tags: ['Categories'],
          summary: 'Create a new category',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CategoryCreate' }
              }
            }
          },
          responses: {
            201: {
              description: 'Category added successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CategoryResponse' }
                }
              }
            }
          }
        }
      },
      '/category/update-category/{id}': {
        put: {
          tags: ['Categories'],
          summary: 'Update a category',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'The category ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CategoryCreate' }
              }
            }
          },
          responses: {
            200: {
              description: 'Category updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CategoryResponse' }
                }
              }
            }
          }
        }
      },
      '/category/delete-category/{id}': {
        delete: {
          tags: ['Categories'],
          summary: 'Delete a category',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'The category ID'
            }
          ],
          responses: {
            200: {
              description: 'Category deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/expense/add-expense': {
        post: {
          tags: ['Expenses'],
          summary: 'Create a new expense or income',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ExpenseCreate' }
              }
            }
          },
          responses: {
            201: {
              description: 'Expense added successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ExpenseResponse' }
                }
              }
            }
          }
        }
      },
      '/expense/get-expense-by-user': {
        get: {
          tags: ['Expenses'],
          summary: 'Get all expenses for the current user',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'page',
              schema: { type: 'integer', default: 1 },
              description: 'Page number for pagination'
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer', default: 10 },
              description: 'Number of items per page'
            },
            {
              in: 'query',
              name: 'sortBy',
              schema: { type: 'string', default: 'date' },
              description: 'Field to sort by'
            },
            {
              in: 'query',
              name: 'sortOrder',
              schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
              description: 'Sort order'
            }
          ],
          responses: {
            200: {
              description: 'Expenses fetched successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ExpensesResponse' }
                }
              }
            }
          }
        }
      },
      '/expense/get-expense-by-id/{id}': {
        get: {
          tags: ['Expenses'],
          summary: 'Get an expense by ID',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'The expense ID'
            }
          ],
          responses: {
            200: {
              description: 'Expense fetched successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ExpenseResponse' }
                }
              }
            }
          }
        }
      },
      '/expense/get-expense-by-type': {
        get: {
          tags: ['Expenses'],
          summary: 'Get expenses by type (income or expense)',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'type',
              required: true,
              schema: { type: 'string', enum: ['income', 'expense'] },
              description: 'Type of transaction'
            },
            {
              in: 'query',
              name: 'page',
              schema: { type: 'integer', default: 1 },
              description: 'Page number for pagination'
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer', default: 10 },
              description: 'Number of items per page'
            }
          ],
          responses: {
            200: {
              description: 'Expenses fetched successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ExpensesResponse' }
                }
              }
            }
          }
        }
      },
      '/expense/get-expense-by-category': {
        get: {
          tags: ['Expenses'],
          summary: 'Get expenses by category',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'category',
              required: true,
              schema: { type: 'string' },
              description: 'Category ID'
            },
            {
              in: 'query',
              name: 'page',
              schema: { type: 'integer', default: 1 },
              description: 'Page number for pagination'
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer', default: 10 },
              description: 'Number of items per page'
            }
          ],
          responses: {
            200: {
              description: 'Expenses fetched successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ExpensesResponse' }
                }
              }
            }
          }
        }
      },
      '/expense/get-expense-by-date-range': {
        get: {
          tags: ['Expenses'],
          summary: 'Get expenses by date range',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'startDate',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'Start date in ISO format (YYYY-MM-DD)'
            },
            {
              in: 'query',
              name: 'endDate',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'End date in ISO format (YYYY-MM-DD)'
            },
            {
              in: 'query',
              name: 'page',
              schema: { type: 'integer', default: 1 },
              description: 'Page number for pagination'
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer', default: 10 },
              description: 'Number of items per page'
            }
          ],
          responses: {
            200: {
              description: 'Expenses fetched successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ExpensesResponse' }
                }
              }
            }
          }
        }
      },
      '/expense/update-expense/{id}': {
        put: {
          tags: ['Expenses'],
          summary: 'Update an expense',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'The expense ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    amount: { type: 'number' },
                    type: { type: 'string', enum: ['income', 'expense'] },
                    category: { type: 'string' },
                    date: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Expense updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ExpenseResponse' }
                }
              }
            }
          }
        }
      },
      '/expense/delete-expense/{id}': {
        delete: {
          tags: ['Expenses'],
          summary: 'Delete an expense',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'The expense ID'
            }
          ],
          responses: {
            200: {
              description: 'Expense deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      expense: { $ref: '#/components/schemas/Expense' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/analytics/summary': {
        get: {
          tags: ['Analytics'],
          summary: 'Get financial summary (income, expenses, balance)',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'startDate',
              schema: { type: 'string', format: 'date' },
              description: 'Start date in ISO format (YYYY-MM-DD)'
            },
            {
              in: 'query',
              name: 'endDate',
              schema: { type: 'string', format: 'date' },
              description: 'End date in ISO format (YYYY-MM-DD)'
            }
          ],
          responses: {
            200: {
              description: 'Financial summary fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/FinancialSummary' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/analytics/category-breakdown': {
        get: {
          tags: ['Analytics'],
          summary: 'Get spending breakdown by category',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'startDate',
              schema: { type: 'string', format: 'date' },
              description: 'Start date in ISO format (YYYY-MM-DD)'
            },
            {
              in: 'query',
              name: 'endDate',
              schema: { type: 'string', format: 'date' },
              description: 'End date in ISO format (YYYY-MM-DD)'
            },
            {
              in: 'query',
              name: 'type',
              schema: { type: 'string', enum: ['income', 'expense'], default: 'expense' },
              description: 'Type of transaction to analyze'
            }
          ],
          responses: {
            200: {
              description: 'Category breakdown fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/CategoryBreakdown' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/analytics/monthly-trends': {
        get: {
          tags: ['Analytics'],
          summary: 'Get monthly spending trends',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'months',
              schema: { type: 'integer', default: 6 },
              description: 'Number of months to include in the analysis'
            }
          ],
          responses: {
            200: {
              description: 'Monthly trends fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { 
                        type: 'array',
                        items: { $ref: '#/components/schemas/MonthlyTrend' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/analytics/anomalies': {
        get: {
          tags: ['Analytics'],
          summary: 'Get spending anomalies',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: 'Spending anomalies fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { 
                        type: 'array',
                        items: { $ref: '#/components/schemas/Anomaly' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/analytics/insights': {
        get: {
          tags: ['Analytics'],
          summary: 'Get personalized financial insights',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: 'Financial insights generated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Insights' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [], // We're now using inline definitions
};

const specs = swaggerJsdoc(options);

const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      docExpansion: 'none', // Start with all sections collapsed for cleaner view
      persistAuthorization: true, // Keep auth details between requests
      filter: true, // Enable filtering of operations
    },
    customCss: '.swagger-ui .topbar { display: none }', // Hide the top bar for a cleaner look
    customSiteTitle: "Expense Tracker API Documentation"
  }));
};

export default swaggerSetup; 