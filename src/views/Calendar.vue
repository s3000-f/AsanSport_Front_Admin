<template>
  <div>
    <sweet-modal ref="calendarModal">
      <sweet-modal-tab ref="createBusyTime" title="ایجاد ساعت عدم فعالیت" id="tab1">
        <form @submit.prevent="createBusyTime()">
          <b-row>
          <b-col md="4">
            <label for="repeats"> تعداد تکرار </label></b-col>
          <b-col md="8">
            <b-input id="repeats" type="number" v-model="repeats"></b-input>
          </b-col>
          </b-row>
          <div style="height: 10px;"></div>
          <b-row>
            <b-col md="4"></b-col>
            <b-col md="4"><b-button variant="primary" class="px-4 btn-block pull-left" @click="createBusyTime()">ذخیره</b-button></b-col>
          </b-row>
        </form>
      </sweet-modal-tab>
      <sweet-modal-tab ref="createBooking" title="رزرو وقت" id="tab2">

      </sweet-modal-tab>
    </sweet-modal>

    <sweet-modal ref="removeBusyTimeModal" icon="error">
        <div>از حذف این مورد اطمینان دارید؟</div>
      <b-button>حذف این مورد</b-button>
      <b-button variant="danger">حذف این مورد و تمام تکرار ها</b-button>
    </sweet-modal>


    <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card header="تقویم من" class="text-right font-lg">
          <full-calendar ref="calendar" :event-sources="eventSources" @event-selected="eventSelected"
                         @event-created="eventCreated" :config="config"></full-calendar>
          <sweet-modal v-if="loaded" ref="book">
            <h3>رزرو سالن</h3>
            <div v-if="true">
              <div class="row">
                <div class="col-md-6 col-sm-6">
                  <div class="row">
                    <div class="col-md-12">
                      <strong >رزرو شده توسط:</strong> {{selectedBooking.user.name}}
                    </div>
                  </div>
                  <br>
                  <div class="row">
                    <div class="col-md-12">
                        <strong v-if="loaded && selectedBooking.transaction.status === 1 ">وضعیت پرداخت: پرداخت شده</strong>
                        <strong v-else="selectedBooking.transaction.status === 0 ">وضعیت پرداخت: پرداخت نشده</strong>
                      <br/>
                      <strong >هزینه:</strong> {{toPersianNumber(selectedBooking.transaction.amount)}} تومان

                      <span class="input-group-btn">
                </span>

                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-sm-6">
                  <div class="fancy-form">
                    <textarea v-model="notes" rows="5" class="form-control"
                              placeholder="یادداشت های خود را در اینجا بنویسید."></textarea>
                  </div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="row">
                <div class="col-md-12 text-right">
                </div>
                <div class="col-md-12 text-right">
                  <span><strong>زمان: </strong></span>
                  {{selectedBooking.start}}
                </div>

              </div>
                <div class="col-md-10">
                  <button class="btn btn-block btn-success margin-top-30" @click="viewBooking">ثبت تغییرات</button>
                </div>
            </div>
            <div v-else>

            </div>
          </sweet-modal>

        </b-card>
      </b-col>
    </b-row>
  </div>
  </div>
</template>


<script>
  /* eslint-disable indent */

  //   export default {
  //     mounted() {
  //       var calendar = $('#calendar').fullCalendar({
  //         header: {
  //           left: 'next,prev today',
  //           right: 'title'
  //         },
  //         buttonIcons: {
  //           prev: 'right-single-arrow',
  //           next: 'left-single-arrow',
  //           prevYear: 'left-double-arrow',
  //           nextYear: 'right-double-arrow'
  //         },
  //         isJalaali: true,
  //         isRTL: true,
  //         navlinks: false,
  //         lang: 'fa',
  //         eventLimit: false, // allow "more" link when too many events
  //         defaultView: 'agendaWeek',
  //         height: 550,
  //         allDaySlot: false,
  //         eventDurationEditable: false,
  //         eventOverlap: false,
  //         slotDuration: '00:30:00',
  //         slotLabelFormat: 'hh:mm',
  //         loading: function (bool) {
  //           $('#loading').toggle(bool);
  //         },
  //         editable: false,
  // //            eventDrop: eventMoved,
  //         events: {
  //           url: `https://api.asansport.com/v1/fields/y6NZ6Q/schedule`,
  //           method: "post",
  //           error: function () {
  //             $('#loadingError').show();
  //           }
  //         }
  //       });
  //     }
  //   }

  import moment from 'moment';
  import {SweetModal, SweetModalTab} from 'sweet-modal-vue'
  import axios from 'axios'
  import jMoment from 'moment-jalaali'
  import Button from "sweet-modal-vue/docs/components/Button";

  export default {
    name: 'FieldCalendar',
    data() {
      return {
        repeats: 1,
        discount_code: null,
        notes: null,
          start: jMoment(),
        selection: {
          start: jMoment(),
          end: jMoment(),
          bookable: false
        },

        loaded:false,
        config: {
          eventClick: (event) => {
            this.selected = event;
              if(event.event_type === 'busyTime') {
                this.$refs.removeBusyTimeModal.open();
              }
              if(event.event_type === 'booking') {
                // Handle booking event click
                this.viewBooking(event.id);
              }
          },
          dayClick: (event) => {
            console.log(event.utc().format('D-M-Y H:mm'));
            this.start = (event.utc().format('D-M-Y H:mm'));
          },
          select: (start, end) => {
              this.selection.start = start;
              this.selection.end = end;
              this.$refs.createBooking.disabled = moment.duration(end.diff(start)).asMinutes() !== 60
              this.$refs.calendarModal.open();
          },
          // windowResize: function(view) {
          //     if (window.width < 514) {
          //         this.$refs.calendar.fireMethod('changeView', 'basicDay')
          //     } else {
          //         this.$refs.calendar.fireMethod('changeView', 'basicWeek')
          //     }
          // },
          header: {
            left: 'next,prev today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
//                    right: 'month,agendaWeek,agendaDay'
          },
          buttonIcons: {
            prev: 'left-single-arrow',
            next: 'right-single-arrow',
            prevYear: 'left-double-arrow',
            nextYear: 'right-double-arrow'
          },
          locale: 'fa',
          isJalaali: true,
          isRTL: true,
          lang: 'fa',
          eventLimit: false, // allow "more" link when too many events
          defaultView: 'agendaWeek',
          height: 'auto',
          allDaySlot: false,
          eventDurationEditable: false,
          eventOverlap: false,
          slotDuration: '01:00:00',
          slotLabelFormat: 'HH:mm',
          editable: false,
          overlap: false,
          minTime: '06:00',
          displayEventTime: false
            // maxTime: '23:59'

        },
        selectedBooking:'',
        selected: {},
      };
    },

    methods: {
      refreshEvents() {
        this.$refs.calendar.$emit('refetch-events');
      },

      removeEvent() {
        this.$refs.calendar.$emit('remove-event', this.selected);
        this.selected = {};
      },

      eventSelected(event) {
        this.selected = event;
      },

      eventCreated(...test) {
        console.log(test);
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
            console.log(resp.data);
            this.loaded=true;
            this.$refs.book.open();

          }
          else {
            console.log(resp);
            console.log("BEGAII");

          }
        }).catch(e => {
          console.log(e + "===============");
        });
      },

      createBusyTime() {
          let config = {
              headers: {
                  Authorization: 'Bearer ' + this.$store.state.token,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              }
          };
          let data = {
              start: this.selection.start.locale('en').format('Y-M-D H:mm'),
              end: this.selection.end.locale('en').format('Y-M-D H:mm'),
              repeats: this.repeats,
          };
          axios.post('https://api.asansport.com/v1/fields/' + this.$store.state.current_field + '/admin/schedule', data,config)
              .then(response => {
                  if (response.status === 201) {
                      this.refreshEvents();
                      this.$refs.calendarModal.close();
                      this.repeats = 1;
                  } else {
                      this.notif('خطا', 'خطای داخلی، لطفا بعدا تلاش کنید', 'error');
                  }
              })
              .catch(e => {
                  console.log(e);
                  this.notif('خطا', 'خطا در برقراری ارتباط', 'error');
              });
      }
    },

    computed: {
      eventSources() {
        const self = this;
        return [
          {
            events(start, end, timezone, callback) {
                let config = {
                    headers: {
                        Authorization: 'Bearer ' + self.$store.state.token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };
              axios.get('https://api.asansport.com/v1/fields/' + self.$store.state.current_field + '/admin/bookings'
                  + `?start=${start}&end=${end}`, config)
                .then(response => {
                  if (response.status < 300) {
                    console.log(response.data)
                    response.data.data.forEach(function(obj) { obj.event_type = 'booking'; });
                    callback(response.data.data)
                  } else {
                    this.notif('خطا', 'خطای داخلی، لطفا بعدا تلاش کنید', 'error');
                  }
                })
                .catch(e => {
                  console.log(e);
                  this.notif('خطا', 'خطا در برقراری ارتباط', 'error');
                });
            },
          },
          {
            events(start, end, timezone, callback) {
                let config = {
                    headers: {
                        Authorization: 'Bearer ' + self.$store.state.token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };
              axios.get('https://api.asansport.com/v1/fields/' + self.$store.state.current_field + '/admin/schedule'
                  + `?start=${start}&end=${end}`, config)
                .then(response => {
                  if (response.status < 300) {
                    console.log(response.data)
                    response.data.forEach(function(obj) { obj.event_type = 'busyTime'; });
                    callback(response.data)
                  } else {
                    this.notif('خطا', 'خطای داخلی، لطفا بعدا تلاش کنید', 'error');
                  }
                })
                .catch(e => {
                  console.log(e);
                  this.notif('خطا', 'خطا در برقراری ارتباط', 'error');
                });
            },
              color: 'red',
              overlap: false,
          },
        ];
      },
    },
    components: {
        Button,
        SweetModal,
      SweetModalTab
    }
  };
</script>

<style src="../assets/css/fullcalendar.min.css"></style>
