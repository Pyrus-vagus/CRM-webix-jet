import {JetView} from "webix-jet";

import activities from "../../models/activities";
import activityType from "../../models/activitytype";
import contacts from "../../models/contacts";
import "../../styles/view.css";

export default class EditForm extends JetView {
	config() {
		const form = {
			view: "popup",
			localId: "popup",
			position: "center",
			modal: true,
			width: 500,
			body: {
				view: "form",
				localId: "form",
				elements: [
					{
						localId: "template",
						template: (o) => `${o.name} activity`,
						type: "header"
					},
					{view: "text", name: "Details", label: "Details"},
					{
						view: "richselect",
						name: "TypeID",
						label: "Type",
						options: {
							body: {
								template: (o) => activityType.getItem(o.id).Value,
								data: activityType
							}
						},
						invalidMessage: "Can't be empty"
					},
					{
						view: "richselect",
						name: "ContactID",
						localId: "contact",
						label: "Contact",
						options: {
							body: {
								template: (o) => contacts.getItem(o.id).FullName,
								data: contacts
							}
						},
						invalidMessage: "Can't be empty"
					},
					{
						cols: [
							{
								view: "datepicker",
								name: "DueDate",
								label: "Date"
							},
							{
								view: "datepicker",
								type: "time",
								name: "Time",
								label: "Time"
							}
						]
					},
					{
						view: "checkbox",
						name: "State",
						checkValue: "Open",
						uncheckValue: "Close",
						labelRight: "Completed"
					},
					{
						margin: 10,
						cols: [
							{
								view: "button",
								localId: "saveButton",
								css: "icon-btn save-button"
							},
							{
								view: "button",
								localId: "cancelButton",
								value: "Cancel",
								css: "icon-btn"
							}
						]
					}
				],
				rules: {
					ContactID: this.webix.rules.isNotEmpty,
					TypeID: this.webix.rules.isNotEmpty
				}
			}
		};
		return form;
	}

	showWindow(id, contact) {
		const str = this.$$("template");
		const btn = this.$$("saveButton");
		if (id && activities.exists(id)) {
			this.Form.setValues(activities.getItem(id));
			str.setValues({name: "Edit"});
			btn.setValue("Save");
		} else {
			str.setValues({name: "Add"});
			btn.setValue("Add");
		}
		if (contact) {
			this.$$("contact").setValue(contact);
		}
		this.getRoot().show();
	}

	closePopup() {
		this.Form.clear();
		this.Form.clearValidation();
		this.getRoot().hide();
	}

	init() {
		this.Form = this.$$("form");
		this.on(this.$$("saveButton"), "onItemClick", () => {
			if (this.Form.validate()) {
				const values = this.Form.getValues();
				if (!values.id) {
					activities.add(values);
				} else if (this.Form.isDirty())
					activities.updateItem(values.id, values);
				this.closePopup();
			}
		});
		this.on(this.$$("cancelButton"), "onItemClick", () => this.closePopup());
	}
}
