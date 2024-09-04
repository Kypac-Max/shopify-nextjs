/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				"green-title": "rgba(122, 166, 90, 0.58)",
				"green-nextButton": "rgba(122, 166, 90, 1)",
				"green-button": "#7AA65A",
			},
			boxShadow: {
				"product-cards": "8px 8px 16px #cccccc, -8px -8px 16px #ffffff",
			},
		},
	},
	plugins: [],
};
