# fetcha

[![NPM Version](https://img.shields.io/npm/v/%40kiritaniayaka%2Ffetcha?style=flat&colorA=080f12&colorB=1fa669)](https://www.npmjs.com/package/@kiritaniayaka/fetcha)
[![npm downloads](https://img.shields.io/npm/dy/%40kiritaniayaka%2Ffetcha?style=flat&colorA=080f12&colorB=1fa669)](https://www.npmjs.com/package/@kiritaniayaka/fetcha)
[![JSR](https://jsr.io/badges/@kiritaniayaka/fetcha)](https://jsr.io/@kiritaniayaka/fetcha)
[![JSR Score](https://jsr.io/badges/@kiritaniayaka/fetcha/score)](https://jsr.io/@kiritaniayaka/fetcha)
[![bundle](https://img.shields.io/bundlephobia/minzip/%40kiritaniayaka%2Ffetcha?style=flat&colorA=080f12&colorB=1fa669&label=minzip)](https://bundlephobia.com/package/@kiritaniayaka/fetchaa)
[![JSDocs](https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669)](https://www.jsdocs.io/package/@kiritaniayaka/fetcha)
[![License](https://img.shields.io/github/license/KiritaniAyaka/fetcha.svg?style=flat&colorA=080f12&colorB=1fa669)](https://github.com/KiritaniAyaka/fetcha/blob/main/LICENSE)

A minimal fetch client wrapper with interceptor.

## Examples

```ts
const baseUrl = 'http://localhost:8000'

const fetcha = new FetchaBuilder()
	.useRequestInterceptor((info, init) => { // base url example
		return [`${baseUrl}${info}`, init]
	})
	.useResponseInterceptor(async (response) => { // interceptor could be async
		if (!response.ok())
			return toast('Some thing went wrong')
		return await response.json()
	})
	.build() // build a fetcha client

fetcha('/api/hello') // use it like fetch
```

## License

[MIT](./LICENSE) License © 2024 [Kiritani Ayaka](https://github.com/KiritaniAyaka)
