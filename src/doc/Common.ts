export const paginationParams = [
  {
    in: 'query',
    name: 'limit',
    description:
      'The amount of departments. **Min 1 and Max 1000. Default 100**',
  },
  {
    in: 'offset',
    name: 'offset',
    description: 'The starting position for listing departments. **Default 0**',
  },
];
