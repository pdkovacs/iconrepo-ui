import store from "../state/store";

export default (path: string) => {
	const backendAccess = store.getState().app.backendAccess;
	const backendBaseUrl = backendAccess?.baseUrl || "";
	const backendPathRoot = backendAccess?.pathRoot || "";
	return backendBaseUrl + backendPathRoot + path;
};

export const computeBaseUrl = () => {
	const getUrl = window.location;
	const pathName = getUrl.pathname.endsWith("/")
    ? getUrl.pathname.substring(0, getUrl.pathname.length - 1)
    : getUrl.pathname;
	const baseUrl = getUrl.protocol + "//" + getUrl.host + pathName;
	return baseUrl;
}
