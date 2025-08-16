// plugins/fontawesome.ts
import { defineNuxtPlugin } from "#app";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Import icon bạn muốn dùng
import {
    faPlus,
    faSearch,
    faAngleDown,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
// import { faTwitter } from "@fortawesome/free-brands-svg-icons";

// Ngăn Font Awesome tự thêm CSS mặc định
config.autoAddCss = false;

// Thêm icon vào library
library.add(faPlus, faSearch, faAngleDown, faTrash);

export default defineNuxtPlugin((nuxtApp) => {
    // Đăng ký component toàn cục
    nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon);
});
