import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		let header = {
			localId: "top",
			type: "header",
			css: "top-header",
			template: o => `<h1 style="padding-left: 18%; font-weight: normal; font-size: 24px; margin:0">${o.value}</h1>`
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: o => `<span class="webix_icon ${o.icon}" style="padding-right: 10px"></span> ${o.value} `,
			data: [
				{value: "Contacts", id: "contacts", icon: "fas fa-users"},
				{
					value: "Activities",
					id: "activities",
					icon: "far fa-calendar-alt"
				},
				{value: "Settings", id: "settings", icon: "fas fa-cogs"}
			]
		};

		let ui = {
			type: "clean",
			css: "app_layout",
			rows: [
				header,
				{
					paddingX: 5,
					cols: [
						{
							rows: [{css: "webix_shadow_medium", rows: [menu]}]
						},
						{
							type: "wide",
							rows: [{$subview: true}]
						}
					]
				}
			]
		};
		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}

	urlChange() {
		const page = this.getUrl()[1].page;
		// const rawValue = page.substring(0, page.indexOf("."));
		const value = {
			value: page.charAt(0).toUpperCase() + page.slice(1)
		};
		this.$$("top").setValues(value);
	}
}
