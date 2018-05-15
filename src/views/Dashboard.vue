<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-primary">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Action</b-dropdown-item>
              <b-dropdown-item>Another action</b-dropdown-item>
              <b-dropdown-item>Something else here...</b-dropdown-item>
              <b-dropdown-item disabled>Disabled action</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">9.823</h4>
            <p>Members online</p>
          </b-card-body>
          <card-line1-chart-example class="chart-wrapper px-3" style="height:70px;" height="70"/>
        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-info">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right no-caret>
              <template slot="button-content">
                <i class="icon-location-pin"></i>
              </template>
              <b-dropdown-item>Action</b-dropdown-item>
              <b-dropdown-item>Another action</b-dropdown-item>
              <b-dropdown-item>Something else here...</b-dropdown-item>
              <b-dropdown-item disabled>Disabled action</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">9.823</h4>
            <p>Members online</p>
          </b-card-body>
          <card-line2-chart-example class="chart-wrapper px-3" style="height:70px;" height="70"/>
        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-warning">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Action</b-dropdown-item>
              <b-dropdown-item>Another action</b-dropdown-item>
              <b-dropdown-item>Something else here...</b-dropdown-item>
              <b-dropdown-item disabled>Disabled action</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">9.823</h4>
            <p>Members online</p>
          </b-card-body>
          <card-line3-chart-example class="chart-wrapper" style="height:70px;" height="70"/>
        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-danger">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Action</b-dropdown-item>
              <b-dropdown-item>Another action</b-dropdown-item>
              <b-dropdown-item>Something else here...</b-dropdown-item>
              <b-dropdown-item disabled>Disabled action</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">9.823</h4>
            <p>Members online</p>
          </b-card-body>
          <card-bar-chart-example class="chart-wrapper px-3" style="height:70px;" height="70"/>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-card header="رزروهای شما" class="text-right font-lg">
          <b-table class="mb-0 table-outline" responsive="sm" hover :items="tableItems" :per-page="5"
                   :current-page="currentPage" :fields="tableFields"
                   head-variant="light" @row-clicked="reserveView">
            <div slot="user" slot-scope="item">
              <div>{{item.value.name}}</div>
            </div>
            <i slot="start" class="h6 mb-0" slot-scope="item">
              {{item.value.time}}
            </i>
            <i class="flag-icon flag-icon-pw h1" title="pw" id="pw"></i>
            <div slot="result" slot-scope="item">
              <strong>{{item.value}}</strong>
            </div>
          </b-table>
          <b-pagination size="md" :total-rows="tableItems.length" v-model="currentPage" :per-page="5"></b-pagination>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-card header="تراکنش های شما" class="text-right font-lg">
          <b-table class="mb-0 table-outline" responsive="sm" hover :items="table2Items" :fields="table2Fields"
                   head-variant="light" @row-clicked="transactionView" :per-page="5" :current-page="currentPage2">
            <i slot="date" class="h6 mb-0" slot-scope="item">
              {{item.value}}
            </i>
            <i slot="amount" class="h5 mb-0" slot-scope="item">
              {{item.value}}
            </i>
            <i class="flag-icon flag-icon-pw h1" title="pw"></i>
            <div slot="reservation" slot-scope="item">
              <span><strong>{{item.value}}</strong></span>
            </div>
          </b-table>
          <b-pagination size="md" :total-rows="table2Items.length" v-model="currentPage2" :per-page="5"></b-pagination>
        </b-card>
      </b-col>
    </b-row>
    <sweet-modal ref="reserveModal">
      <h3>ویرایش توضیحات</h3>
      <div class="">
      <div class="fancy-form">
          <textarea v-model="notes" rows="5" class="form-control">{{selectedBooking.notes}}</textarea>
        <div class="divider rounded-top"></div>
        <button class="btn-success align-bottom" v-on:click="updateNotes" style="margin-top: 10px">ثبت تغییرات</button>
      </div>
      </div>

      <br/>
    </sweet-modal>
    <b-modal ref="transactionModal">
salam
    </b-modal>
  </div>
</template>

<script>
  import CardLine1ChartExample from './dashboard/CardLine1ChartExample'
  import CardLine2ChartExample from './dashboard/CardLine2ChartExample'
  import CardLine3ChartExample from './dashboard/CardLine3ChartExample'
  import CardBarChartExample from './dashboard/CardBarChartExample'
  import MainChartExample from './dashboard/MainChartExample'
  import SocialBoxChartExample from './dashboard/SocialBoxChartExample'
  import CalloutChartExample from './dashboard/CalloutChartExample'
  import {Callout} from '../components/'
  import axios from 'axios';
  import {SweetModal, SweetModalTab} from 'sweet-modal-vue'

  export default {
    name: 'dashboard',
    components: {
      Callout,
      CardLine1ChartExample,
      CardLine2ChartExample,
      CardLine3ChartExample,
      CardBarChartExample,
      MainChartExample,
      SocialBoxChartExample,
      CalloutChartExample,
      SweetModal,
      SweetModalTab
    },
    data: function () {
      return {
        selectedID:'',
        selected: 'Month',
        index: 0,
        currentPage: 1,
        currentPage2: 1,
        tableItems: [],
        tableFields: {
          user: {
            label: 'کاربر'
          },

          start: {
            label: 'شروع'
          },
          result: {
            label: 'وضعیت'
          }
        },
        table2Fields: {
          date: {
            label: 'تاریخ'
          },
          amount: {
            label: 'مبلغ'
          },
          reservation: {
            label: 'شرح'
          }
        },
        table2Items: [],
        selectedBooking:'',
        notes:''

      }
    },
    methods: {
      getBookings() {
        const config = {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        axios.get('https://api.asansport.com/v1/fields/' + this.$store.state.current_field + '/admin/bookings', config).then(resp => {
          if (resp.status < 300) {
            resp.data.data.forEach(dat => {
              let d = {
                user: {name: dat.booker_name},
                start: {time: this.toPersianNumber(dat.start)},
                result: dat.status === 0 ? 'در حال بررسی' : dat.status === 1 ? 'ثبت شده' : 'لغو شده',
                id: dat.id
              };
              this.tableItems.push(d);
            })

          }
          else {
            console.log(resp);
          }
        }).catch(e => {
          console.log(e);
        });
      },
      getTransactions() {
        const config = {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        axios.get('https://api.asansport.com/v1/fields/' + this.$store.state.current_field + '/admin/transactions', config).then(resp => {
          if (resp.status < 300) {
            resp.data.data.forEach(dat => {
              let d = {
                date: this.toPersianNumber(dat.created_at),
                amount: this.toPersianNumber(dat.amount),
                reservation: dat.description,
                id: dat.id
              };
              this.table2Items.push(d);
            })

          }
          else {
            console.log(resp);
          }
        }).catch(e => {
          console.log(e);
        });
      },
      updateNotes(id) {
        const config = {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        axios.put('https://api.asansport.com/v1/bookings/' + id + '/notes',{notes:this.notes} , config).then(resp => {
          if (resp.status < 300) {
            resp.data.data.forEach(dat => {
              let d = {
                date: this.toPersianNumber(dat.created_at),
                amount: this.toPersianNumber(dat.amount),
                reservation: dat.description,
                id: dat.id
              };
              this.table2Items.push(d);
            })

          }
          else {
            console.log(resp);
          }
        }).catch(e => {
          console.log(e);
        });
      },

      viewBooking(bookID){
        const config = {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        axios.get('https://api.asansport.com/v1/bookings/'+bookID, config).then(resp => {
          console.log(resp.data);
          if (resp.status < 300) {
            this.selectedBooking = resp.data.data;
          }
          else {
            console.log(resp);
          }
        }).catch(e => {
          console.log(e + "===============");
        });
      },
      reserveView(record, index) {
        console.log(record);
        console.log('ind: ' + index);
        this.index = index;
        this.viewBooking(record.id);
        this.selectedID = record.id;
        this.$refs.reserveModal.open();


      },
      transactionView(record, index) {
        this.index = index;
        this.$refs.transactionModal.show();
        // 'record' will be the row data from items
        // `index` will be the visible row number (available in the v-model 'shownItems')
        console.log(record); // This will be the item data for the row
      }
    },
    created() {
      this.getBookings();
      this.getTransactions();
    }
  }
</script>
