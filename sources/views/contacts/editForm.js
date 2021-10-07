import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import statuses from "../../models/statuses";
import "../../styles/view.css";

export default class EditContacts extends JetView {
	config() {
		const headerLabel = {
			type: "header",
			template: o => `${o.name || "Add new"} contact`,
			localId: "headerLabel"
		};
		const buttons = {
			css: "details",
			cols: [
				{},
				{
					view: "button",
					value: "Cancel",
					click: () => {
						this.webix
							.confirm({
								title: "Are you sure?",
								type: "confirm-warning",
								ok: "Yes",
								cancel: "No",
								text: "All changes will be lost!"
							})
							.then(() => this.show("contacts.details"));
					}
				},
				{
					view: "button",
					value: "Add",
					localId: "saveBtn"
				}
			]
		};
		const form = {
			view: "form",
			localId: "form",
			cols: [
				{
					gravity: 5,
					margin: 20,
					rows: [
						{view: "text", label: "First Name", name: "FirstName"},
						{view: "text", label: "Last Name", name: "LastName"},
						{view: "datepicker", label: "Joining date", name: "StartDate"},
						{
							view: "richselect",
							label: "Status",
							name: "StatusID",
							options: {
								body: {
									template: "#Value#",
									data: statuses
								}
							}
						},
						{view: "text", label: "Job", name: "Job"},
						{view: "text", label: "Company", name: "Company"},
						{view: "text", label: "Website", name: "Website"},
						{view: "text", label: "Address", name: "Address"}
					]
				},
				{gravity: 1},
				{
					gravity: 5,
					margin: 20,
					rows: [
						{view: "text", label: "Email", name: "Email"},
						{view: "text", label: "Skype", name: "Skype"},
						{view: "text", label: "Phone", name: "Phone"},
						{view: "datepicker", label: "Birthday", name: "Birthday"},
						{
							cols: [
								{
									localId: "userPhoto",
									template: o => `<img src="${
										o.Photo ||
											"https://lowcars.net/wp-content/uploads/2017/02/userpic.png"
									}" alt="Image" width=100%>`,
									autoheight: true,
									type: "clean"
								},
								{
									rows: [
										{},
										{
											view: "uploader",
											multiple: "false",
											value: "Change photo",
											accept: "image/png, image/gif, image/jpeg",
											autosend: false,
											on: {
												onBeforeFileAdd: (o) => {
													const reader = new FileReader();
													reader.readAsDataURL(o.file);
													reader.onloadend = () => {
														this.userPhoto.setValues({Photo: reader.result});
													};
													return false;
												}
											}
										},
										{
											view: "button",
											value: "Delete photo",
											click: () => {
												this.webix
													.confirm({
														title: "Are you sure?",
														type: "confirm-warning",
														ok: "Yes",
														cancel: "No",
														text: "You will delete the picture permanently!"
													})
													.then(() => this.userPhoto.setValues({Photo: ""}));
											}
										}
									]
								}
							]
						}
					]
				}
			],
			rules: {
				FirstName: this.webix.rules.isNotEmpty,
				LastName: this.webix.rules.isNotEmpty,
				StartDate: this.webix.rules.isNotEmpty,
				Email: this.webix.rules.isEmail
			}
		};
		return {rows: [headerLabel, form, {css: "details"}, buttons]};
	}

	init() {
		this.Form = this.$$("form");
		this.userPhoto = this.$$("userPhoto");
		this.on(this.$$("saveBtn"), "onItemClick", () => this.saveForm());
	}

	urlChange() {
		contacts.waitData.then(() => {
			const id = this.getParam("id", true);
			this.addValue(id);
		});
	}

	addValue(id) {
		const mode = this.getParam("mode");
		if (mode === "edit" && id && contacts.exists(id)) {
			const data = contacts.getItem(id);
			this.Form.setValues(data);
			this.userPhoto.setValues({Photo: data.Photo});
			this.$$("headerLabel").setValues({name: "Edit"});
			this.$$("saveBtn").setValue("Save");
		}
		else {
			this.Form.clear();
			this.$$("headerLabel").setValues({name: "Add"});
			this.$$("saveBtn").setValue("Add");
		}
	}

	saveForm() {
		if (this.Form.validate()) {
			const values = this.Form.getValues();
			values.FullName = `${values.FirstName} ${values.LastName}`;
			values.Photo = this.userPhoto.getValues().Photo;
			if (!values.id) {
				contacts.add(values);
			}
			else contacts.updateItem(values.id, values);
			this.cleanForm();
			this.show("contacts.details");
		}
	}

	cleanForm() {
		this.Form.clear();
		this.Form.clearValidation();
	}
}
