<template>
    <div class="animated fadeIn">
        <b-row>
            <b-col md="12">
                <b-card header="تقویم من" class="text-right font-lg">
                    <full-calendar ref="calendar" :event-sources="eventSources" @event-selected="eventSelected"
                                   @event-created="eventCreated" :config="config"></full-calendar>
                </b-card>
            </b-col>
        </b-row>
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
//           url: `http://api.shahbandegan.ir/v1/fields/y6NZ6Q/schedule`,
//           method: "post",
//           error: function () {
//             $('#loadingError').show();
//           }
//         }
//       });
//     }
//   }

import moment from 'moment';
// import {SweetModal, SweetModalTab} from 'sweet-modal-vue'
import axios from 'axios'

export default {
    name: 'FieldCalendar',
    data() {
        return {
            repeats: 1,
            discount_code: null,
            notes: null,
            start: null,

            events: [
                {
                    id: 1,
                    title: 'event1',
                    start: moment().hours(12).minutes(0),
                },
                {
                    id: 2,
                    title: 'event2',
                    start: moment().add(-1, 'days'),
                    end: moment().add(1, 'days'),
                    allDay: true,
                },
                {
                    id: 3,
                    title: 'event3',
                    start: moment().add(2, 'days'),
                    end: moment().add(2, 'days').add(6, 'hours'),
                    allDay: false,
                },
            ],

            config: {
                eventClick: (event) => {
                    this.selected = event;
                },
                dayClick: (event) => {
                    console.log(event.utc().format('D-M-Y H:mm'));
                    this.start = (event.utc().format('D-M-Y H:mm'));
                },
                // windowResize: function(view) {
                //     if (window.width < 514) {
                //         this.$refs.calendar.fireMethod('changeView', 'basicDay')
                //     } else {
                //         this.$refs.calendar.fireMethod('changeView', 'basicWeek')
                //     }
                // },
                header: {
                    left: '',//'next,prev today',
                    right: 'title',
                    center: ''
//                    right: 'month,agendaWeek,agendaDay'
                },
                buttonIcons: {
                    prev: 'right-single-arrow',
                    next: 'left-single-arrow',
                    prevYear: 'left-double-arrow',
                    nextYear: 'right-double-arrow'
                },
                locale: 'fa',
                isJalaali: true,
                isRTL: true,
                lang: 'fa',
                eventLimit: false, // allow "more" link when too many events
                defaultView: 'agendaWeek',
                height: 500,
                allDaySlot: false,
                eventDurationEditable: false,
                eventOverlap: false,
                slotDuration: '01:00:00',
                slotLabelFormat: 'HH:mm',
                editable: false,
                overlap: false

            },

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
        book() {

            console.log(this.repeats);
            console.log(this.notes);
            console.log(this.discount_code);
            console.log(this.start);

            let dat = {
                start: this.start,
                repeats: this.repeats,
                notes: (this.notes == null) ? this.notes : '',
                discount_code: (this.discount_code == null) ? this.discount_code : ''
            };
            let config = {
                headers: {
                    Authorization: 'Bearer ' + this.$store.state.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            axios.post('http://api.shahbandegan.ir/v1/fields/' + this.$route.params.id + '/book', dat, config)
                .then(response => {
                    if (response.status < 300) {
                        this.notif('توجه', 'رزرو سالن شما با موفقیت ثبت شد', 'success')
                    } else {
                        this.notif('خطا', 'خطای داخلی، لطفا بعدا تلاش کنید', 'error');
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.notif('خطا', 'خطا در برقراری ارتباط', 'error');
                });
            this.repeats = 1;
            this.notes = null;
            this.discount_code = null;
        },
    },

    computed: {
        eventSources() {
            const self = this;
            return [
                {
                    events(start, end, timezone, callback) {
                        setTimeout(() => {
                            console.log("================")
                            axios.get('http://api.shahbandegan.ir/v1/fields/' + self.$route.params.id + '/schedule')
                                .then(response => {
                                    console.log("================XXXXX=================")
                                    if (response.status < 300) {
                                        console.log(response.data)
                                        callback(response.data)
                                    } else {
                                        this.notif('خطا', 'خطای داخلی، لطفا بعدا تلاش کنید', 'error');
                                    }
                                })
                                .catch(e => {
                                    console.log(e);
                                    this.notif('خطا', 'خطا در برقراری ارتباط', 'error');
                                });
                        }, 1000);
                    },
                    overlap: "false",
                    rendering: "background",
                    color: "#ff9f89"
                },
            ];
        },
    },
    components: {
        // SweetModal,
        // SweetModalTab
    }
};
</script>

<style src="../assets/css/fullcalendar.min.css"></style>
