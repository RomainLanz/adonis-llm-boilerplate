export abstract class ValueObject<TProperties extends object> {
	protected readonly props: Readonly<TProperties>;

	protected constructor(properties: TProperties) {
		this.props = Object.freeze({ ...properties });
	}

	equals(valueObject?: ValueObject<TProperties> | null) {
		return valueObject ? JSON.stringify(this.props) === JSON.stringify(valueObject.props) : false;
	}
}
