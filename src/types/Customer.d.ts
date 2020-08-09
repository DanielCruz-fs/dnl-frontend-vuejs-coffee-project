export interface ICustomer {
  id: number;
  firstName: string;
  lastName: string;
  createdOn: Date;
  updatedOn?: Date;
  primaryAddress: ICustomerAddress;
}

export interface ICustomerAddress {
  id: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdOn: Date;
  updatedOn: Date;
}