import axios from 'axios';
import { IProductInventory } from '@/types/Product';
import { IShipment } from '@/types/Shipment';

export class InventoryService {
  API_URL =  process.env.VUE_APP_API_URL;

  public async getInventory(): Promise<IProductInventory[] | any> {
    try {
      let result = await axios.get(`${this.API_URL}/inventory`)
      console.log(result);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }

  public async updateInventoryQuantity(shipment: IShipment) {
    let result = await axios.put(`${this.API_URL}/inventory`, shipment);
    return result.data;
  }
}