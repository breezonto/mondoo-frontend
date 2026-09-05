import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import MainLayout      from '@/views/MainLayout.vue';
import AgentView       from '@/views/Espacio.vue';
import FileListView    from '@/views/FileLibrary.vue';

import routeConfig from '@/config/routes.json'


const components = {
  AgentView,
  FileListView,
  MainLayout
};


function _loadRoutes(config: any[]): RouteRecordRaw[] {
  return config.map(route => {
    const result: any = {
      path: route.path
    };

    if (route.name) {
      result.name = route.name;
    }

    if (route.redirect) {
      result.redirect = route.redirect;
    }

    if (route.meta) {
      result.meta = route.meta;
    }

    if (route.component) {
      result.component =
        components[route.component as keyof typeof components];
    }

    if (route.children) {
      result.children = _loadRoutes(route.children);
    }

    return result;
  });
}

const routes = _loadRoutes(routeConfig);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});


router.beforeEach(async (_to, _from, next) => {
  next();
});

export default router;