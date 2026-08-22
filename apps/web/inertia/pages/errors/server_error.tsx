import { Head } from '@inertiajs/react';
import { ErrorPage } from '~/components/error-page';

export default function ServerError() {
	return (
		<>
			<Head title="Something went wrong" />
			<ErrorPage
				status="500"
				title="Something went wrong on our side."
				description="The request could not be completed. Try again in a moment, or return home while we straighten things out."
			/>
		</>
	);
}
