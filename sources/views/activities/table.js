import { JetView } from "webix-jet";
import { contacts } from "../../models/contacts";
import { activities } from "../../models/activities";
import { activityType } from "../../models/activitytype";
import "../../styles/contacts.css";
export default class ListView extends JetView {
  config() {
    const header = {
      type: "header",
      cols: [{ fillspace: true }, { view: "button", value: "Add activity" }],
    };
    const grid = {
      view: "datatable",
      localId: "table",
      columns: [
        {
          id: "ch1",
          header: "",
          template: "{common.checkbox()}",
          fillspace: 1,
        },
        {
          id: "TypeID",
          header: [
            "Activity type",
            {
              content: "richSelectFilter",
              suggest: {
                body: {
                  template: (obj) => {
                    if (obj.id == "$webix_empty") return "";
                    else return activityType.getItem(obj.id).Value;
                  },
                },
              },
              compare: function (item, value, data) {
                if (data.TypeID == value) return true;
                return false;
              },
            },
          ],
          template: (o) => {
            const type = activityType.getItem(o.TypeID);
            return `${type ? type.Value : "-"}`;
          },
          fillspace: 5,
        },
        {
          id: "DueDate",
          header: ["Due date", { content: "datepickerFilter" }],
          format: webix.i18n.longDateFormatStr,
          fillspace: 4,
        },
        {
          id: "Details",
          header: ["Details", { content: "textFilter" }],
          fillspace: 8,
        },
        {
          id: "ContactID",
          header: [
            "Contact",
            {
              content: "textFilter",
              compare: function (value, filter) {
                const contact = contacts.getItem(value);
                const name = `${contact.FirstName} ${contact.LastName}`;
                value = name.toString().toLowerCase();
                filter = filter.toString().toLowerCase();
                return value.indexOf(filter) === 0;
              },
            },
          ],
          template: (o) => {
            const contact = contacts.getItem(o.ContactID);
            return `${
              contacts
                ? contact.FirstName + " " + contact.LastName
                : "Unknown person"
            }`;
          },
          fillspace: 4,
        },
        {
          id: "edit",
          header: "",
          template: "<span class='webix_icon far fa-edit'></span>",
          fillspace: 1,
        },
        {
          id: "bin",
          header: "",
          template: "<span class='webix_icon far fa-trash-alt'></span>",
          fillspace: 1,
        },
      ],
    };
    return { rows: [header, grid] };
  }
  init() {
    activities.waitData.then(() => {
      this.$$("table").parse(activities);
    });
    contacts.waitData.then(() => this.$$("table").refresh());
    activityType.waitData.then(() => this.$$("table").refresh());
  }
}
