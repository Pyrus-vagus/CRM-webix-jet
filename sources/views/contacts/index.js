import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import "../../styles/view.css";
import DetailsView from "./details";
import EditContacts from "./editForm";

export default class ListView extends JetView {
	config() {
		const list = {
			view: "list",
			localId: "list",
			select: true,
			width: 200,
			type: {
				template: (o) => `
        <div class="container-list">
          <image class="user" src="${
						o.Photo ||
						"https://lowcars.net/wp-content/uploads/2017/02/userpic.png"
					}" style="width:40px">
          <h3 class="user-preview">${o.FullName || "Name Surname"} 
				<div>${o.Company || "Company"}</div>
          </h3>
		  
        </div>
          `,
				height: 55
			},
			on: {
				onAfterSelect: (id) => {
					this.setParam("id", id, true);
					this.show("contacts.details");
				}
			}
		};
		const addContact = {
			view: "button",
			value: "Add contact",
			localId: "addBtn",
			css: "details",
			click: () => {
				this.show("contacts.editForm");
			}
		};
		return {
			cols: [{rows: [list, addContact]}, {$subview: true}]
		};
	}

	init() {
		this.list = this.$$("list");
		contacts.waitData.then(() => {
			this.list.parse(contacts);
			const id = this.getParam("id");
			if (contacts.exists(id)) {
				this.list.select(id);
			} else this.list.select(contacts.getFirstId());
			this.show("contacts.details");
		});
		webix.dp(contacts).attachEvent("onAfterSave", (res) => {
			this.setParam("id", res.id, true);
			this.list.select(res.id);
		});
		this.on(this.app, "onEdit", () =>
			this.show("contacts.editForm").then(() =>
				this.app.callEvent("assignValues", [this.getParam("id"), true])
			)
		);
	}
}
