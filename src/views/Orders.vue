<template>
  <div>
    <h1 id="ordersTitle">Sales Orders</h1>
    <hr>
    <table id="sales-orders" class="table" v-if="orders.length">
      <thead>
        <tr>
          <th>CustomerId</th>
          <th>OrderId</th>
          <th>Order Total</th>
          <th>Order Status</th>
          <th>Mark Complete</th>
        </tr>
      </thead>
      <tr v-for="order in orders" :key="order.id">
        <td>
          {{ order.customer.id }}
        </td>
        <td>
          {{ order.id }}
        </td>
        <td>
          {{ getTotal(order) | price }}
        </td>
        <td :class=" {green: order.isPaid } ">
          {{ getStatus(order.isPaid) }}
        </td>
        <td>
          <div @click="markComplete(order.id)"
            v-if="!order.isPaid" 
            class="lni lni-checkmark-circle order-complete green">
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { OrderService } from '@/services/order-service.ts';
  import { ISalesOrder } from '@/types/SalesOrder';
  const orderService = new OrderService();
  
  @Component({
    name: 'Orders',
    components: { }
  })
  export default class Orders extends Vue {
    orders: ISalesOrder[] = [];

    async created() {
      await this.initialize();
    }

    async initialize() {
      this.orders = await orderService.getOrders();
      console.log(this.orders);
    }

    getTotal(order: ISalesOrder) {
      return order.salesOrderItems.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    }

    getStatus(isPaid: boolean) {
      return isPaid ? 'Paid in full' : 'Unpaid';
    }

    async markComplete(orderId: number) {
      await orderService.markOrderComplete(orderId);
      await this.initialize();
    }
  }
</script>

<style lang="scss">
  @import "@/scss/global.scss";
  .green {
    font-weight: bold;
    color: $solar-green;
  }
  .inventory-actions {
    display: flex;
    margin-bottom: 0.8rem;
  }
  .order-complete {
    cursor: pointer;
    text-align: center;
  }
</style>