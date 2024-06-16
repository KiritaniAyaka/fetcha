type MaybePromise<T> = T | Promise<T> | PromiseLike<T>
type RequestInterceptor = (...args: Parameters<typeof fetch>) => MaybePromise<Parameters<typeof fetch>>
type ResponseInterceptor<Input = Response, Output = Response> = (input: Input) => MaybePromise<Output>

export class FetchaBuilder<Output = Response> {
	constructor(
		private requestInterceptors: RequestInterceptor[] = [],
		private responseInterceptors: ResponseInterceptor<any, any>[] = [],
	) { }

	useRequestInterceptor(interceptor: RequestInterceptor): FetchaBuilder<Output> {
		return new FetchaBuilder([...this.requestInterceptors, interceptor], this.responseInterceptors)
	}

	useResponseInterceptor<CurInput extends Output, CurOutput>(interceptor: ResponseInterceptor<CurInput, CurOutput>): FetchaBuilder<Awaited<CurOutput>> {
		return new FetchaBuilder(this.requestInterceptors, [...this.responseInterceptors, interceptor])
	}

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
