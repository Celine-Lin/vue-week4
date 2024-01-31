export default {
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'vue-week2-new',
            productModal: null
        }
    },
    props:['tempProduct','isNew'],
	template: "#ProductModal",  
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.productModal);
    },
    methods: {
        updateProduct() {
            let url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
            let http = 'put';

            if (this.isNew) {
              url = `${this.url}/api/${this.path}/admin/product`;
              http = 'post'
            }
      
            axios[http](url, { data: this.tempProduct })
                .then((res) => {
                    alert(res.data.message);
                    this.productModal.hide();
                    this.$emit('emitUpdate');
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
    },
}