import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
  config() {
    let header = {
      type: "header",
      template: "header",
    };

    let menu = {
      view: "menu",
      id: "top:menu",
      css: "app_menu",
      width: 180,
      layout: "y",
      select: true,
      template: "<span class='webix_icon #icon#'></span> #value# ",
      data: [
        { value: "Contacts", id: "contacts.contacts", icon: "#" },
        { value: "Activities", id: "activities.table", icon: "#" },
        { value: "Settings", id: "settings.settings", icon: "#" },
      ],
    };

    let ui = {
      css: "app_layout",
      rows: [
        header,
        {
          type: "clean",
          paddingX: 5,
          cols: [
            {
              //paddingX: 5,
              //paddingY: 10,
              rows: [{ css: "webix_shadow_medium", rows: [menu] }],
            },
            {
              type: "wide",
              //paddingY: 10,
              //paddingX: 5,
              rows: [{ $subview: true }],
            },
          ],
        },
      ],
    };
    return ui;
  }

  init() {
    this.use(plugins.Menu, "top:menu");
  }
}
