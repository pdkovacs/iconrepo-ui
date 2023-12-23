import { ActionType, getType } from "typesafe-actions";
import { AppInfo } from "../../services/config";
import { UserInfo } from "../../services/user";
import { fetchConfigSuccess, ConfigAction, UserInfoAction, fetchUserInfoSuccess, loginNeeded, fetchDeploymentConfigSuccess } from "../actions/app-actions";

export interface BackendAccess {
	readonly baseUrl: string;
	readonly pathRoot: string;
}

export interface AppSlice {
	readonly appInfo: AppInfo;
	readonly userInfo: UserInfo;
	readonly idPLogoutUrl: string;
	readonly backendAccess: BackendAccess;
}

const initialState: AppSlice = {
	appInfo: {
		versionInfo: {
			version: "No data",
			commit: "No data",
			buildTime: "No data"
		},
		appDescription: "No data"
	},
	userInfo: {
		permissions: [],
		username: "John Doe",
		authenticated: false
	},
	idPLogoutUrl: "/",
	backendAccess: {
		baseUrl: null,
		pathRoot: null
	}
};

export const appReducer = (state: AppSlice = initialState, action: ActionType<typeof fetchDeploymentConfigSuccess> | ConfigAction | UserInfoAction): AppSlice => {
	switch(action.type) {
		case getType(fetchDeploymentConfigSuccess): {
			return {
				...state,
				backendAccess: action.payload.backendAccess
			};
		}
		case getType(loginNeeded): {
			return {
				...state,
				userInfo: loginNeeded
					? {
							...state.userInfo,
							authenticated: false
						}
					: state.userInfo,
			};
		}
		case getType(fetchConfigSuccess): {
			return {
				...state,
				appInfo: action.payload.appInfo,
				idPLogoutUrl: action.payload.clientConfig.idPLogoutUrl
			};
		}
		case getType(fetchUserInfoSuccess): {
			return {
				...state,
				userInfo: action.payload
			};
		}
		default: {
			return state;
		}
	}
};
