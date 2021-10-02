import {JetView} from "webix-jet";
import ActivityView from "../activities";
import FilesView from "./files";

export default class TableContacts extends JetView {
	config() {
		const tab = {
			view: "tabview",
			cells: [
				{
					header: "Activities",
					body: new ActivityView(this.app, "contact")
				},
				{
					header: "Files",
					body: FilesView
				}
			]
		};
		return tab;
	}
}
