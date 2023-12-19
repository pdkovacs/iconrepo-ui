import { ActionType, createAction } from "typesafe-actions";
import { Config, fetchConfig } from "../../services/config";
import { getData } from "../../services/fetch-utils";
import { fetchUserInfo, UserInfo } from "../../services/user";
import { AppThunk } from "./base";
import { BackendAccess } from "../reducers/app-reducer";
import { HttpError } from "../../services/errors";
import { computeBaseUrl } from "../../services/url";

export const loginNeeded = createAction("app/prompt-for-login")<boolean>();

export const fetchConfigSuccess = createAction("app/fetch-config-success")<Config>();
export const fetchConfigFailure = createAction("app/fetch-config-failure")<Error>();
export const fetchConfigAction: () => AppThunk = ()  => {
	return dispatch => {
		return fetchConfig()
		.then(
			config => dispatch(fetchConfigSuccess(config)),
			error => dispatch(fetchConfigFailure(error))
		);
	};
};

export type ConfigAction = (
	ActionType<typeof fetchConfigAction> |
	ActionType<typeof fetchConfigSuccess> |
	ActionType<typeof fetchConfigFailure>
)

export interface DeployConfig {
	readonly backendAccess: BackendAccess;
}
export const fetchDeploymentConfigSuccess = createAction("app/fetch-deployment-config-success")<DeployConfig>();
export const fetchDeploymentConfigFailure = createAction("app/fetch-deployment-config-failure")<String>();
export const fetchDeploymentConfigAction: () => AppThunk = ()  => {
	return dispatch => {
		getData("!/extra/client-config.json", 200)
		.then(
			(deployConfig: DeployConfig) => {
				dispatch(fetchDeploymentConfigSuccess(deployConfig))
			},
			error => {
				console.info(error);
				const httpError = error as HttpError;
				if (httpError.getHttpStatus() === 404) {
					dispatch(fetchDeploymentConfigSuccess({
						backendAccess: {
							baseUrl: computeBaseUrl(),
							pathRoot: ""
						}
					}))
					return;
				}
				dispatch(fetchDeploymentConfigFailure(error.message));
			}
		);
	};
};

export const fetchUserInfoSuccess = createAction("app/fetch-userinfo-success")<UserInfo>();
export const fetchUserInfoFailure = createAction("app/fetch-userinfo-failure")<Error>();
export const fetchUserInfoAction: () => AppThunk = ()  => {
	return dispatch => {
		return fetchUserInfo()
		.then(
			userInfo => dispatch(fetchUserInfoSuccess(userInfo)),
			error => dispatch(fetchUserInfoFailure(error))
		);
	};
};

export type UserInfoAction = (
	ActionType<typeof loginNeeded> |
	ActionType<typeof fetchUserInfoAction> |
	ActionType<typeof fetchUserInfoSuccess> |
	ActionType<typeof fetchUserInfoFailure>
)
