import { coverageTests } from './coverageTests'
import { operationTests } from './operationTests'

await operationTests()
await coverageTests()
