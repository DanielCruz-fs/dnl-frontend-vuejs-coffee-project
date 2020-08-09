<template>
  <div>
    <h1 id="invoiceTitle">Create Invoice</h1>
    <hr>

    <div v-if="invoiceStep == 1" class="invoice-step">
      <h2>Step 1: Select Customer</h2>
      <div v-if="customers.length" class="invoice-step-detail">
        <label for="customer">Customer:</label>
        <select v-model="selectedCustomerId"
                class="invoice-customers"
                id="customer">
          <option disabled value="0" selected>Please select a Customer</option>
          <option v-for="c in customers" :value="c.id" :key="c.id ">{{ c.firstName + " " + c.lastName }}</option>
        </select>
      </div>
    </div>

    <div v-if="invoiceStep == 2" class="invoice-step">
      <h2>Step 2: Create Order</h2>

      <div v-if="inventory.length" class="invoice-step-detail">
        <label for="product">Product:</label>
        <select v-model="newItem.product" class="invoice-line-item" id="product">
          <option disabled selected value="">Please select a Product</option>
          <option v-for="i in inventory" :value="i.product" :key="i.id ">{{ i.product.name }}</option>
        </select>
        <label for="quantity">Quantity:</label>
        <input v-model="newItem.quantity" id="quantity" type="number" min="0" />
      </div>

      <div class="invoice-item-actions">
        <solar-button 
          :isDisabled="!newItem.product || !newItem.quantity" 
          @button:click="addLineItem()"
        >
          Add Line Item
        </solar-button>

        <solar-button 
          :isDisabled="!lineItems.length" 
          @button:click="finalizeOrder()"
        > 
          Finalize Order
        </solar-button>
      </div>

      <div class="invoice-order-list" v-if="lineItems.length">
        <div class="runningTotal">
          <h3>Running Total:</h3>
          {{ runningTotal | price }}
        </div>
        <hr />

      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Description</th>
            <th>Qty.</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
          <tr  v-for="lineItem in lineItems" :key="lineItem.product.id">
            <td> {{ lineItem.product.name }} </td>
            <td> {{ lineItem.product.description }} </td>
            <td> {{ lineItem.quantity }} </td>
            <td> {{ lineItem.product.price }} </td>
            <td> {{ lineItem.product.price * lineItem.quantity | price }} </td>
          </tr>
      </table>

      </div>
    </div>

    <div v-if="invoiceStep == 3" class="invoice-step">
      <h2>Step 3: Review and Submit</h2>
      <solar-button @button:click="submitInvoice()">
        Submit Invoice
      </solar-button>
      <hr>

      <div class="invoice-step-detail" id="invoice" ref="invoice">
        <div class="invoice-logo">
          <img 
            id="imgLogo" 
            alt="Solar Coffee logo" 
            src="../assets/plant.svg"
          />
          <h3>466-000-456 West Side County</h3>
          <h3>Port Beach, CA 88-34</h3>
          <h3>USA</h3>

          <div class="invoice-order-list" v-if="lineItems.length">
            <div class="invoice-header" v-if="selectedCustomer">
              <h3>Invoice: {{ new Date() | humanizeDate }} </h3>
              <h3>
                Customer: 
                {{ 
                  selectedCustomer.firstName + 
                  " " + 
                  selectedCustomer.lastName 
                }} 
              </h3>
              <h3>
                Address: {{ selectedCustomer.primaryAddress.addressLine1 }}
              </h3>
              <h3 v-if="selectedCustomer.primaryAddress.addressLine2">
                {{ selectedCustomer.primaryAddress.addressLine2 }}
              </h3>
              <h3>
                {{ selectedCustomer.primaryAddress.city }},
                {{ selectedCustomer.primaryAddress.state }},
                {{ selectedCustomer.primaryAddress.postalCode }}
              </h3>
              <h3>
                {{ this.selectedCustomer.primaryAddress.country }}
              </h3>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tr 
                v-for="lineItem in lineItems" 
                :key="lineItem.product.id"
              >
                <td> {{ lineItem.product.name }} </td>
                <td> {{ lineItem.product.description }} </td>
                <td> {{ lineItem.quantity }} </td>
                <td> {{ lineItem.product.price }} </td>
                <td> 
                  {{ (lineItem.product.price * lineItem.quantity) | price }} 
                </td>
              </tr>
              <tr>
                <th colspan="4"></th>
                <th>Grand Total</th>
              </tr>
              <tfoot>
                <tr>
                  <td colspan="4" class="due">Balance due upon receipt:</td>
                  <td class="price-final">{{ runningTotal | price }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
       </div>
    </div>
    </div>
    <hr>

    <div class="invoice-steps-actions">
      <solar-button @button:click="prev()" :isDisabled="!canGoPrev">Previous</solar-button>
      <solar-button @button:click="next()" :isDisabled="!canGoNext">Next</solar-button>
      <solar-button @button:click="startOver()">Start Over</solar-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { IInvoice, ILineItem } from '@/types/Invoice';
  import { ICustomer } from '@/types/Customer';
  import { IProductInventory, IProduct } from '@/types/Product';
  import CustomerService from '@/services/customer-service';
  import { InventoryService } from '@/services/inventory-service';
  import InvoiceService from '@/services/invoice-service';
  import SolarButton from '@/components/SolarButton.vue';
  /** Report modules */
  // import jsPDF from 'jspdf';
  // Quick fix for a module that does not have a defition type (npm install -D @types/module-name) => other option
  const jsPDF = require('jspdf');
  import html2canvas from 'html2canvas';

  const customerService = new CustomerService;
  const inventoryService = new InventoryService;
  const invoiceService = new InvoiceService;

  @Component({
    name: 'CreateInvoice',
    components: { SolarButton }
  })
  export default class CreateInvoice extends Vue {
    // quick fix for using $refs
    $refs: {
      invoice: HTMLCanvasElement
    }

    invoiceStep: number = 1;
    invoice: IInvoice = {
      createdOn: new Date(),
      customerId: 0,
      lineItems: [],
      updatedOn: new Date()
    };
    customers: ICustomer[] = [];
    selectedCustomerId: number = 0;
    inventory: IProductInventory[] = [];
    lineItems: ILineItem[] = [];
    newItem: ILineItem = {
      product: '',
      quantity: 0 
    };

    async created() {
      await this.initialize();
    }

    async initialize() {
      this.customers = await customerService.getCustomers();
      this.inventory = await inventoryService.getInventory();
    }

    prev(): void {
      if (this.invoiceStep == 1) {
        return;
      }
      this.invoiceStep -= 1;
    }

    next(): void {
      if (this.invoiceStep == 3) {
        return;
      }
      this.invoiceStep += 1;
    }

    /**computed properties in TS */
    get canGoNext() {
      if (this.invoiceStep == 1) {
        console.log(this.invoiceStep);
        console.log(this.selectedCustomerId);
        return this.selectedCustomerId !== 0;
      }

      if (this.invoiceStep == 2) {
        return this.lineItems.length;
      }

      if (this.invoiceStep == 3) {
        return false;
      }
      
      return false;
    }

    get canGoPrev() {
      console.log(':: canGoPrev ::', this.invoiceStep)
      return this.invoiceStep !== 1;
    }

    startOver() {
      this.invoice = { customerId: 0, lineItems: [], createdOn: new Date(), updatedOn: new Date() };
      this.newItem = { product:'', quantity: 0 }
      this.selectedCustomerId = 0;
      this.invoiceStep = 1;
      this.lineItems = [];
      console.log(this.selectedCustomerId, 'from over');
    }

    addLineItem() {
      let itemToAdd: ILineItem = {
        product: this.newItem.product,
        quantity: Number(this.newItem.quantity)
      }

      let existingItems = this.lineItems.map(item => item.product.id);

      if (existingItems.includes(itemToAdd.product.id)) {
        let lineItem = this.lineItems.find(item => item.product.id == itemToAdd.product.id);
        if (lineItem)
          lineItem.quantity += itemToAdd.quantity; 
      } else {
        this.lineItems.push(itemToAdd);
      }

      this.newItem = { product: '' ,quantity: 0 };
      console.log(this.lineItems);
    }

    finalizeOrder() {
      this.invoiceStep = 3;
    }

    /** computed property */
    get runningTotal() {
      return this.lineItems.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    }

    /** Invoice */
    async submitInvoice(): Promise<void> {
      this.invoice = {
        customerId: this.selectedCustomerId,
        lineItems : this.lineItems,
        createdOn: new Date(),
        updatedOn: new Date()
      };

      await invoiceService.makeNewInvoice(this.invoice);
      // report
      this.downloadPdf();
      await this.$router.push("/orders");
    }

    get selectedCustomer() {
      let finalCustomer = this.customers.find(customer => customer.id == this.selectedCustomerId);
      return finalCustomer;
    }

    // report
    downloadPdf() {
      let pdf = new jsPDF('p', 'pt', 'letter', true);
      let invoice = document.getElementById('invoice') as HTMLCanvasElement;
      console.log(invoice);
      // issue with typescript with $refs if happens
      // error: "property does not exist on type vue"
      let width = this.$refs.invoice.clientWidth;
      let height = this.$refs.invoice.clientHeight;
      html2canvas(invoice).then((canvas:any) => {
        let image = canvas.toDataURL('image/png');
        pdf.addImage(image, 'PNG', 40, 20, width * 0.55, height * 0.55);
        pdf.save('invoice');
      });
    }
  }
</script>

<style scoped lang="scss">
@import "@/scss/global.scss";
  .invoice-steps-actions {
    display: flex;
    width: 100%;
  }
  .invoice-step-detail {
    margin: 1.2rem
  }
  .invoice-order-list {
    margin-top: 1.2rem;
    padding: 0.8rem;
    .line-item {
      display: flex;
      border-bottom: 1px dashed #ccc;
      padding: 0.8rem;
    }
    .item-col {
      flex-grow: 1;
    }
  }
  .invoice-item-actions {
    display: flex;
  }
  .price-pre-tax {
    font-weight: bold;
  }
  .price-final {
    font-weight: bold;
    color: $solar-green;
  }
  .due {
    font-weight: bold;
  }
  .invoice-header {
    width: 100%;
    margin-bottom: 1.2rem;
  }
  .invoice-logo {
    padding-top: 1.4rem;
    text-align: center;
    img {
      width: 80px;
    }
  }
</style>