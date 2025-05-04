import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import React from "react";
import ThemeToggle from "../components/ThemeToggle";

export const metadata: Metadata = {
  title: "Curated Product Catalog",
  description: "A curated catalog of affiliate products.",
};

function getProducts() {
  const filePath = path.join(process.cwd(), "public", "products.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

// Helper to fetch Open Graph data for a URL
async function fetchOpenGraphData(url: string) {
  try {
    const res = await fetch(url, { method: "GET" });
    const html = await res.text();
    const ogImage = html.match(/<meta property=\"og:image\" content=\"([^\"]+)\"/i)?.[1] || null;
    const ogTitle = html.match(/<meta property=\"og:title\" content=\"([^\"]+)\"/i)?.[1] || null;
    const ogDesc = html.match(/<meta property=\"og:description\" content=\"([^\"]+)\"/i)?.[1] || null;
    return { ogImage, ogTitle, ogDesc };
  } catch {
    return { ogImage: null, ogTitle: null, ogDesc: null };
  }
}

async function getProductsWithPreviews() {
  const products = getProducts();
  const previews = await Promise.all(
    products.map(async (product: any) => {
      const og = await fetchOpenGraphData(product.product_link);
      return {
        ...product,
        ogImage: og.ogImage,
        ogTitle: og.ogTitle,
        ogDesc: og.ogDesc,
      };
    })
  );
  return previews;
}

export default async function Home() {
  const products = await getProductsWithPreviews();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-6 sm:p-12 transition-colors duration-300">
      <ThemeToggle />
      <main className="w-full max-w-5xl">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product: any, idx: number) => {
            const imageSrc = product.image || product.ogImage || "https://placehold.co/400x300?text=No+Image";
            return (
              <a
                key={idx}
                href={product.product_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-[#18181b] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-shadow overflow-hidden group hover:-translate-y-1 transform duration-200"
              >
                <img
                  src={imageSrc}
                  alt={product.ogTitle || product.product_name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform bg-gray-100 dark:bg-gray-900"
                  loading="lazy"
                />
                <div className="p-6 flex flex-col justify-between h-full">
                  <h2 className="text-lg font-bold mb-2 text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {product.ogTitle || product.product_name}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 flex-1 text-sm">
                    {product.ogDesc || product.product_description}
                  </p>
                  <span className="inline-block mt-2 px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-center">
                    Shop Now
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </main>
      <footer className="mt-16 text-sm text-gray-400 text-center">
        &copy; {new Date().getFullYear()} Curated Catalog. Affiliate links may earn us a commission.
      </footer>
    </div>
  );
}
