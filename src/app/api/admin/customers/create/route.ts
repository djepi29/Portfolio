import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { createAdminCustomer } from '@/lib/admin-actions'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      phone?: string
    }
    const customer = await createAdminCustomer(body)
    return NextResponse.json({ customer })
  } catch (err) {
    console.error('[admin/customers/create]', err)
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Could not create customer.',
      },
      { status: 400 }
    )
  }
}
