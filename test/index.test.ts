import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { http } from 'msw'
import { setupServer } from 'msw/node'
import { FetchaBuilder } from '@/index'

type Param = Parameters<typeof fetch>

export const handlers = [
	http.get('https://example.com/hello', () => {
		return new Response('Hello!')
	}),
]

const server = setupServer(...handlers)

describe('should', () => {
	let builder: FetchaBuilder | null = null

	beforeAll(() => {
		server.listen({ onUnhandledRequest: 'error' })
	})

	beforeEach(() => {
		builder = new FetchaBuilder()
	})

	afterEach(() => {
		builder = null
		return server.resetHandlers()
	})

	afterAll(() => server.close())

	it('call request interceptor', async () => {
		const mock = vi.fn<Param, Param>().mockImplementation((url, init) => [url, init])

		const fetcha = builder!
			.useRequestInterceptor(mock)
			.build()
		await fetcha('https://example.com/hello')

		expect(mock).toHaveBeenCalled()
	})

	it('request interceptor transform request', async () => {
		const mock = vi.fn<Param, Param>().mockImplementation((url, init) => {
			if (typeof url === 'string' && !url.match(/^[a-z]+:\/\//g))
				return [`https://example.com${url}`, init]
			return [url, init]
		})

		const fetcha = builder!
			.useRequestInterceptor(mock)
			.build()
		await fetcha('/hello')

		expect(mock).toHaveBeenCalled()
	})

	it('call response interceptor', async () => {
		const mock = vi.fn<[Response], Response>().mockImplementation(response => response)

		const fetcha = builder!
			.useResponseInterceptor(mock)
			.build()
		await fetcha('https://example.com/hello')

		expect(mock).toHaveBeenCalled()
	})

	it('response interceptor transform response', async () => {
		const mock = vi.fn<[Response], Promise<string>>().mockImplementation(async (response) => {
			const result = await response.text()
			return result
		})

		const fetcha = builder!
			.useResponseInterceptor(mock)
			.build()
		const result = await fetcha('https://example.com/hello')

		expect(mock).toHaveBeenCalled()
		expect(result).toBe('Hello!')
	})
})
