import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

/* Import FontAwesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* Import specific icons */
import {
  faClipboardCheck,
  faTasks,
  faBullseye,
  faChartBar,
  faCalendarAlt,
  faPlus,
  faEdit,
  faTrash,
  faClock,
  faSearch,
  faCog,
  faSun,
  faMoon,
  faDownload,
  faUpload
} from '@fortawesome/free-solid-svg-icons'

/* Add icons to the library */
library.add(
  faClipboardCheck,
  faTasks,
  faBullseye,
  faChartBar,
  faCalendarAlt,
  faPlus,
  faEdit,
  faTrash,
  faClock,
  faSearch,
  faCog,
  faSun,
  faMoon,
  faDownload,
  faUpload
)

const app = createApp(App)
const pinia = createPinia()

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(router)

// 初始化主題
import { useThemeStore } from './stores/themeStore'
const themeStore = useThemeStore(pinia)
themeStore.initTheme()

app.mount('#app') 