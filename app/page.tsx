import Dropdown from '@/Components/Dropdown'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <h1 className='mt-[5vh] text-[35px] font-semibold text-blue-800'>Pick Users</h1>
      <Dropdown />
    </main>

  )
}
