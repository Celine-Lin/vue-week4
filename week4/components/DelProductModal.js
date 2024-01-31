export default{
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'vue-week2-new',
            delProductModal: null
        }
    },
    props: ['tempProduct'],
    template: "#DelProductModal",
    mounted() {
        this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal);
    },
    methods: {
        delProduct() {
            const url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then((res) => {
                    alert(res.data.message);
                    this.delProductModal.hide();
                    this.$emit('emitUpdate');
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
    },
}