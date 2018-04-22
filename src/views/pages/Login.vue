<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center" >
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4" v-if="!loading">
              <b-card-body>
                <h1 class="text-right">ورود مدیران</h1>
                <p class="text-muted text-right">به حساب خود وارد شوید</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-user"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="تلفن همراه" v-model="username">
                </b-input-group>
                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <input type="password" class="form-control" placeholder="رمزعبور" v-model="password">
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" class="px-4" v-on:click="login">ورود</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <b-button variant="link" class="px-0">یادآوری رمزعبور!</b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>

            <b-card no-body class="p-4 text-center" v-else>
              <div class="align-content-center">
                <i class="fa fa-circle-o-notch fa-spin fa-5x" ></i>
              </div>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>

    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import {mapGetters} from 'vuex';
  import axios from 'axios';

  export default {
    name: 'Login',
    data() {
      return {
        loading: false,
        username: '',
        password: ''
      }
    },
    computed: {
      ...mapGetters({
        isLogged: 'isLogged',
        getToken: 'getToken',
        getErrors: 'getErrors'
      })
    },
    methods: {
      ...mapActions({
        setLogin: 'setLogin',
        setError: 'setError',
        resetError: 'resetError',
        setUser: 'setUser'
      }),
      login() {
        if (this.username.length !== 11 || this.password.length < 8) {
          this.$notify({
            text: 'اطلاعات ورودی اشتباه است',
            type: 'error',
            title: 'خطا'
          });
          return;
        }
        this.loading = true;
        axios.post("http://api.shahbandegan.ir/v1/login", {
          username: this.username,
          password: this.password
        })
          .then(response => {
            if (response.status < 300) {
              this.title = response.data;
              this.setLogin(response.data['access_token']);
              this.resetError();
              this.setUser();
              this.$router.push('/manager');

            }
            else {
              this.setError(response.data['message']);
              this.$notify({
                text: response.data['message'],
                type: 'error',
                title: 'خطا'
              });
            }
            this.loading = false;
          })
          .catch(e => {
              this.$notify({
                text: 'خطا در برقراری ارتباط',
                type: 'error',
                title: 'خطا'
              });
              this.setError(e);
              this.loading = false;

            }
          )
      },

    },
    created() {
      if (this.isLogged){
        this.$router.replace('/manager')
      }
    }

  }
</script>
