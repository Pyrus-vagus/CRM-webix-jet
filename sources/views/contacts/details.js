import { JetView } from "webix-jet";
import { contacts } from "../../models/contacts";
import { statuses } from "../../models/statuses";
import "../../styles/contacts.css";

export default class DetailsView extends JetView {
  config() {
    const left = {
      type: "clean",
      gravity: 3,
      localId: "left",
      template: function (o) {
        const status = statuses.getItem(o.StatusID);
        return `<h2 class="top">${o.FirstName || "Name"} ${
          o.LastName || "Surname"
        }</h2>
        <div class="container">
           <div class = "container-item container-picture">
             <img class="picture" src="${
               o.Photo ||
               "https://lowcars.net/wp-content/uploads/2017/02/userpic.png"
             }" alt="Image" style="width:100%">
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
               o.Birthday || "date of birth"
             }</li>
             <li><span class="fa-li"><i class="fas fa-map-marker-alt"></i></span>${
               o.Address || "location"
             }</li>
           </ul>
        </div>`;
      },
    };
    const right = {
      rows: [
        {
          height: 15,
        },
        {
          margin: 10,
          cols: [
            {
              view: "button",
              label:
                '<span class="webix_icon far fa-trash-alt" style="color:black"></span><span class="text">Delete</span>',
              css: "icon-btn",
              width: 78,
              height: 35,
            },
            {
              view: "button",
              label:
                '<span class="webix_icon far fa-edit" style="color:black"></span><span class="text">Edit</span>',
              css: "icon-btn",
              width: 78,
              height: 35,
            },
          ],
        },
        {},
      ],
    };
    return { cols: [left, right], css: "details" };
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
