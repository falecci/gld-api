import { paginationParams } from './Common';

const tags = ['Employees'];
const employee = {
  first: 'Patricia',
  last: 'Diaz',
  id: 1,
  manager: null,
  department: 5,
  office: 2,
};

const expandParameter = {
  in: 'query',
  name: 'expand',
  description: `The expand value for employee. Accepts only **department**, **manager**, **office** and it can be nested, ie: **expand=manager.office**`,
};

export const getEmployees = {
  tags,
  description: 'Returns all the employees from the company',
  operationId: 'getEmployees',
  parameters: [...paginationParams, expandParameter],
  responses: {
    '200': {
      description: 'A list of employees.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            example: [employee],
          },
        },
      },
    },
    '400': {
      description: 'Invalid limit or offset value',
    },
  },
};

export const getEmployee = {
  tags,
  description: 'Returns a employee by id from the company',
  operationId: 'getEmployee',
  parameters: [
    {
      in: 'path',
      name: 'id',
      description: 'The employee id',
      required: true,
      type: 'integer',
      format: 'int64',
    },
    expandParameter,
  ],
  responses: {
    '200': {
      description: 'An object containing the employee information.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: employee,
          },
        },
      },
    },
    '404': {
      description: 'Employee not found',
    },
    '400': {
      description: 'Invalid expand parameter value',
    },
  },
};
