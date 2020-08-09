<template>
  <solar-modal>
    <template v-slot:header>
      Receive Shipment
    </template>

    <template slot="body">
      <label for="product">Product Received:</label>
      <select name="product" id="product" v-model="selectedProduct">
        <option disabled value="">Please select one...</option>
        <option v-for="item in inventory" :key="item.product.id" :value="item">
          {{ item.product.name }}
        </option>
      </select>

      <label for="qtyReceived">Quantity Received:</label>
      <input type="number" id="qtyReceived" v-model="qtyReceived">
    </template>

    <template slot="footer">
      <solar-button type="button" @button:click="save()"> 
        Save Received Shipment
      </solar-button>
      <solar-button type="button" @button:click="close()"> 
        Close
      </solar-button>
    </template>

  </solar-modal>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { IProductInventory, IProduct } from '@/types/Product';
  import { IShipment } from '@/types/Shipment';
  import SolarModal from '@/components/modals/SolarModal.vue';
  import SolarButton from '@/components/SolarButton.vue';

  @Component({
    name: 'ShipmentModal',
    components: { SolarButton, SolarModal }
  })
  export default class ShipmentModal extends Vue {
    @Prop() inventory: IProductInventory[];

    selectedProduct: IProduct = {
      createdOn: new Date(),
      updatedOn: new Date(),
      id: 0,
      description: '',
      isTaxable: false,
      name: '',
      price: 0,
      isArchived: false
    };

    qtyReceived: number = 0;

    save() {
      let shipment: IShipment = {
        productId: this.selectedProduct.id,
        adjustment: this.qtyReceived
      };

      this.$emit('save:shipment', shipment);
    }
    
    close() {
      this.$emit('close');
    }

  }
</script>

<style>

</style>