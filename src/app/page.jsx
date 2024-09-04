import { Products } from "../components/products.jsx";

export default async function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24 gap-y-[26px]">
			<h2 className="text-green-title text-[34px] font-bold font-[Inter] leading-[40px]">
				Featured Collection
			</h2>
			<Products />
		</main>
	);
}
