import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import statuses from "../../models/statuses";
import "../../styles/view.css";
import TableContacts from "./tabbar";

export default class DetailsView extends JetView {
	config() {
		const left = {
			type: "clean",
			gravity: 3,
			localId: "left",
			template(o) {
				const status = statuses.getItem(o.StatusID);
				return `<h2 class="top">${o.FullName || "Name Surname"}</h2>
        <div class="container">
           <div class = "container-item container-picture">
             <img class="picture" src="${
								o.Photo ||
								"https://lowcars.net/wp-content/uploads/2017/02/userpic.png"
							}" alt="Image" style="width:80%">
             <span class = "status">${
								status ? status.Value : "Status"
							} <span class="fas fa-${status ? status.Icon : ""}"></span>
           </div>
           <ul class="fa-ul list container-item">
             <li><span class="fa-li"><i class="fas fa-envelope"></i></span>${
								o.Email || "email"
							}</li>
             <li><span class="fa-li"><i class="fab fa-skype"></i></span>${
								o.Skype || "skype"
							}</li>
             <li><span class="fa-li"><i class="fas fa-tag"></i></span>${
								o.Job || "job"
							}</li>
             <li><span class="fa-li"><i class="fas fa-briefcase"></i></span>${
								o.Company || "company"
							}</li>
           </ul>
           <ul class="fa-ul list container-item" >
             <li><span class="fa-li"><i class="far fa-calendar-alt"></i></span>${
								webix.i18n.longDateFormatStr(o.Birthday) || "date of birth"
							}</li>
             <li><span class="fa-li"><i class="fas fa-map-marker-alt"></i></span>${
								o.Address || "Not specified"
							}</li>
           </ul>
        </div>`;
			}
		};
		const right = {
			rows: [
				{
					height: 15
				},
				{
					margin: 10,
					cols: [
						{
							view: "button",
							label:
								"<span class='webix_icon far fa-trash-alt' style='color:black'></span><span class='text'>Delete</span>",
							css: "icon-btn",
							width: 78,
							height: 35,
							click: () => {
								const id = this.getParam("id", true);
								this.webix
									.confirm({
										title: "Are you sure?",
										type: "confirm-warning",
										ok: "Yes",
										cancel: "No",
										text: "You will delete the item permanently!"
									})
									.then(() => {
										contacts.remove(id);
									});
							}
						},
						{
							view: "button",
							label:
								"<span class='webix_icon far fa-edit' style='color:black'></span><span class='text'>Edit</span>",
							css: "icon-btn",
							width: 78,
							height: 35,
							click: () => {
								const id = this.getParam("id", true);
								this.app.callEvent("onEdit", [id]);
							}
						}
					]
				},
				{}
			]
		};
		return {
			rows: [{cols: [left, right], css: "details"}, {$subview: TableContacts}]
		};
	}

	urlChange() {
		contacts.waitData.then(() => {
			const id = this.getParam("id", true) || contacts.getFirstId();
			if (id && contacts.exists(id)) {
				const values = contacts.getItem(id);
				this.$$("left").setValues(values);
			}
		});
	}
}
