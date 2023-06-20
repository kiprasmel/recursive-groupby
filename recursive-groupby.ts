export function recursiveGroupBy<T, K extends keyof T, V extends T[K] & (string | number | symbol), U = unknown>(data: T[], groupers: K[], leafItemTransformer?: K | ((leafs: T[]) => U)) {
	const obj: Record<V, T[]> = {} as any;

	if (groupers.length === 0) {
		if (leafItemTransformer) {
			if (leafItemTransformer instanceof Function) {
				return leafItemTransformer(data);
			} else {
				return data.map(x => x[leafItemTransformer]);
			}
		}

		return data;
	}

	const grouper = groupers[0];

	for (const item of data) {
		const value: V = item[grouper] as V;

		if (!obj[value]) {
			obj[value] = [];
		}

		obj[value].push(item);
	}

	type GroupedObj = Record<V, Record<V, T[]>> // TODO if last grouper, then only 1-level deep record.
	const groupedObj: GroupedObj = {} as GroupedObj; // TODO TS

	const nextGroupers: K[] = groupers.slice(1);

	for (const entry of Object.entries(obj)) {
		const group: V = entry[0] as V; // TODO TS - should infer automatically.
		const subvalues: T[] = entry[1] as T[]; // TODO TS - should infer automatically.

		const subgrouped = recursiveGroupBy(subvalues, nextGroupers, leafItemTransformer);
		groupedObj[group] = subgrouped as any; // TODO TS FIXME
	}

	return groupedObj;
}

