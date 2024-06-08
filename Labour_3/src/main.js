// import { createApp } from 'vue'
// import './style.css'
// import App from './components/Test.vue'

// createApp(App).mount('#app')
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 引入我们配置的路由

const app = createApp(App);

app.use(router); // 使用路由
app.mount('#app');
;
