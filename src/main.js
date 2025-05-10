import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

/* Import FontAwesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* Import specific icons */
import { faUserSecret, faCheck, faTasks, faCalendar } from '@fortawesome/free-solid-svg-icons'

/* Add icons to the library */
library.add(faUserSecret, faCheck, faTasks, faCalendar)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app') 