import axios from 'axios';
import { ICustomer } from '@/types/Customer';
import { IServiceResponse } from '@/types/ServiceResponse';

/**
 * Customer Service
 * Provides UI business logic associated with Customers in our system
 */
export default class CustomerService {
  API_URL =  process.env.VUE_APP_API_URL;

  public async getCustomers(): Promise<ICustomer[]> {
    let result = await axios.get(`${this.API_URL}/customer`);
    return result.data;
  }

  public async addCustomer(newCustomer: ICustomer): Promise<IServiceResponse<ICustomer>> {
    let result = await axios.post(`${this.API_URL}/customer`, newCustomer);
    console.log(result);
    return result.data;
  }

  public async deleteCustomer(customerId: number): Promise<boolean> {
    let result = await axios.delete(`${this.API_URL}/customer/${customerId}`);
    return result.data;
  }
}