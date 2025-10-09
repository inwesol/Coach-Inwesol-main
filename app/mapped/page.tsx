"use client"
import React, { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

type Mapping = {
  mapping_id: string
  user_id: string
  person_id: string
  coach_email: string
  person_data: any
  mapped_at: string
}

export default function MappedPage() {
  const { isLoaded } = useUser()
  const [mappings, setMappings] = useState<Mapping[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    setLoading(true)
    fetch("/api/mappings")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || res.statusText)
        return res.json()
      })
      .then((data: Mapping[]) => {
        setMappings(data)
        setError(null)
      })
      .catch((err) => {
        console.error("Fetch mappings error:", err)
        setError(String(err))
      })
      .finally(() => setLoading(false))
  }, [isLoaded])

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Mapped People</h1>

      {loading && <div className="text-gray-500">Loading mappings…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {!loading && mappings.length === 0 && <div className="text-gray-600">No mappings found for your email.</div>}

      <div className="grid gap-4 mt-4">
        {mappings.map((m) => (
          <div key={m.mapping_id} className="border rounded p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm text-gray-500">Person ID</div>
                <div className="font-mono text-sm">{m.person_id}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Mapped at</div>
                <div className="text-sm">{new Date(m.mapped_at).toLocaleString()}</div>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-1">User ID</div>
            <div className="font-mono text-sm mb-3">{m.user_id}</div>

            <div className="text-sm text-gray-500 mb-1">Person Data</div>
            <div className="bg-gray-50 p-3 rounded text-xs overflow-auto">
              <pre className="whitespace-pre-wrap">{JSON.stringify(m.person_data, null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}