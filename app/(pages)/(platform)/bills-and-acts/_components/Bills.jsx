import Table from "@/app/(pages)/(platform)/bills-and-acts/_components/Table";

export default function Bills({ data }) {
	return (
		<Table
			head={[
				{
					title: "Название",
				},
				{
					title: "Дата",
					canBeSorted: true,
				},
				{
					title: "Статус",
				},
				{
					title: "Скачать",
				},
			]}
			content={data}
			type={"bills"}
		/>
	);
}
