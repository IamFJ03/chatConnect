"use client"

import Link from "next/link"

export default function Navbar(){
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <p className="text-xl md:text-2xl font-semibold">Dashboard</p>
        <div className="flex gap-6 text-sm md:text-lg">
          <Link href="/notification">Notifications</Link>
          <Link href="/contacts">Contacts</Link>
        </div>
      </div>
    )
}