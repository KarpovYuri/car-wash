export function formatPhoneNumber(number) {
	const cleanNumber = number.replace(/\D/g, "");

	if (cleanNumber.length !== 11) {
		console.error("Incorrect phone number format");
		return number;
	}

	return `+${cleanNumber.slice(0, 1)} (${cleanNumber.slice(1, 4)}) ${cleanNumber.slice(4, 7)}-${cleanNumber.slice(
		7,
		9,
	)}-${cleanNumber.slice(9)}`;
}

export function formatDate(dateString) {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${day}.${month}.${year} ${hours}:${minutes}`;
}
