declare module 'tabulator-tables' {
	export class TabulatorFull {
		constructor(element: HTMLElement | string, options?: any);
		// Add more method signatures as needed
		destroy(): void;
		getData(): any[];
		setData(data: any[]): void;
		clearData(): void;
		redraw(force?: boolean): void;
		// Add other methods you use
	}

	// Export other classes/types as needed
	export default TabulatorFull;
}

declare module 'tabulator-tables/dist/css/tabulator.min.css' {
	const content: any;
	export default content;
}
