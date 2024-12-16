import { axiosInstance } from "@/app/utils/axios-instance";
import { readCookie } from "@/app/utils/cookie";
import { saveOrganizationData } from "@/app/(pages)/auth/auth";

export async function getInvoices(page = 1) {
	try {
		await saveOrganizationData();
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/invoices?page=${page}`,
		);

		if (res.status === 200) {
			return res.data;
		}
		console.error("Ошибка при получении invoices:", res.status);
		return false;
	} catch (error) {
		console.error("Ошибка при получении invoices:", error);
		return false;
	}
}

export async function getActs(page = 1) {
	try {
		await saveOrganizationData();
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/acts?page=${page}`,
		);

		if (res.status === 200) {
			return res.data;
		}
		console.error("Ошибка при получении invoices:", res.status);
		return false;
	} catch (error) {
		console.error("Ошибка при получении invoices:", error);
		return false;
	}
}

export async function getInvoicesFile(id, uuid) {
	try {
		await saveOrganizationData();
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie(
				"organization_id",
			)}/invoices/get-pdf?id=${id}&uuid=${uuid}`,
		);

		if (res.status === 200) {
			const pdfBlob = new Blob([pdfData], { type: "application/pdf" });
			console.log("pdfBlob", pdfBlob);
			console.log("URL.createObjectURL(pdfBlob)", URL.createObjectURL(pdfBlob));

			return URL.createObjectURL(pdfBlob);
		}
		console.error("Ошибка при получении invoices:", res.status);
		return false;
	} catch (error) {
		console.error("Ошибка при получении invoices:", error);
		return false;
	}
}
