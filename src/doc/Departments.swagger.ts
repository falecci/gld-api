import { paginationParams } from './Common';

const tags = ['Departments'];
const department = {
  id: 9,
  name: 'Sales Development',
  superdepartment: 1,
};

const expandParameter = {
  in: 'query',
  name: 'expand',
  description: `The expand value for department. Accepts only **superdepartment** and it can be nested, ie: **expand=superdepartment.superdepartment**`,
};

export const getDepartments = {
  tags,
  description: 'Returns all the departments from the company',
  operationId: 'getDepartments',
  parameters: [...paginationParams, expandParameter],
  responses: {
    '200': {
      description: 'A list of departments.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            example: [department],
          },
        },
      },
    },
    '400': {
      description: 'Invalid limit or offset value',
    },
  },
};

export const getDepartment = {
  tags,
  description: 'Returns a department by id from the company',
  operationId: 'getDepartment',
  parameters: [
    {
      in: 'path',
      name: 'id',
      description: 'The department id',
      required: true,
      type: 'integer',
      format: 'int64',
    },
    expandParameter,
  ],
  responses: {
    '200': {
      description: 'An object containing the department information.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: department,
          },
        },
      },
    },
    '404': {
      description: 'Department not found',
    },
    '400': {
      description: 'Invalid expand parameter value',
    },
  },
};
