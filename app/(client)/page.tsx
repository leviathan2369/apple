"use client"
import Header from '../components/Header'
import Landing from '../components/Landing'
import { Tab } from "@headlessui/react";
import { GetServerSideProps } from 'next'
import { fetchCategories } from '@/utils/fetchCategorie';
import { fetchProducts } from '@/utils/fetchProducts';
import Product from '../components/Product';
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

interface Props {
  categories: Category[];
  products: Product[];
  session: Session | null;
}

export default function Home({ categories, products }: Props) {

  const showProducts = (category: number) => {
    if (!categories || categories.length <= category) {
      // Handle the case where categories is undefined or does not have an item at the specified index
      return <p>No products found.</p>;
    }

    const filteredProducts = products.filter(
      (product) =>
        product.category && product.category._ref === categories[category]._id
    );

    if (filteredProducts.length === 0) {
      // Handle the case where no products are found for the specified category
      return <p>No products found for this category.</p>;
    }

    return filteredProducts.map((product) => (
      <Product product={product} key={product._id} />
    ));
  };
  return (

      <div className=''>
      <Header /> <main className="relative h-[200vh] bg-[#E7ECEE]"><Landing /></main>
      <section className="relative z-40 -mt-[100vh] min-h-screen bg-[#1B1B1B]">
      <div className="space-y-10 py-16"> <h1 className="text-center text-4xl font-medium tracking-wide text-white md:text-5xl">
            New Promos
          </h1> <Tab.Group>
           <Tab.List className="flex justify-center">
           {categories && categories.length > 0 && categories.map((category) => (
  <Tab
    key={category._id}
    id={category._id}
    className={({ selected }) =>
      `whitespace-nowrap rounded-t-lg py-3 px-5 text-sm font-light outline-none md:py-4 md:px-6 md:text-base ${
      selected
        ? "borderGradient bg-[#35383C] text-white"
        : "border-b-2 border-[#35383C] text-[#747474]"
      }`
    }
  >
    {category.title}
  </Tab>
))}
            </Tab.List>
            <Tab.Panels className="mx-auto max-w-fit pt-10 pb-24 sm:px-4">
               <Tab.Panel className="tabPanel">{showProducts(0)}</Tab.Panel>
              <Tab.Panel className="tabPanel">{showProducts(1)}</Tab.Panel>
              <Tab.Panel className="tabPanel">{showProducts(2)}</Tab.Panel>
              <Tab.Panel className="tabPanel">{showProducts(3)}</Tab.Panel>
              </Tab.Panels>
          </Tab.Group></div></section>
      </div>
  )
}

// Backend Code
export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  const categories = await fetchCategories();
  const products = await fetchProducts();
  const session = await getSession(context);

  return {
    props: {
      categories,
      products,
      session,
    },
  };
};
