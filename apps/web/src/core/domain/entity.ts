import type { Identifier } from '#core/domain/identifier';

export interface EntityProperties {
	id: Identifier<string>;
}

export abstract class Entity<TProperties extends EntityProperties> {
	protected readonly props: TProperties;

	protected constructor(properties: TProperties) {
		this.props = properties;
	}

	getIdentifier(): TProperties['id'] {
		return this.props.id;
	}

	equals(entity?: Entity<TProperties> | null) {
		return entity ? this === entity || this.getIdentifier().equals(entity.getIdentifier()) : false;
	}
}
