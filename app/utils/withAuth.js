import { useRouter } from "next/router";
import { useEffect } from "react";
import { readCookie } from "@/app/utils/cookie";
import { redirect } from "next/navigation";

const withAuth = WrappedComponent => {
	return props => {
		useEffect(() => {
			const bearer_token = readCookie("bearer_token");
			let isAuthenticated = false;

			if (bearer_token) {
				isAuthenticated = true;
			}

			if (!isAuthenticated) {
				redirect("/auth");
			}
		}, []);
		return <WrappedComponent {...props} />;
	};
};

export default withAuth;
