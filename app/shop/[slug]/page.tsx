import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Truck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getProduct, products, priceFrom } from '@/data/products';
import { getCategory } from '@/data/categories';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductPurchase } from '@/components/product/product-purchase';
import { ProductCard } from '@/components/shop/product-card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { SectionHeading } from '@/components/ui/section-heading';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { company } from '@/data/company';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) return {};
  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/shop/${product.slug}`,
    image: product.images[0],
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const category = getCategory(product.categorySlug);
  const related = products.filter((p) => p.id !== product.id && p.categorySlug !== product.categorySlug).slice(0, 4);
  const from = priceFrom(product);

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    ...(category ? [{ name: category.name, href: `/shop?category=${category.slug}` }] : []),
    { name: product.name, href: `/shop/${product.slug}` },
  ];

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => `${company.siteUrl}${i}`),
    brand: { '@type': 'Brand', name: company.legalName },
    ...(typeof from === 'number'
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'KES',
            lowPrice: from,
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: company.legalName },
          },
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />

      <section className="shell pb-28 pt-10 lg:pb-20">
        <Breadcrumb items={crumbs} />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <p className="eyebrow">{category?.name ?? product.categorySlug}</p>
            <h1 className="mt-3 text-display-md text-bone">{product.name}</h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-mute">{product.description}</p>

            <div className="mt-8">
              <ProductPurchase product={product} />
            </div>

            {product.todo ? (
              <p className="mt-6 flex gap-3 border border-warning/40 bg-warning/5 p-4 text-xs leading-relaxed text-warning">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  <strong className="font-display uppercase tracking-wide">To confirm — </strong>
                  {product.todo}
                </span>
              </p>
            ) : null}

            <div className="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
              <p className="flex gap-3 text-xs leading-relaxed text-mute">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>
                  Delivered on the Alexon fleet. Cost depends on your location, the quantity and the vehicle required — <Link href="/delivery" className="text-gold hover:underline">see delivery options</Link>.
                </span>
              </p>
              <p className="flex gap-3 text-xs leading-relaxed text-mute">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>Pressed and cured at our own yard in Ugunja, so what you order is what leaves the gate.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-2 lg:gap-16">
          {product.specifications || product.variants?.length ? (
            <div>
              <h2 className="eyebrow mb-5">Specifications</h2>
              <dl className="divide-y divide-line border-y border-line">
                {Object.entries(product.specifications ?? {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-6 py-3">
                    <dt className="text-sm text-mute">{key}</dt>
                    <dd className="text-right font-mono text-sm text-bone">{value}</dd>
                  </div>
                ))}
                {(product.variants ?? []).map((v) => (
                  <div key={v.id} className="flex justify-between gap-6 py-3">
                    <dt className="text-sm text-mute">{v.label}</dt>
                    <dd className="text-right font-mono text-sm text-bone">
                      {typeof v.price === 'number' ? `KES ${v.price.toLocaleString('en-KE')}` : 'On request'}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {product.applications?.length ? (
            <div>
              <h2 className="eyebrow mb-5">Where it is used</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.applications.map((app) => (
                  <li key={app} className="flex items-center gap-3 border border-line px-4 py-3 text-sm text-bone">
                    <span className="h-1 w-4 shrink-0 bg-gold" aria-hidden />
                    {app}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {related.length ? (
          <div className="mt-20">
            <SectionHeading eyebrow="Often ordered together" title="Complete the order" />
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
