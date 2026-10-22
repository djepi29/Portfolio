'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import type {
  AdminPaymentLinkRow,
  AdminProductRow,
} from '@/lib/admin-types'

export default function AdminCatalog() {
  const [products, setProducts] = useState<AdminProductRow[] | null>(null)
  const [links, setLinks] = useState<AdminPaymentLinkRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [amountDollars, setAmountDollars] = useState('')
  const [priceId, setPriceId] = useState('')

  const load = useCallback(async () => {
    setError(null)
    try {
      const [pRes, lRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/payment-links'),
      ])
      const pJson = (await pRes.json()) as {
        error?: string
        products?: AdminProductRow[]
      }
      const lJson = (await lRes.json()) as {
        error?: string
        paymentLinks?: AdminPaymentLinkRow[]
      }
      if (!pRes.ok) throw new Error(pJson.error ?? 'Products failed')
      if (!lRes.ok) throw new Error(lJson.error ?? 'Payment links failed')
      setProducts(pJson.products ?? [])
      setLinks(lJson.paymentLinks ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load catalog.')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function createProduct(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          amountCents: Math.round(parseFloat(amountDollars) * 100),
          currency: 'cad',
        }),
      })
      const json = (await res.json()) as {
        error?: string
        product?: AdminProductRow
      }
      if (!res.ok) {
        setError(json.error ?? 'Create product failed.')
        return
      }
      setNotice(
        `Product created${json.product?.defaultPriceId ? ` · price ${json.product.defaultPriceId}` : ''}`
      )
      if (json.product?.defaultPriceId) setPriceId(json.product.defaultPriceId)
      setName('')
      setDescription('')
      setAmountDollars('')
      await load()
    } catch {
      setError('Network error.')
    } finally {
      setBusy(false)
    }
  }

  async function createLink(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch('/api/admin/payment-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const json = (await res.json()) as {
        error?: string
        paymentLink?: AdminPaymentLinkRow
      }
      if (!res.ok) {
        setError(json.error ?? 'Create payment link failed.')
        return
      }
      setNotice(
        json.paymentLink?.url
          ? `Payment link ready: ${json.paymentLink.url}`
          : 'Payment link created.'
      )
      await load()
    } catch {
      setError('Network error.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Catalog</h2>
          <p className="text-xs text-white/40">
            Products, prices, and Payment Links (Phase 5 lite).
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:text-white"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 break-all">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={createProduct}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3"
        >
          <h3 className="text-sm font-semibold">New product + price</h3>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm"
            placeholder="Price CAD (e.g. 1500.00)"
            value={amountDollars}
            onChange={(e) => setAmountDollars(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#e31e24] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Create product
          </button>
        </form>

        <form
          onSubmit={createLink}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3"
        >
          <h3 className="text-sm font-semibold">New payment link</h3>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm"
            placeholder="price_…"
            value={priceId}
            onChange={(e) => setPriceId(e.target.value)}
            required
          />
          <p className="text-[11px] text-white/40">
            Use a price ID from a product above (or Stripe Dashboard).
          </p>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#e31e24] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Create payment link
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Products</h3>
          {!products ? (
            <p className="text-sm text-white/40">Loading…</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-white/40">No products yet.</p>
          ) : (
            <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start justify-between gap-3 bg-white/[0.02] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-xs text-white/45">
                      {p.defaultPriceFormatted ?? 'No default price'}
                      {p.defaultPriceId ? ` · ${p.defaultPriceId}` : ''}
                    </p>
                  </div>
                  <a
                    href={p.dashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/45 hover:underline"
                  >
                    Stripe ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Payment links</h3>
          {!links ? (
            <p className="text-sm text-white/40">Loading…</p>
          ) : links.length === 0 ? (
            <p className="text-sm text-white/40">No payment links yet.</p>
          ) : (
            <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
              {links.map((l) => (
                <li
                  key={l.id}
                  className="flex items-start justify-between gap-3 bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white/90">
                      {l.url ?? l.id}
                    </p>
                    <p className="text-xs text-white/40">
                      {l.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {l.url ? (
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#ffb4b7] hover:underline"
                      >
                        Open
                      </a>
                    ) : null}
                    <a
                      href={l.dashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/45 hover:underline"
                    >
                      Stripe ↗
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
