import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import "../../styles/view.css";

export default class ListView extends JetView {
	config() {
		const list = {
			view: "list",
			localId: "list",
			select: true,
			width: 200,
			type: {
				template: o => `
        <div class="container-list">
          <image class="user" src="${
						o.Photo ||
						"https://lowcars.net/wp-content/uploads/2017/02/userpic.png"
					}" style="width:40px; height:40px">
          <h3 class="user-preview">${o.FullName || "Name Surname"} 
				<div>${o.Company || "Company"}</div>
          </h3>
		  
        </div>
          `,
				height: 55
			},
			on: {
				onBeforeSelect: (id) => {
					if (this.page === "contacts.editForm") {
						this.confirm("contacts.details");
						this.setParam("id", id, true);
					}
				},
				onAfterSelect: (id) => {
					if (this.page !== "contacts.editForm") {
						this.show("contacts.details");
						this.setParam("id", id, true);
					}
				}
			}
		};
		const addContact = {
			view: "button",
			value: "Add contact",
			localId: "addBtn",
			css: "details",
			click: () => (this.mode === "edit"
				? this.confirm("contacts.editForm")
				: this.show("contacts.editForm"))
		};
		return {
			cols: [{rows: [list, addContact]}, {$subview: true}]
		};
	}

	urlChange() {
		contacts.waitData.then(() => {
			this.mode = this.getSubView().getParam("mode");
			this.page = this.getUrl()[1].page;
		});
	}

	init() {
		this.list = this.$$("list");
		contacts.waitData.then(() => {
			this.list.parse(contacts);
			this.selectUser();
		});
		webix.dp(contacts).attachEvent("onAfterSave", (res) => {
			if (res.id) {
				this.setParam("id", res.id, true);
				this.list.select(res.id);
			}
			else {
				this.setParam("id", "", true);
				this.selectUser();
			}
		});
	}

	selectUser() {
		const id = this.getParam("id");
		if (contacts.exists(id)) {
			this.list.select(id);
		}
		else this.list.select(contacts.getFirstId());
		this.show("contacts.details");
	}

	confirm(page) {
		this.webix
			.confirm({
				title: "Are you sure?",
				type: "confirm-warning",
				ok: "Yes",
				cancel: "No",
				text: "All changes will be lost!"
			})
			.then(() => {
				if (page === "contacts.editForm") this.list.unselectAll();
				this.show(page);
			});
	}
}
