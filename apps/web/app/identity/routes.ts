import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const LoginController = () => import('#app/identity/controllers/login_controller');
const RegisterUserController = () => import('#app/identity/controllers/register_user_controller');
const LogoutController = () => import('#app/identity/controllers/logout_controller');
const AccountController = () => import('#app/identity/controllers/account_controller');

router
	.group(() => {
		router.get('signup', [RegisterUserController, 'render']).as('new_account.create');
		router.post('signup', [RegisterUserController, 'execute']).as('new_account.store');
		router.get('login', [LoginController, 'render']).as('session.create');
		router.post('login', [LoginController, 'execute']).as('session.store');
	})
	.use(middleware.guest());

router
	.group(() => {
		router.get('account', [AccountController, 'render']).as('account.show');
		router.post('logout', [LogoutController, 'execute']).as('session.destroy');
	})
	.use(middleware.auth());
