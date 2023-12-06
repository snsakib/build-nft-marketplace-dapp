"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col min-[825px]:flex-row justify-between py-5 px-10 border-b-2 border-black">
      {/* Logo and site title section */}
      <div className="flex flex-row items-center mb-5 md:lg-0 md:mr-5">
        <Image src="/logo.svg" width={40} height={40} alt="Logo" />
        <h1 className="ml-5 text-xl font-bold min-[500px]:text-2xl text-black">
          NFT Marketplace
        </h1>
      </div>

      {/* Navigation links section */}
      <div className="flex flex-col items-center max-[900px]:flex-1 min-[500px]:flex-row min-[500px]:justify-between md:text-xl">
        <div className="flex justify-between flex-1 text-md font-bold text-black">
          <Link href="/" className="min-[900px]:px-3">
            Home
          </Link>
          <Link href="/mint-nft" className="min-[900px]:px-3">
            Mint NFT
          </Link>
          <Link href="/my-nft" className="min-[900px]:px-3">
            My NFT
          </Link>
        </div>
      </div>
    </header>
  );
}
