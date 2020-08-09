<template>
  <solar-modal>
    <template slot="header">
      Add New Product
    </template>

    <template slot="body">
      <ul class="newProduct">
        <li>
          <label for="isTaxable">Is this product Taxable?</label>
          <input type="checkbox" id="isTaxable" v-model="newProduct.isTaxable">
        </li>
        <li>
          <label for="productName">Name</label>
          <input type="text" id="productName" v-model="newProduct.name">
        </li>
        <li>
          <label for="productDesc">Description</label>
          <input type="text" id="productDesc" v-model="newProduct.description">
        </li>
        <li>
          <label for="productPrice">Price</label>
          <input type="number" id="productPrice" v-model="newProduct.price">
        </li>
      </ul>
    </template>

    <template slot="footer">
      <solar-button type="button" @button:click="save()"> 
        Save product
      </solar-button>
      <solar-button type="button" @button:click="close()"> 
        Close
      </solar-button>
    </template>
  </solar-modal>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { IProduct } from '@/types/Product';
  import SolarModal from '@/components/modals/SolarModal.vue';
  import SolarButton from '@/components/SolarButton.vue';

  @Component({
    name: 'NewProductModal',
    components: { SolarButton, SolarModal }
  })
  export default class ShipmentModal extends Vue {

    newProduct: IProduct = {
      createdOn: new Date(),
      updatedOn: new Date(),
      id: 0,
      description: '',
      isTaxable: false,
      name: '',
      price: 0,
      isArchived: false
    };

    save() {
      this.$emit('save:product', this.newProduct);
    }
    
    close() {
      this.$emit('close');
    }
  }
</script>

<style lang="scss">
.newProduct {
  list-style: none;
  padding: 0;
  margin: 0;
  
  input {
    width: 100%;
    height: 1.8rem;
    margin-bottom: 1.2rem;
    font-size: 1.1rem;
    line-height: 1.3rem;
    padding: 0.2rem;
    color: #555
  }
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.3rem;
  }
}
</style>