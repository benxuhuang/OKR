import { createApp } from 'vue'
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
  faSearch
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
  faSearch
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app') 