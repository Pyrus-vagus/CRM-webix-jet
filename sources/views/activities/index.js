import {JetView} from "webix-jet";

import activities from "../../models/activities";
import activityType from "../../models/activitytype";
import contacts from "../../models/contacts";
import EditForm from "./form";
import "../../styles/view.css";

export default class ListView extends JetView {
	config() {
		const header = {
			type: "header",
			cols: [
				{fillspace: true},
				{
					view: "button",
					value: "Add activity",
					width: 150,
					css: "icon-btn",
					click: () => {
						this.win1.showWindow();
					}
				}
			]
		};
		const grid = {
			view: "datatable",
			localId: "table",
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					template: "{common.checkbox()}",
					fillspace: 1,
					checkValue: "Open",
					uncheckValue: "Close",
					minWidth: 30
				},
				{
					id: "TypeID",
					header: [
						"Activity type",
						{
							content: "richSelectFilter",
							suggest: {
								body: {
									template: (o) => {
										if (o.id === "$webix_empty") return "";
										return activityType.getItem(o.id).Value;
									}
								}
							},
							compare(item, value, data) {
								if (data.TypeID === +value) return true;
								return false;
							}
						}
					],
					sort: "text",
					template: (o) => {
						const type = activityType.getItem(o.TypeID);
						return `${type ? type.Value : "-"}`;
					},
					fillspace: 5
				},
				{
					id: "DueDate",
					header: ["Due date", {content: "datepickerFilter"}],
					sort: "date",
					format: webix.i18n.longDateFormatStr,
					fillspace: 5
				},
				{
					id: "Details",
					header: ["Details", {content: "textFilter"}],
					fillspace: 8,
					sort: "text"
				},
				{
					id: "ContactID",
					header: [
						"Contact",
						{
							content: "textFilter",
							compare(value, filter) {
								const contact = contacts.getItem(value);
								value = contact.FullName.toString().toLowerCase();
								filter = filter.toString().toLowerCase();
								return value.indexOf(filter) !== -1;
							}
						}
					],
					template: (o) => {
						const contact = contacts.getItem(o.ContactID);
						return `${contacts ? contact.FullName : "Unknown person"}`;
					},
					sort: "text",
					fillspace: 4
				},
				{
					id: "edit",
					header: "",
					template: "<span class='webix_icon far fa-edit'></span>",
					css: "edit",
					minWidth: 30,
					fillspace: 1
				},
				{
					id: "bin",
					header: "",
					template: "<span class='webix_icon far fa-trash-alt'></span>",
					css: "delete",
					minWidth: 30,
					fillspace: 1
				}
			],
			onClick: {
				"fa-trash-alt": (event, id) => {
					this.webix
						.confirm({
							title: "Are you sure?",
							type: "confirm-warning",
							ok: "Yes",
							cancel: "No",
							text: "You will delete the item permanently!"
						})
						.then(() => activities.remove(id));
				},
				"fa-edit": (event, id) => {
					this.win1.showWindow(id);
				}
			}
		};
		return {
			rows: [header, grid]
		};
	}

	init() {
		const table = this.$$("table");
		this.webix.promise
			.all([activities.waitData, contacts.waitData, activityType.waitData])
			.then(() => table.parse(activities));
		this.win1 = this.ui(EditForm);
		this.on(activities, "onAfterAdd", (id) => {
			table.select(id);
			table.showItem(id);
		});
	}
}
