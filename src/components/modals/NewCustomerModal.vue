<template>
  <solar-modal>
    <template slot="header">
      Add new customer
    </template>

    <template slot="body">
      <ul class="newCustomer">
        <li>
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" v-model="customer.firstName">
        </li>
        <li>
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" v-model="customer.lastName">
        </li>
        <li>
          <label for="address1">Address Line 1</label>
          <input type="text" id="address1" v-model="customer.primaryAddress.addressLine1">
        </li>
        <li>
          <label for="address2">Address Line 2</label>
          <input type="text" id="address2" v-model="customer.primaryAddress.addressLine2">
        </li>
        <li>
          <label for="city">City</label>
          <input type="text" id="city" v-model="customer.primaryAddress.city">
        </li>
        <li>
          <label for="state">State</label>
          <input type="text" id="state" v-model="customer.primaryAddress.state">
        </li>
        <li>
          <label for="postalCode">Postal Code</label>
          <input type="text" id="postalCode" v-model="customer.primaryAddress.postalCode">
        </li>
        <li>
        <label for="country">Country</label>
          <input type="text" id="country" v-model="customer.primaryAddress.country">
        </li>
      </ul>
    </template>

    <template slot="footer">
      <solar-button type="button" @button:click="save()"> 
        Save new customer
      </solar-button>
      <solar-button type="button" @button:click="close()"> 
        Close
      </solar-button>
    </template>
  </solar-modal>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import SolarButton from '@/components/SolarButton.vue';
  import SolarModal from '@/components/modals/SolarModal.vue';
  import { ICustomer } from '@/types/Customer';

  @Component({
    name: 'NewCustomerModal',
    components: { SolarModal, SolarButton }
  })
  export default class NewCustomerModal extends Vue {
    customer: ICustomer = {
      id: 0,
      firstName: '',
      lastName: '',
      createdOn: new Date(),
      updatedOn: new Date(),
      primaryAddress: {
        id: 0,
        city: '',
        country: '',
        state: '',
        postalCode: '',
        addressLine1: '',
        addressLine2: '',
        createdOn: new Date(),
        updatedOn: new Date()
      }
    };
    save() {
      this.$emit('save:customer', this.customer);
    }

    close() {
      this.$emit('close');
    }
  }
</script>

<style lang="scss">
  .newCustomer {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;
    input {
      width: 80%;
      height: 1.8rem;
      margin: 0.8rem;
      margin-right: 2rem;
      font-size: 1.1rem;
      line-height: 1.3rem;
      padding: 0.3rem;
      color: #555;
    }
    label {
      font-weight: bold;
      margin: 0.8rem;
      display: block;
    }
  }
</style>