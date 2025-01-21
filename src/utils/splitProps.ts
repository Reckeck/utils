type SplitProps<
	Props extends Record<string, unknown>,
	Keys extends (readonly (keyof Props)[])[],
> = [
	...{
		[Property in keyof Keys]: Property extends `${number}`
			? Pick<Props, Extract<Keys[Property], readonly (keyof Props)[]>[number]>
			: never
	},
	{ [Property in keyof Props as Exclude<Property, Keys[number][number]>]: Props[Property] },
];

/**
 * The split props in objects by keys and extract all unselected props in external object.
 * 
 * @param props - object with props
 * @param keys - arrays with props name
 * @returns [...selectedPropsObjects, unselectedProps]
 * 
 * @example
 * ```ts
 * const [obj1, obj2, spread] = splitProps(
 * 	{
 * 		propOne: 1,
 * 		propTwo: 2,
 * 		otherProp: [1,2]
 * 	},
 * 	['propOne'],
 * 	['propOne', 'propTwo'],
 * )
 * 
 * obj1 -> ({
 *		propOne: 1,	
 * })
 * 
 * obj2 -> ({
 *		propOne: 1,	
 *		propTwo: 2,	
 * })
 * 
 * spread -> ({
 *		otherProp: [1,2]
 * })
 * ```
 */
const splitProps = <
	T extends Record<string, unknown>,
	K extends [...(readonly (keyof T)[])[], readonly (keyof T)[]],
>(props: T, ...keys: K): SplitProps<T, K> => {
	const propsByKeys: Record<string, unknown>[] = [];
	const otherProps: Record<string, unknown> = {};

	for (const propName of Object.getOwnPropertyNames(props)) {
		const descriptor = Object.getOwnPropertyDescriptor(props, propName)!;

		let objectIndex = 0;
		let propInList = false;

		for (const key in keys) {
			if (key.includes(propName)) {
				propInList = true;
				setObjectProperty(propsByKeys[objectIndex], propName, descriptor);
			}

			++objectIndex;
		}

		if (propInList) {
			setObjectProperty(otherProps, propName, descriptor);
		}
	}

	return [...propsByKeys, otherProps] as unknown as SplitProps<T, K>;
};

const checkOnDefaultDescriptor = (descriptor: PropertyDescriptor) =>
	!descriptor.get &&
	!descriptor.set &&
	descriptor.enumerable &&
	descriptor.writable &&
	descriptor.configurable;

const setObjectProperty = (
	object: Record<string, unknown>,
	propName: string,
	descriptor: PropertyDescriptor,
) => {
	const isDefaultDescriptor = checkOnDefaultDescriptor(descriptor);

	if (isDefaultDescriptor) {
		object[propName] = descriptor.value;
	} else {
		Object.defineProperty(object, propName, descriptor);
	}
};

export { splitProps };
