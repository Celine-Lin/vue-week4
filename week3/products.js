// Bootstrap Modal 放全域設定
let productModal = null;
let delProductModal = null;

// Vue
const app = Vue.createApp({
    data(){
        return{
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'vue-week2-new',
            products: [],
            // isNew 用於表示當前 Modal 是新增或編輯 Modal，以便做後續串接 API 時的判斷
            isNew: false,
            // tempProduct 是預期開啟 Modal 時會代入的資料
            tempProduct: {}
        }
    },
    mounted() {
        // #1 Token 設定
        // 取得 Token（Token 僅需要設定一次）
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1");
        // 預設把 token 加入 headers 裡
        axios.defaults.headers.common.Authorization = token;

        // #2 確認是否登入
        this.checkLogin();

        // #3 Bootstrap Modal 設定
        // 第一個參數是你要設定為 Modal 的 DOM 元素
        const productModalDOM = document.getElementById("productModal");
        const delProductModalDOM = document.getElementById("delProductModal");
        // 第二個參數則是各種選項設定
        const options = {
            // 禁止使用者透過 Esc 按鍵來關閉 Modal 視窗
            keyboard: false,
            // 禁止使用者點擊 Modal 以外的地方來關閉視窗，避免輸入到一半資料遺失等等
            backdrop: 'static'
        };
        // 變數必須是在全域環境宣告，假設直接從 mounted 內宣告，會導致該變數作用域只存在 mounted 範圍內（因為 mounted 也屬於函式），而無法在 openModal 函式中順利取得該變數，導致錯誤
        productModal = new bootstrap.Modal( productModalDOM, options);
        delProductModal = new bootstrap.Modal( delProductModalDOM, options);
    },
    methods: {
        // #1 API: 驗證登入
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
        // #2 API: 取得產品資料
        getData(){
            axios.get(`${this.url}/api/${this.path}/admin/products/all`)
                .then(res=>{
                    this.products = res.data.products;
                })
                .catch(err=>{
                    alert(err.data.message);
                })
        },
        // #3 Modal: 判斷是要開啟哪一個 Modal-新增、編輯、刪除 
        // item 代表的是當前點擊的產品資料
        openModal(status, item) {
            if (status === 'new') {
              this.tempProduct = {};
              this.isNew = true;
              productModal.show();
            } else if (status === 'edit') {
              this.tempProduct = { ...item };
              this.isNew = false;
              productModal.show();
            } else if (status === 'delete') {
              this.tempProduct = { ...item };
              delProductModal.show()
            }
        },
        // #4 API: 新增/編輯 產品資料
        updateProduct() {
            let url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
            let http = 'put';

            // 透過 if 判斷 isNew 的值，得知當前開啟的是新增還是編輯 Modal，再動態調整這兩個變數內容
            if (this.isNew) {
              url = `${this.url}/api/${this.path}/admin/product`;
              http = 'post'
            }
      
            axios[http](url, { data: this.tempProduct })
                .then((res) => {
                    alert(res.data.message);
                    // 串接完成後，我們再利用 hide 方法關閉 Modal
                    productModal.hide();
                    // 重新取得所有產品資料，完成產品更新
                    this.getData();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        // #5 API: 刪除產品
        delProduct() {
            // 刪除 API 需要取得對應產品 id 才能刪除，因為我們先前在 openModal 函式已經寫好，開啟刪除 Modal 時，就將當前產品資料傳入 tempProduct，所以這裡就可以直接使用 this.tempProduct.id 取得該產品 id，完成刪除產品功能
            const url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      
            axios.delete(url)
                .then((res) => {
                    alert(res.data.message);
                    // 刪除成功後，要關閉刪除 Modal
                    delProductModal.hide();
                    // 更新資料後，重新取得所有產品的函式
                    this.getData();  
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
    }
});
app.mount('#app');