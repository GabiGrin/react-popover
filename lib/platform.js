

const isServer = () => typeof window === `undefined`
const isClient = () => !isServer()

const getWindow = isClient() ? window : null
const getDocument = isClient() ? document : null

export default {
  isServer,
  isClient,
  getWindow,
	getDocument
}
export {
  isServer,
  isClient,
  getWindow,
	getDocument
}
