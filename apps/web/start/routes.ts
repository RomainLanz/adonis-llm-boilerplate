import '#app/identity/routes';
import router from '@adonisjs/core/services/router';

router.on('/').renderInertia('home', {}).as('home');
