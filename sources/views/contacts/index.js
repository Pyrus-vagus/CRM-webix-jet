import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import DetailsView from "./details";
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
					}" style="width:40px">
          <h3 class="user-preview">${o.FullName || "Name Surname"}
          <span>${o.Company || "Company"}</span></h3>
        </div>
          `,
				height: 55
			},
			on: {
				onAfterSelect: (id) => {
					this.setParam("id", id, true);
				}
			}
		};
		return {
			cols: [list, DetailsView]
		};
	}

	init() {
		contacts.waitData.then(() => {
			this.$$("list").parse(contacts);
			const id = this.getParam("id");
			if (!contacts.exists(id)) {
				this.$$("list").select(contacts.getFirstId());
			}
			else if (id && contacts.exists(id)) {
				this.$$("list").select(id);
			}
		});
	}
}
