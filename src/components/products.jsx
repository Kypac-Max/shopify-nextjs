"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

async function shopifyFetch({ query, variables }) {
	const endpoint = "https://test-store-pablo.myshopify.com";
	const key = "2be97a9fcf9a7bdf77d923608f3a10ba";
	const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2024-07/graphql.json";

	try {
		const result = await fetch(
			`${endpoint}${SHOPIFY_GRAPHQL_API_ENDPOINT}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Shopify-Storefront-Access-Token": key,
				},
				body:
					{ query, variables } &&
					JSON.stringify({ query, variables }),
			}
		);
		return {
			status: result.status,
			body: await result.json(),
		};
	} catch (error) {
		console.error("Error:", error);
		return {
			status: 500,
			error: "Error receiving data",
		};
	}
}

export function Products() {
	const [products, setProducts] = useState(null);
	const [afterCursor, setAfterCursor] = useState(null);
	const [beforeCursor, setBeforeCursor] = useState(null);
	const [isFirstFetch, setIsFirstFetch] = useState(true);

	function updateCursor(position) {
		if (position === "before") {
			setAfterCursor(null);
			setBeforeCursor(products.pageInfo.startCursor);
		} else if (position === "after") {
			setBeforeCursor(null);
			setAfterCursor(products.pageInfo.endCursor);
		}
	}

	async function fetchProducts() {
		const isPaginatingBackwards = beforeCursor !== null;

		const positionQuery = isPaginatingBackwards
			? "before: $cursor"
			: "after: $cursor";
		const positionProduct = isPaginatingBackwards ? "last" : "first";
		const cursor = isPaginatingBackwards ? beforeCursor : afterCursor;
		const res = await shopifyFetch({
			query: `
        query ($numProducts: Int!, $cursor: String) {
          products(${positionProduct}: $numProducts, ${positionQuery}, sortKey: TITLE) {
            edges {
              cursor
              node {
                id
                title
                priceRange {
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  nodes {
                    id
                    height
                    altText
                    width
                    url
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
              hasPreviousPage
              startCursor
            }
          }
        }
      `,
			variables: {
				numProducts: 5,
				cursor,
			},
		});

		let fetchedProducts = res.body.data.products;
		if (!fetchedProducts.pageInfo.hasPreviousPage) {
			fetchedProducts = {
				...fetchedProducts,
				edges: fetchedProducts.edges.slice(1),
			};
		}
		setProducts(fetchedProducts);
	}

	useEffect(() => {
		fetchProducts();
	}, [afterCursor, beforeCursor]);

	if (products === null) return <h2>Loading...</h2>;

	return (
		<>
			<div className="grid lg:max-w-5xl lg:w-full lg:grid-cols-4 gap-x-[10px] gap-y-[49px] sm:grid-cols-2 sm:gap-y-6">
				{products.edges.map((product, index) => (
					<div
						key={`${product.node.id}-${index}`}
						className="rounded-[20px] px-[15px] pt-[13px] bg-white my-0 mx-auto shadow-product-cards"
					>
						<div className="h-[255px] w-[193px] relative">
							{product.node.images.nodes.map((image) => (
								<>
									<Image
										key={image.id}
										src={image.url}
										alt={image.altText || product.title}
										fill={true}
										priority
									/>
								</>
							))}
						</div>
						<div className="flex justify-between items-center mt-[12px] mb-[13px] text-[16px] font-normal font-[Inter] leading-[40px]">
							<div className="flex gap-x-[1px] text-black">
								<span>
									{
										product.node.priceRange.maxVariantPrice
											.currencyCode
									}
								</span>
								<span>
									{
										product.node.priceRange.maxVariantPrice
											.amount
									}
								</span>
							</div>
							<Link
								href="/"
								className="bg-green-button pt-[7px] pb-[9px] pl-[10px] pr-[11px] rounded-xl h-[26px] flex items-center"
							>
								BUY NOW
							</Link>
						</div>
					</div>
				))}
			</div>
			<div className="flex gap-[6px] pt-[19px] pb-[15px] px-16px">
				<button
					onClick={() => updateCursor("before")}
					className={`pt-[7px] pr-3 pb-2 pl-[13px] rounded-[99px] ${
						products.pageInfo.hasPreviousPage
							? "bg-green-nextButton text-white"
							: "bg-white text-green-nextButton cursor-not-allowed border border-green-nextButton"
					}`}
					disabled={!products.pageInfo.hasPreviousPage}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="rotate-180"
					>
						<path
							d="M0 7H12.17L6.58 1.41L8 0L16 8L8 16L6.59 14.59L12.17 9H0V7Z"
							fill="currentColor"
						/>
					</svg>
				</button>
				<button
					onClick={() => updateCursor("after")}
					className={`pt-[7px] pr-3 pb-2 pl-[13px] rounded-[99px] ${
						products.pageInfo.hasNextPage
							? "bg-green-nextButton text-white"
							: "bg-white text-green-nextButton cursor-not-allowed border border-green-nextButton"
					}`}
					disabled={!products.pageInfo.hasNextPage}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0 7H12.17L6.58 1.41L8 0L16 8L8 16L6.59 14.59L12.17 9H0V7Z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</div>
		</>
	);
}
