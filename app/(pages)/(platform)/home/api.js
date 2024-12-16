import { axiosInstance } from "@/app/utils/axios-instance";
import { readCookie } from "@/app/utils/cookie";
import { saveOrganizationData } from "@/app/(pages)/auth/auth";

export async function getCountWash() {
	try {
		await saveOrganizationData();
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/transactions?per_page=999`,
		);

		if (res.status === 200) {
			let spent = 0;
			const currentDate = new Date();
			const currentMonth = currentDate.getMonth() + 1;

			const uniqueWash = {};

			if (res.data.models) {
				res.data.models.forEach(item => {
					const operationDate = new Date(item.operation_time);

					if (operationDate.getMonth() + 1 === currentMonth) {
						uniqueWash[item.wash.id] = true;
					}
				});
			}

			return Object.keys(uniqueWash).length;
		}
		console.error("getMoneySpent:", res.status);
		return false;
	} catch (error) {
		console.error("getMoneySpent:", error);
		return false;
	}
}

export async function getMoneySpent() {
	try {
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/transactions?per_page=999`,
		);

		if (res.status === 200) {
			let spent = 0;

			if (res.data.models) {
				res.data.models.forEach(item => {
					if (item.type === "waste") spent += parseFloat(item.value);
				});
			}

			return spent;
		}
		console.error("getMoneySpent:", res.status);
		return false;
	} catch (error) {
		console.error("getMoneySpent:", error);
		return false;
	}
}

export async function getDataLineChart() {
	try {
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/transactions?per_page=999`,
		);

		if (res.status === 200) {
			if (res.data.models) {
				const data = {};

				for (const item of res.data.models) {
					const { created_at, value, type } = item;

					const key = created_at.substring(0, 10); // Extract date only (YYYY-MM-DD)

					if (!data[key]) {
						data[key] = { date: key, value: 0 };
					}

					data[key].value += type === "waste" ? +value : 0;
				}

				return Object.values(data);
			}
		}

		console.error("getDataLineChart", res.status);
		return false;
	} catch (error) {
		console.error("getDataLineChart:", error);
		return false;
	}
}

export async function getTransactionsMonth(
	month = (() => {
		const currentDate = new Date();
		return currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1);
	})(),
) {
	try {
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie(
				"organization_id",
			)}/transactions/month?month=${month}`,
		);

		if (res.status === 200) {
			const data = {};
			if (res.data) {
				console.log("getTransactionsMonth", res.data);
				for (const key in res.data) {
					data[key] = {};
					data[key].day = new Date(key).getDate();
					data[key].value = res.data[key];
				}
				console.log("getTransactionsMonth res", data);
				return Object.values(data);
			}
		}

		console.error("getDataLineChart", res.status);
		return false;
	} catch (error) {
		console.error("getDataLineChart:", error);
		return false;
	}
}
