import { AuthRequiredError } from "../lib/exception"

const Error = ({ error, reset }) => (
  <div>
    <h3>An Error Occureded!!</h3>
    <p>{error.message}</p>
    <button onClick={reset}>Retry</button>
  </div>
)
export default Error

const session = null
export function Home() {
  if (!session) throw new AuthRequiredError()
  return <main> this is an auth-only page</main>
}
