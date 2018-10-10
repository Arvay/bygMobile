import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Success from '@/components/success'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '搬运工',
      component: HelloWorld
    },
    {
      path: '/success',
      name: '成功',
      component: Success
    }
  ]
})
