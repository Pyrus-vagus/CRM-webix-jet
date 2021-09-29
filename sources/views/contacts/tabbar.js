import {JetView} from "webix-jet";
import ActivityView from "../activities";

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
					header: "Files"
				}
			]
		};

		return tab;
	}
}
