import Pagination from "./components/Pagination.js";  // ➊ 分頁：拆分元件 ① import module 
import ProductModal from "./components/ProductModal.js"; // ➋ 建立產品：① import module 
import DelProductModal from "./components/DelProductModal.js"; // ➌ 刪除產品：① import module 

// Vue
const app = Vue.createApp({
    data(){
        return{
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'vue-week2-new',
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
            pagination: {} // ➊ 分頁：① 定義分頁
        }
    },
    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1");
        axios.defaults.headers.common.Authorization = token;
        this.checkLogin();
    },
    methods: {
        checkLogin(){
            axios.post(`${this.url}/api/user/check`)
                .then(()=>{
                    this.getData();
                })
                .catch(err=>{
                    alert(err.data.message);
                    window.location = 'login.html';
                })
        },
        getData(page =1){ // ➊ 分頁：④ 預設參數
            axios.get(`${this.url}/api/${this.path}/admin/products?page=${page}`) // ➊ 分頁：④ query string 指定目前在第幾頁
                .then(res=>{
                    this.products = res.data.products;
                    // console.log(res.data); // ➊ 分頁：② 查看分頁在資料結構的位置
                    this.pagination = res.data.pagination; // ➊ 分頁：③ 把分頁 data 存起來
                })
                .catch(err=>{
                    alert(err.data.message);
                })
        },
        openModal(status, item) {
            if (status === 'new') {
              this.tempProduct = {imagesUrl: [],};
              this.isNew = true;
              this.$refs.updateProduct.productModal.show();
            } else if (status === 'edit') {
              this.tempProduct = { ...item };
              this.isNew = false;
              this.$refs.updateProduct.productModal.show();
            } else if (status === 'delete') {
              this.tempProduct = { ...item };
              this.$refs.deleteProduct.delProductModal.show();
            }
        },
    },
    // 區域註冊
    components: {
		Pagination, // ➊ 分頁：拆分元件 ② 區域註冊
        ProductModal, // ➋ 建立產品：拆分元件 ② 區域註冊
        DelProductModal // ➌ 刪除產品：：拆分元件 ② 區域註冊
	},
});
app.mount('#app');