<template>
  <div class="inventory-container">
    <h1 class="inventoryTitle">Inventory Dashboard</h1>
    <hr>

    <inventory-chart></inventory-chart>

    <div class="inventory-actions">
      <solar-button @button:click="showNewProductModal()" id="addNewBtn">
        Add new item
      </solar-button>
      <solar-button @button:click="showShipmentModal()" id="receiveShipmentBtn">
        Receive shipment
      </solar-button>
    </div>

    <table id="inventoryTable" class="table">
      <tr>
        <th>Item</th>
        <th>Quantity On-hand</th>
        <th>Unit Price</th>
        <th>Taxable</th>
        <th>Delete</th>
      </tr>
      <tr v-for="item in inventory" :key="item.id">
        <td>{{ item.product.name }}</td>
        <td :class="`${applyColor(item.idealQuantity, item.quantityOnHand)}`">{{ item.quantityOnHand }}</td>
        <td>{{ item.product.price | price }}</td>
        <td>
          <span v-if="item.product.isTaxable">
            Yes
          </span>
          <span v-else>
            No
          </span>
        </td>
        <td>
          <div class="product-archive" @click="archiveProduct(item.product.id)">
            <i class="lni lni-cross-circle"></i>
          </div>
        </td>
      </tr>
    </table>

    <new-product-modal v-if="isNewProductVisible" @close="closeModals()" @save:product="saveNewProduct($event)">
    </new-product-modal>
    <shipment-modal v-if="isShipmentVisible" @close="closeModals()" @save:shipment="saveNewShipment($event)"
                    :inventory="inventory">
    </shipment-modal>

  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { IProductInventory, IProduct } from '@/types/Product';
  import SolarButton from '@/components/SolarButton.vue';
  import NewProductModal from '@/components/modals/NewProductModal.vue';
  import ShipmentModal from '@/components/modals/ShipmentModal.vue';
  import { IShipment } from '@/types/Shipment';
  import { InventoryService } from '@/services/inventory-service';
  import { ProductService } from '@/services/product-service';
  import InventoryChart from '@/components/charts/InventoryChart.vue';

  const inventoryService = new InventoryService();
  const productService = new ProductService();

  @Component({
    name: 'Inventory',
    components: { SolarButton, NewProductModal, ShipmentModal, InventoryChart }
  })
  export default class Inventory extends Vue {
    isNewProductVisible: boolean = false;
    isShipmentVisible: boolean = false;

    inventory: IProductInventory[] = [];

    async created() {
      await this.initialize();
    }

    async initialize() {
      this.inventory = await inventoryService.getInventory();
      await this.$store.dispatch('assignSnapshots');
    }

    async archiveProduct(id: number) {
      await productService.archive(id);
      await this.initialize();
    }
    
    showNewProductModal() {
      this.isNewProductVisible = true;
    }

    showShipmentModal() {
      this.isShipmentVisible = true;
    }

    closeModals() {
      this.isShipmentVisible = false;
      this.isNewProductVisible = false;
    }

    async saveNewProduct(newProduct: IProduct) {
      await productService.save(newProduct);
      this.isNewProductVisible = false;
      await this.initialize();
    }

    async saveNewShipment(shipment: IShipment) {
      await inventoryService.updateInventoryQuantity(shipment);
      this.isShipmentVisible = false;
      await this.initialize();
    }

    applyColor(target: number, current: number) {
      if (current <= 0) {
        return 'red';
      }

      if (Math.abs(target - current) > 8) {
        return 'yellow';
      }

      return 'green';
    }
  }
</script>

<style lang="scss" scoped>
 @import "@/scss/global.scss";
  .green {
    font-weight: bold;
    color: $solar-green;
  }
  .yellow {
    font-weight: bold;
    color: $solar-yellow;
  }
  .red {
    font-weight: bold;
    color: $solar-red;
  }
  .inventory-actions {
    display: flex;
    margin-bottom: 0.8rem;
  }
  .product-archive {
    cursor: pointer;
    font-weight: bold;
    font-size: 1.2rem;
    color: $solar-red;
  }
</style>