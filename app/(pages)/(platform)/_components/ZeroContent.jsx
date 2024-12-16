import Image from "next/image";
import imgZeroContent from "@/public/img/pictures/zero-content.png";

export default function ZeroContent({ text }) {
	return (
		<div className={"flex-middle flex-col gap-4"}>
			<div
				className={"w-25 h-25 bg-[url('/img/pictures/zero-content.png')] bg-no-repeat bg-cover bg-center"}
				style={{ width: "100px", height: "100px" }}></div>
			{text && <p className={"text-black/40 text-center"}>{text}</p>}
		</div>
	);
}
