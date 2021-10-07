import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import filesCollection from "../../models/filesCollection";

export default class FilesView extends JetView {
	config() {
		const grid = {
			view: "datatable",
			localId: "table",
			select: true,
			columns: [
				{
					id: "name",
					header: "Name",
					sort: "text",
					fillspace: 10
				},
				{
					id: "changeDate",
					header: "Change date",
					sort: "date",
					format: webix.i18n.longDateFormatStr,
					fillspace: 7
				},
				{
					id: "sizetext",
					header: "Size",
					fillspace: 5,
					sort: "text"
				},
				{
					id: "bin",
					header: "",
					template: "<span class='webix_icon far fa-trash-alt'></span>",
					css: "delete",
					minWidth: 30,
					fillspace: 1
				},
				{fillspace: 1}
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
						.then(() => filesCollection.remove(id));
				}
			}
		};
		const uploader = {
			view: "uploader",
			autosend: false,
			localId: "uploader1",
			value: "Upload file",
			apiOnly: true,
			on: {
				onBeforeFileAdd: (obj) => {
					obj.changeDate = obj.file.lastModifiedDate;
					obj.ContactID = this.getParam("id", true);
					filesCollection.add(obj);
					return false;
				}
			}
		};

		return {rows: [grid, uploader]};
	}

	urlChange() {
		contacts.waitData.then(() => {
			const contactId = this.getParam("id", true);
			if (contactId && contacts.exists(contactId)) {
				filesCollection.filter(o => +o.ContactID === +contactId);
			}
		});
	}

	init() {
		this.$$("table").parse(filesCollection);
	}
}
