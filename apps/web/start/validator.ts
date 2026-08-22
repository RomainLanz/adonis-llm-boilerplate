/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with the rest of the application
| Luxon DateTime.
|
*/

import { VineDate } from '@vinejs/vine';
import { DateTime } from 'luxon';

declare module '@vinejs/vine/types' {
	interface VineGlobalTransforms {
		date: DateTime;
	}
}

VineDate.transform((value) => DateTime.fromJSDate(value));
