import { NextResponse } from 'next/server'
import { listVapiPhoneNumbers } from '@/lib/vapi'

export async function GET() {
  if (!process.env.VAPI_API_KEY) {
    return NextResponse.json({ error: 'VAPI_API_KEY is not configured' }, { status: 500 })
  }

  try {
    const numbers = await listVapiPhoneNumbers()
    return NextResponse.json(numbers)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
