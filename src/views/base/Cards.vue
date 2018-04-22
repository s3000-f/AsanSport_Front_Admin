<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="1" md="3">

      </b-col>
      <b-col sm="10" md="6">
        <b-card class="text-center">
          <div slot="header">
            <strong>افزودن تصویر جدید</strong>
          </div>
          <b-form-group
            label="انتخاب فایل"
            label-for="fileInput"
            :label-cols="3"
            :horizontal="false">
            <b-form-file accept=".jpg, .png" ref="fileInput" :plain="false" v-model="file"></b-form-file>
          </b-form-group>
          <div slot="footer">
            <b-button type="submit" size="sm" variant="primary" v-on:click="sendImage"><i
              class="fa fa-dot-circle-o"></i>&nbsp;&nbsp; ثبت &nbsp; &nbsp;
            </b-button>
            <b-button type="reset" size="sm" variant="danger" v-on:click="$refs.fileInput.reset()"><i
              class="fa fa-ban"></i> پاک کردن
            </b-button>
          </div>

        </b-card>
      </b-col>
      <b-col sm="1" md="3">

      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6" md="4" v-for="image in images">
        <b-card class="card-accent-info">
          <div slot="header" class="text-center">
            <b-button variant="danger" @click="removeImage(image.id)"><i class="fa fa-trash"></i>&nbsp; حذف</b-button>
          </div>
          <b-img v-bind:src="image.url" fluid></b-img>
        </b-card>
      </b-col>

    </b-row><!--/.row-->

  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'cards',
    data() {
      return {
        images: [],
        file: null
      }
    },
    methods: {
      getImages() {
        const config = {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        axios.get('http://api.shahbandegan.ir/v1/fields/' + this.$store.state.current_field + '/images', config).then(response => {
          if (response.status < 300) {
            this.images = response.data.data;
          } else {
            this.$notify({
              text: 'خطا در برقراری ارتباط',
              title: 'خطا',
              type: 'error'
            });
          }
        }).catch(e => {
          this.$notify({
            text: 'خطا در برقراری ارتباط',
            title: 'خطا',
            type: 'error'
          });
          console.log(e);
        })

      },
      sendImage() {
        if (this.file === null) {
          this.$notify({
            text: 'فایل نمیتواند خالی باشد',
            title: 'خطا',
            type: 'error'
          });
          return;
        }
        let fd = new FormData();
        fd.append('image', this.file);
        const config = {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.token,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        };
        axios.post('http://api.shahbandegan.ir/v1/fields/' + this.$store.state.current_field + '/images', fd, config)
          .then(response => {
            if (response.status < 300) {
              this.$notify({
                text: 'با موفقیت اضافه شد',
                title: 'توجه',
                type: 'success'
              });
              this.images.push(response.data.data)
            }
          })
          .catch(e => {
            this.$notify({
              text: 'خطا در برقراری ارتباط',
              title: 'خطا',
              type: 'error'
            });
            console.log(e);
          })
      },
      removeImage(id) {
        const config = {
          headers: {
            Authorization: 'Bearer ' + this.$store.state.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        axios.delete('http://api.shahbandegan.ir/v1/fields/' + this.$store.state.current_field + '/images/' + id, config).then(response => {
          if (response.status < 300) {
            let img = []
            this.images.forEach(i => {
              if(i.id !== id){
                img.push(i)
              }
            });
            this.images= img;
            this.$notify({
              text: 'تصویر با موفقیت حذف شد',
              title: 'توجه',
              type: 'success'
            });
          } else {
            this.$notify({
              text: 'خطا در برقراری ارتباط',
              title: 'خطا',
              type: 'error'
            });
          }
        }).catch(e => {
          this.$notify({
            text: 'خطا در برقراری ارتباط',
            title: 'خطا',
            type: 'error'
          });
          console.log(e);
        })
      }
    },
    created() {
      this.getImages();
    }
  }
</script>
