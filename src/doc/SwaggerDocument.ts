import { getOffices, getOffice } from './Offices.swagger';
import { getDepartments, getDepartment } from './Departments.swagger';
import { getEmployees, getEmployee } from './Employees.swagger';

const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Glide API',
    description: 'This is the API for Glide Company',
    termsOfService: '',
    contact: {
      name: 'Federico Alecci',
      email: 'i.am@falecci.dev',
      url: 'https://falecci.dev',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local server',
    },
  ],
  tags: ['Offices', 'Departments'],
  paths: {
    '/v1/offices': {
      get: getOffices,
    },
    '/v1/offices/{id}': {
      get: getOffice,
    },
    '/v1/departments': {
      get: getDepartments,
    },
    '/v1/departments/{id}': {
      get: getDepartment,
    },
    '/v1/employees': {
      get: getEmployees,
    },
    '/v1/employees/{id}': {
      get: getEmployee,
    },
  },
};

export default swaggerDocument;
