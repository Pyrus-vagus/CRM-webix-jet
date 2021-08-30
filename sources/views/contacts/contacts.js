import { JetView } from "webix-jet";
import { contacts } from "../../models/contacts";
import "../../styles/contacts.css";
export default class ListView extends JetView {
  config() {
    const list = {
      view: "list",
      localId: "list",
      select: true,
      width: 200,
      type: {
        template: (obj) => `
        <div class="container-list">
          <image class="user" src="${
            obj.Photo ||
            "https://lowcars.net/wp-content/uploads/2017/02/userpic.png"
          }" style="width:40px">
          <h3 class="user-preview">${obj.FirstName || "Name"} ${
          obj.LastName || "Surname"
        } <span>${obj.Company || "Company"}</span></h3>
        </div>
          `,
        height: 55,
      },
      on: {
        onAfterSelect: (id) => {
          this.setParam("id", id, true);
        },
      },
    };
    return {
      cols: [list, { $subview: "contacts.details" }],
    };
  }
  init() {
    contacts.waitData.then(() => {
      this.$$("list").parse(contacts);
    });
  }
}
