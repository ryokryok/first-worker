/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  API_KEY: string
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/prefectures') {
      const result = await fetchApi(env.API_KEY)
      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=86400 immutable',
        },
      })
    }
    return new Response('This is root', { status: 200 })
  },
}

type PrefecturesResult = {
  message: string | null
  result: {
    prefCode: number
    prefName: string
  }[]
}

async function fetchApi(API_KEY: string): Promise<PrefecturesResult> {
  const res = await fetch(
    'https://opendata.resas-portal.go.jp/api/v1/prefectures',
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
    }
  )
  return res.json()
}
