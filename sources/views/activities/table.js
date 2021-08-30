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
              content: "serverSelectFilter",
              options: activityType,
            },
          ],
          template: (o) => {
            const type = activityType.getItem(o.TypeID);
            return `${type ? type.Value : "-"}`;
          },
          fillspace: 5,
        },
        { id: "DueDate", header: "Due date", fillspace: 4 },
        { id: "Details", header: "Details", fillspace: 8 },
        {
          id: "ContactID",
          header: "Contact",
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
  }
}
