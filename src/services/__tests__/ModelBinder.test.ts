import ModelBinder from '../ModelBinder';

describe('ModelBinder', () => {
  describe('parseId', () => {
    it('should throw error with wrong value', () => {
      const value = 'asd';
      expect(() => ModelBinder.parseId(value)).toThrow(
        `Invalid id parameter value: ${value}`,
      );
    });

    it('should throw error with empty value', () => {
      expect(() => ModelBinder.parseId(undefined)).toThrow(
        'Id parameter is required',
      );
    });

    it('should work correctly', () => {
      const result = ModelBinder.parseId('1');

      expect(typeof result).toEqual('number');
      expect(result).toEqual(1);
    });
  });

  describe('parseLimitAndOffset', () => {
    it('should throw error with values greater than maximum', () => {
      expect(() =>
        ModelBinder.parseLimitAndOffset({ limit: 1000000, offset: 0 }),
      ).toThrow('Invalid limit parameter value: 1000000');
    });

    it('should throw error with values less than minimum', () => {
      expect(() =>
        ModelBinder.parseLimitAndOffset({ limit: -1, offset: 0 }),
      ).toThrow('Invalid limit parameter value: -1');
    });

    it('should throw error with values of wrong type', () => {
      expect(() =>
        ModelBinder.parseLimitAndOffset({ limit: {}, offset: [] }),
      ).toThrow('Invalid limit parameter value: [object Object]');
    });

    it('should work correctly', () => {
      const result = ModelBinder.parseLimitAndOffset({
        limit: '10',
        offset: '5',
      });

      expect(result).toEqual({
        limit: 10,
        offset: 5,
      });
    });
  });

  describe('parseExpands', () => {
    it('should return undefined when called with office', () => {
      const result = ModelBinder.parseExpands('office', {});

      expect(result).toBeUndefined();
    });

    it('should return undefined when called with no value', () => {
      const result = ModelBinder.parseExpands('manager', undefined);

      expect(result).toBeUndefined();
    });

    it('should throw error with wrong value type', () => {
      expect(() => ModelBinder.parseExpands('manager', {})).toThrowError(
        'Invalid type for expand parameter: object',
      );
    });

    it('should throw error with disallowed expand value', () => {
      expect(() => ModelBinder.parseExpands('manager', 'company')).toThrowError(
        'Invalid expand value: company. Allowed values are: manager,department,office,superdepartment',
      );
    });

    it('should throw error with wrong first expand for entity', () => {
      expect(() =>
        ModelBinder.parseExpands('manager', 'superdepartment'),
      ).toThrowError(
        `supertdepartment is not a valid expand for Employee. Allowed expands: ['department', 'office', 'manager']`,
      );
    });

    it('should work correctly with single expand', () => {
      const result = ModelBinder.parseExpands('manager', 'office');

      expect(result.size).toEqual(1);
      expect(result.shift().value).toEqual('office');
    });

    it('should work correctly with two expands', () => {
      const result = ModelBinder.parseExpands(
        'manager',
        'department.superdepartment',
      );

      expect(result.size).toEqual(2);
      expect(result.shift().value).toEqual('department');
      expect(result.shift().value).toEqual('superdepartment');
    });

    it('should work correctly with multiple expands', () => {
      const result = ModelBinder.parseExpands('manager', [
        'department.superdepartment',
        'manager',
      ]);

      expect(result.size).toEqual(3);
      expect(result.shift().value).toEqual('department');
      expect(result.shift().value).toEqual('superdepartment');
      expect(result.shift().value).toEqual('manager');
    });
  });
});
