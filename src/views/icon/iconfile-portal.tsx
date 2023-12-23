import * as React from "react";
import { SelectFileToUpload } from "./select-file-to-upload";
import { ingestIconfile, createIcon, IngestedIconfileDTO } from "../../services/icon";

import "./iconfile-portal.styl";

interface IconfilePortalProps {
	iconName: string;
	imageUrl: string;
	handleFileUpload: (uploadedFile: IngestedIconfileDTO) => void;
	handleError: (error: Error) => void;
}

const uploadIconfile = async (file: File, props: IconfilePortalProps) => {
	try {
		const fileName = file.name;
		const formData = new FormData();
		formData.append("iconfile", file, fileName);

		let iconfileDTO: IngestedIconfileDTO;
		if (props.iconName) {
			formData.append("iconName", props.iconName);
			iconfileDTO = await ingestIconfile(props.iconName, formData);
			iconfileDTO.iconName = props.iconName;
		} else {
			formData.append("iconName", fileName.replace(/(.*)\.[^.]*$/, "$1"));
			const response = await createIcon(formData);
			iconfileDTO = {
				iconName: response.name,
				format: response.paths[0].format,
				size: response.paths[0].size,
				path: response.paths[0].path
			};
		}

		props.handleFileUpload(iconfileDTO);
	} catch (err) {
		console.error(err);
		props.handleError(err);
	}
};

const hasImageUrl = (props: IconfilePortalProps) => typeof props.imageUrl !== "undefined";
const portContent = (props: IconfilePortalProps) =>
	hasImageUrl(props)
		? <img src={props.imageUrl} />
		: <SelectFileToUpload handleSelectedFile={file => uploadIconfile(file, props)} />;

export const IconfilePortal = (props: IconfilePortalProps) => {

	return <div className="iconfile-portal">
		{portContent(props)}
	</div>;
};
