import Vue from 'vue';
import App from './App.vue';
import * as FilePond from 'filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register FilePond plugins globally
FilePond.registerPlugin(FilePondPluginFileValidateSize);
FilePond.registerPlugin(FilePondPluginFileValidateType);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
