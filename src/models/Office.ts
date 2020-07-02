import IEntity from '../interfaces/IEntity';

export default class Office implements IEntity {
  readonly id: number;
  city: string;
  country: string;
  address: string;

  constructor(id: number, city: string, country: string, address: string) {
    this.id = id;
    this.city = city;
    this.country = country;
    this.address = address;
  }
}
