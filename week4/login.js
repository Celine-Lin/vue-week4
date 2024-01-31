const app = Vue.createApp({
    data(){
        return{
            url: 'https://vue3-course-api.hexschool.io/v2',
            user: {
              username: '',
              password: '',
            },
        }
    },
    methods: {
        login(){
            axios.post(`${this.url}/admin/signin`, this.user)
                .then((res)=>{
                    alert('登入成功！');
                    // 存 token timestamp
                    const { token, expired } = res.data;
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
                    // 跳轉頁面
                    window.location = 'products.html';
                    
                })
                .catch(err=>{
                    alert(err.data.message);
                    // 清空input欄位
                    this.user.username = '';
                    this.user.password = '';
                })
        }
    }
});

app.mount('#app');
