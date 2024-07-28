type MaybePromise<T> = T | Promise<T> | PromiseLike<T>
type RequestInterceptor = (...args: Parameters<typeof fetch>) => MaybePromise<Parameters<typeof fetch>>
type ResponseInterceptor<Input = Response, Output = Response> = (input: Input) => MaybePromise<Output>

/**
 * A class to build a fetcha client with interceptors
 */
export class FetchaBuilder<Output = Response> {
	/**
	 * Create a new fetcha builder instance
	 * @param requestInterceptors Initial request interceptors
	 * @param responseInterceptors Initial response interceptors
	 */
	constructor(
		private requestInterceptors: RequestInterceptor[] = [],
		private responseInterceptors: ResponseInterceptor<any, any>[] = [],
	) { }

	/**
	 * Apply a request interceptor
	 * @param interceptor Request interceptor to be applied
	 * @returns A new builder instance with interceptors applied
	 */
	useRequestInterceptor(interceptor: RequestInterceptor): FetchaBuilder<Output> {
		return new FetchaBuilder([...this.requestInterceptors, interceptor], this.responseInterceptors)
	}

	/**
	 * Apply a response interceptor
	 * @param interceptor Response interceptor to be applied
	 * @returns A new builder instance with interceptors applied
	 */
	useResponseInterceptor<CurInput extends Output, CurOutput>(interceptor: ResponseInterceptor<CurInput, CurOutput>): FetchaBuilder<Awaited<CurOutput>> {
		return new FetchaBuilder(this.requestInterceptors, [...this.responseInterceptors, interceptor])
	}

	/**
	 * Build a fetcha client with the current interceptors
	 * @returns The fetcha client with the interceptors current applied
	 */
	build(): (...args: Parameters<typeof fetch>) => Promise<Output> {
		return async (...[req, init]: Parameters<typeof fetch>) => {
			for (const interceptor of this.requestInterceptors)
				[req, init] = await interceptor(req, init)

			const response = await fetch(req, init)

			let result = response
			for (const interceptor of this.responseInterceptors)
				result = await interceptor(result)

			return result as unknown as Output
		}
	}
}
