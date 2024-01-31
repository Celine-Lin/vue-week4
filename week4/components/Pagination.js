export default {
    props: ['pagination','getData'],
	template: "#Pagination", // 透過 x-template 綁定 HTML
    methods: {
        emitGetData(page) {
            this.$emit('emit-get-data', page);
        },
    },
}