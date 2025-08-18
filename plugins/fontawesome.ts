// plugins/fontawesome.ts
import { defineNuxtPlugin } from '#app';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import icon bạn muốn dùng
import {
    faPlus,
    faSearch,
    faAngleDown,
    faAngleRight,
    faAnglesLeft,
    faAnglesRight,
    faTrash,
    faAdd,
    faClose,
    faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

// Ngăn Font Awesome tự thêm CSS mặc định
config.autoAddCss = false;

library.add(
    faPlus,
    faSearch,
    faAngleDown,
    faAngleRight,
    faTrash,
    faAdd,
    faClose,
    faArrowUpRightFromSquare,
    faAnglesRight,
    faAnglesLeft,
);

export default defineNuxtPlugin((nuxtApp: any) => {
    nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
});
