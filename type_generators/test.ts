// To generate types to be used for api calls using call() method from openapi specs
// Currently some specs are wrong so just testing

import * as fs from 'fs/promises'

async function generateMethodParams(schemaUrl: string): Promise<string> {
  const res = await fetch(schemaUrl)
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  const schema = await res.json()

  function resolveRef(ref: string): any {
    const parts = ref.replace(/^#\//, '').split('/')
    return parts.reduce((obj: any, part: string) => obj?.[part], schema)
  }

  function schemaToTsType(schema: any, visited = new Set()): string {
    if (!schema || visited.has(schema)) return 'unknown'
    visited.add(schema)

    if (schema.$ref) return schemaToTsType(resolveRef(schema.$ref), visited)

    if (schema.oneOf || schema.anyOf) {
      const types = (schema.oneOf || schema.anyOf || []).map((s: any) => schemaToTsType(s, visited))
      return types.join(' | ')
    }

    if (schema.enum) {
      return schema.enum.map((v: any) => JSON.stringify(v)).join(' | ')
    }

    if (schema.type === 'array') {
      if (!schema.items) return schema.example?.length === 0 ? '[]' : 'unknown[]'
      const itemType = schemaToTsType(schema.items, visited)

      if (schema.minItems === schema.maxItems && schema.minItems > 0) {
        // fixed length tuple with repeated itemType
        return `[${Array(schema.minItems).fill(itemType).join(', ')}]`
      }

      const arrayType =
        itemType.includes('|') || itemType.includes('[') ? `(${itemType})[]` : `${itemType}[]`
      return arrayType
    }

    switch (schema.type) {
      case 'string':
        return 'string'
      case 'number':
      case 'integer':
      case 'hive_int':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'null':
        return 'null'
      case 'object':
        return '{}'
      default:
        return 'unknown'
    }
  }

  const unions: string[] = []

  for (const [methodName, pathData] of Object.entries(schema.paths || {})) {
    const post = (pathData as any).post
    if (!post?.requestBody?.content?.['application/json']?.schema) {
      unions.push(`['${methodName}', []]`)
      continue
    }

    const reqSchema = post.requestBody.content['application/json'].schema
    const paramSchema = reqSchema.$ref ? resolveRef(reqSchema.$ref) : reqSchema

    let paramsType: string

    if (paramSchema.type === 'array') {
      // ARRAY PARAMS: [string[][]] or [number, string, string]
      paramsType = schemaToTsType(paramSchema)
    } else if (paramSchema.properties && Object.keys(paramSchema.properties).length > 0) {
      // OBJECT PARAMS: { accounts: string[]; delayed_votes_active?: boolean }
      const props = Object.entries(paramSchema.properties)
        .map(([key, propSchema]: [string, any]) => {
          const tsType = schemaToTsType(propSchema)
          const required = paramSchema.required?.includes(key) ? '' : '?'
          return `${key}${required}: ${tsType}`
        })
        .join('; ')

      paramsType = `{ ${props} }`
    } else {
      paramsType = '[]'
    }

    unions.push(`['${methodName}', ${paramsType}]`)
  }

  return `type MethodParams =\n  | ${unions.join('\n  | ')};`
}

;(async () => {
  try {
    const types = await generateMethodParams('https://rpc.mahdiyari.info/hived-api/')
    await fs.writeFile('method-params.d.ts', types)
    console.log('✅ Fixed: Objects no longer wrapped in arrays')
    console.log(types.slice(0, 1000) + '\n...')
  } catch (e) {
    console.error('Error:', e)
  }
})()
