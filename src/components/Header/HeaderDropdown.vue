<template>
  <b-nav-item-dropdown v-bind:text="' ' + $store.state.user.fname + ' ' + $store.state.user.lname + ' '" right>
    <b-dropdown-header tag="div" class="text-center"><strong>سالن ها</strong></b-dropdown-header>
    <b-dropdown-item v-for="field in $store.state.user.fields" v-on:click="switchField(field)"><i class="fa fa-soccer-ball-o"></i> {{field.name}}
      <b-badge variant="success" v-if="field.id === $store.state.current_field">فعال</b-badge>
    </b-dropdown-item>
    <b-dropdown-header tag="div" class="text-center"><strong>تنظیمات</strong></b-dropdown-header>
    <b-dropdown-item @click="$router.replace('/manager/base/cards' )"><i class="fa fa-user"></i> پروفایل</b-dropdown-item>
    <b-dropdown-item v-on:click="$store.dispatch('logout'); $router.replace('/');"><i class="fa fa-lock"></i> خروج</b-dropdown-item>
  </b-nav-item-dropdown>
</template>
<script>
  import axios from 'axios';
  export default {
    name: 'header-dropdown',
    data: () => {
      return {itemsCount: 42}
    },
    methods: {
      switchField(field) {
        this.$store.dispatch('setCurrentField', field.id);
        let config = {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        axios.get('https://api.asansport.com/v1/fields/' + this.$store.state.current_field  , config).then(response => {
          if (response.status === 201) {
            let start = response.data.day_start;
            let end = response.data.day_end;
            let duration = response.data.duration;
            this.$store.dispatch('setCurrentFieldDetails', start , end , duration);
          } else {
          }
        })
          .catch(e => {
            console.log(e);
            this.notif('خطا', 'خطا در برقراری ارتباط', 'error');
          });
        this.$notify({
          text: field.name + ' انتخاب شد',
          type: 'success',
          title: 'توجه'
        })
      }
    }
  }
</script>
