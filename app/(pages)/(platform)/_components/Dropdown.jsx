import React, { useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

export default function DropdownUI({
	text,
	list,
	buttonClassName,
	menuClassName,
	itemClassName,
	callback,
	defaultValue,
}) {
	const [selectedKeys, setSelectedKeys] = React.useState(new Set([defaultValue ? defaultValue.text : text]));

	const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(", ").replaceAll("_", " "), [selectedKeys]);

	useEffect(() => {
		callback(selectedValue);
	}, [selectedKeys]);

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button variant="bordered" className={buttonClassName}>
					{selectedValue}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Single selection example"
				variant="flat"
				disallowEmptySelection
				selectionMode="single"
				selectedKeys={selectedKeys}
				onSelectionChange={setSelectedKeys}
				className={menuClassName}>
				{list.map(item => (
					<DropdownItem key={item.text} className={itemClassName}>
						{item.text}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}
