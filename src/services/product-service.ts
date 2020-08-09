import axios from 'axios';
import { IProduct } from '@/types/Product';

export class ProductService {
  API_URL =  process.env.VUE_APP_API_URL;

  async archive(productId: number) {
    let result = await axios.put(`${this.API_URL}/product/archive/${productId}`);
    console.log(result);
    return result.data;
  }

  async save(product: IProduct) {
    let resutl = await axios.post(`${this.API_URL}/product`, product);
    return resutl.data;
  }
}