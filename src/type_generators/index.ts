import fs from 'node:fs'
import openapiTS, { astToString } from 'openapi-typescript'
import { dirname, join } from 'node:path'

const apiMethods: any = {
  balance: '/balance-api/',
  hafah: '/hafah-api/',
  hafbe: '/hafbe-api/',
  hivemind: '/hivemind-api/',
  hivesense: '/hivesense-api/',
  reputation: '/reputation-api/',
  'nft-tracker': '/nft-tracker-api/',
  hafsql: '/hafsql/openapi.json',
  status: '/status-api/'
}

const generateAPITypes = async (url = 'https://rpc.mahdiyari.info') => {
  for (const method of Object.keys(apiMethods)) {
    try {
      const response = await fetch(new URL(url + apiMethods[method]))
      let schema = (await response.json()) as any

      // ONLY fix hafbe's specific problematic ref
      if (method === 'hafbe') {
        // Simple JSON string replace for the exact problematic ref
        const schemaStr = JSON.stringify(schema, null, 2)
        const fixedStr = schemaStr.replace(
          '"$ref": "#/components/schemas/hafah_backend.operation_body"',
          '"$ref": "#/components/schemas/unknown_operation"'
        )
        // Add unknown_operation schema to components.schemas
        schema = JSON.parse(fixedStr)
        if (!schema.components?.schemas) schema.components.schemas = {}
        schema.components.schemas.unknown_operation = { type: 'unknown' }
      }

      const ast = await openapiTS(schema)
      const contents = astToString(ast)
      const filePath = join(dirname(new URL(import.meta.url).pathname), `./types/${method}.ts`)
      fs.writeFileSync(filePath, contents)
      console.log(`✅ Generated ${method}.ts`)
    } catch (e) {
      console.log(`❌ Failed for ${method}:`, e)
    }
  }
}

generateAPITypes()
