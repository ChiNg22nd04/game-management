// plugins/fontawesome.ts
import { defineNuxtPlugin } from '#app';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import icon bạn muốn dùng
import { faPlus, faSearch, faAngleDown, faTrash, faAdd, faClose } from '@fortawesome/free-solid-svg-icons';

// Ngăn Font Awesome tự thêm CSS mặc định
config.autoAddCss = false;

library.add(faPlus, faSearch, faAngleDown, faTrash, faAdd, faClose);

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
});
