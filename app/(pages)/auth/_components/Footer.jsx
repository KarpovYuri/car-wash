"use client";

import clsx from "clsx";
import Link from "next/link";

export default function Footer({ textColor }) {
	return (
		<footer
			className={clsx(
				"px-10 pb-3 flex md:flex-col-reverse items-center justify-between absolute md:static md:py-8 bottom-0 left-0 right-0",
				{
					"text-white": textColor === "white",
					"text-black/40": textColor === "black",
				},
				"max-[800px]:flex-col-reverse max-[800px]:gap-4",
			)}>
			<p>© Car Wash Priority {new Date().getFullYear()}</p>
			<div className="flex md:flex-col items-center gap-12 max-[800px]:flex-col md:gap-2">
				<a className={"hover:opacity-75 text-white"} href="mailto:info@carwashpriority.ru">
					Поддержка
				</a>
				<a className={"hover:opacity-75"} href="/political-policy">
					Политика конфиденциальности
				</a>
				<Link className={"hover:opacity-75 text-white"} href="/service-rules">
					Правила предоставления услуг
				</Link>
			</div>
		</footer>
	);
}
