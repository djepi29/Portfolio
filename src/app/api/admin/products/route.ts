import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { createAdminProduct, listAdminProducts } from '@/lib/admin-catalog'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const products = await listAdminProducts()
    return NextResponse.json({ products })
  } catch (err) {
    console.error('[admin/products GET]', err)
    return NextResponse.json(
      { error: 'Could not load products.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      name?: string
      description?: string
      amountCents?: number
      currency?: string
    }
    if (!body.name || body.amountCents == null) {
      return NextResponse.json(
        { error: 'name and amountCents are required.' },
        { status: 400 }
      )
    }
    const product = await createAdminProduct({
      name: body.name,
      description: body.description,
      amountCents: body.amountCents,
      currency: body.currency,
    })
    return NextResponse.json({ product })
  } catch (err) {
    console.error('[admin/products POST]', err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Could not create product.',
      },
      { status: 400 }
    )
  }
}
