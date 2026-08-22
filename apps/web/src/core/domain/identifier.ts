import { randomUUID } from 'node:crypto';
import { ValueObject } from '#core/domain/value_object';

export class Identifier<TType extends string> extends ValueObject<{ value: string }> {
	declare protected readonly type: TType;

	constructor(properties: { value: string }) {
		super(properties);
	}

	static generate<TIdentifier extends Identifier<string>>(
		this: new (properties: { value: string }) => TIdentifier,
	): TIdentifier {
		return new this({ value: randomUUID() });
	}

	static fromString<TIdentifier extends Identifier<string>>(
		this: new (properties: { value: string }) => TIdentifier,
		value: string,
	): TIdentifier {
		return new this({ value });
	}

	toString() {
		return this.props.value;
	}
}
