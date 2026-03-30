"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

function SuccessContent() {
  const searchParams = useSearchParams()
  const ticketNumber = searchParams.get('ticket')
  const seminarType = searchParams.get('type')
  const title = searchParams.get('title')
  const location = searchParams.get('location')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const fullName = searchParams.get('fullName')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center pb-3">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <img 
              src="/images/Xirfadhub PNG-01 (1).png" 
              alt="Logo" 
              className="h-40 w-40 object-contain"
            />
          </div>

          {/* Success Message */}
          <CardTitle className="text-xl font-bold text-blue-600 mb-1">Guul! Hambalyo!</CardTitle>
          <p className="text-sm text-gray-700">
            Waxaad iska diiwaangalisay: <span className="font-semibold text-blue-600">{title}</span>
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          {/* Ticket Number */}
          <div>
            <p className="text-gray-700 text-sm mb-1">Lambarka Tikadhkaaga</p>
            <p className="text-blue-600 text-4xl font-bold">{ticketNumber}</p>
          </div>

          {/* Student & Course Info */}
          <div className="text-sm space-y-1">
            <p className="text-gray-700">
              <span className="font-semibold">Magaca:</span> {fullName}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Nooca:</span> {seminarType}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Meesha:</span> {location}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Taariikhda:</span>{" "}
              {startDate && endDate && (
                <>
                  {format(new Date(startDate), "MMM dd")} - {format(new Date(endDate), "MMM dd, yyyy")}
                </>
              )}
            </p>
          </div>

          {/* Screenshot Reminder */}
          <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-2 mt-3">
            <p className="text-lg">📸</p>
            <p className="font-bold text-yellow-900 text-xs">Muhiim!</p>
            <p className="text-yellow-800 text-xs">
              Fadlan sawir qaado boggan oo kaydi!
            </p>
          </div>

          {/* Thank you */}
          <p className="text-gray-600 text-xs pt-1">
            Mahadsanid diiwaangelintaada. Waxaan ku sugaynaa koorsada.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
