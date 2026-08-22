import { HttpContext } from '@adonisjs/core/http';
import { BaseSerializer } from '@adonisjs/core/transformers';

interface PaginationMetaKeys {
	total: number;
	perPage: number;
	currentPage: number;
	lastPage: number;
	firstPage: number;
}

/**
 * Custom serializer for API responses that ensures consistent JSON structure
 * across all API endpoints. Wraps response data in a 'data' property and handles
 * pagination metadata for application query results.
 */
class ApiSerializer extends BaseSerializer<{
	Wrap: 'data';
	PaginationMetaData: PaginationMetaKeys;
}> {
	/**
	 * Wraps all serialized data under this key in the response object.
	 * Example: { data: [...] } instead of returning raw arrays/objects
	 */
	wrap = 'data' as const;

	/**
	 * Validates and defines pagination metadata structure for paginated responses.
	 * Ensures that pagination information is properly formatted.
	 *
	 * @throws Error if metadata does not match the expected pagination structure
	 */
	definePaginationMetaData(metaData: unknown): PaginationMetaKeys {
		if (!isPaginationMetaData(metaData)) {
			throw new Error('Invalid pagination metadata');
		}
		return metaData;
	}
}

function isPaginationMetaData(metaData: unknown): metaData is PaginationMetaKeys {
	if (typeof metaData !== 'object' || metaData === null) {
		return false;
	}
	return ['total', 'perPage', 'currentPage', 'lastPage', 'firstPage'].every(
		(key) => typeof Reflect.get(metaData, key) === 'number',
	);
}

/**
 * Single instance of ApiSerializer used across the application
 */
const serializer = new ApiSerializer();
// SAFETY: The assigned function and property delegate to the matching ApiSerializer methods.
const serialize = Object.assign(
	function (this: HttpContext, ...[data, resolver]: Parameters<ApiSerializer['serialize']>) {
		return serializer.serialize(data, resolver ?? this.containerResolver);
	},
	{
		withoutWrapping(this: HttpContext, ...[data, resolver]: Parameters<ApiSerializer['serializeWithoutWrapping']>) {
			return serializer.serializeWithoutWrapping(data, resolver ?? this.containerResolver);
		},
	},
) as ApiSerializer['serialize'] & { withoutWrapping: ApiSerializer['serializeWithoutWrapping'] };

/**
 * Adds the serialize method to all HttpContext instances.
 * Usage in controllers: return ctx.serialize(data)
 * This ensures all API responses follow the same structure with data wrapping.
 */
HttpContext.instanceProperty('serialize', serialize);

/**
 * Module augmentation to add the serialize method to HttpContext.
 * This allows controllers to use ctx.serialize() for consistent API responses.
 */
declare module '@adonisjs/core/http' {
	export interface HttpContext {
		serialize: typeof serialize;
	}
}
