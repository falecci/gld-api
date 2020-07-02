import { paginationParams } from './Common';

const tags = ['Offices'];
const office = {
  id: 3,
  city: 'London',
  country: 'United Kingdom',
  address: '32 London Bridge St',
};

export const getOffices = {
  tags,
  description: 'Returns all the offices from the company',
  operationId: 'getOffices',
  parameters: paginationParams,
  responses: {
    '200': {
      description: 'A list of offices.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            example: [office],
          },
        },
      },
    },
    '400': {
      description: 'Invalid limit or offset value',
    },
  },
};

export const getOffice = {
  tags,
  description: 'Returns an office by id from the company',
  operationId: 'getOffice',
  parameters: [
    {
      in: 'path',
      name: 'id',
      description: 'The office id',
      required: true,
      type: 'integer',
      format: 'int64',
    },
  ],
  responses: {
    '200': {
      description: 'An object containing the office information.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: office,
          },
        },
      },
    },
    '404': {
      description: 'Office not found',
    },
  },
};
