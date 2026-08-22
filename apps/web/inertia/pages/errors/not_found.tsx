import { Head } from '@inertiajs/react';
import { ErrorPage } from '~/components/error-page';

export default function NotFound() {
	return (
		<>
			<Head title="Page not found" />
			<ErrorPage
				status="404"
				title="This page wandered off."
				description="The address may be incorrect, or the page may have moved. Head home and continue from there."
			/>
		</>
	);
}
