import { JetView } from "webix-jet";
import { contacts } from "../../models/contacts";
import "../../styles/contacts.css";
export default class DetailsView extends JetView {
  config() {
    const left = {
      fillspace: true,
      localId: "left",
      template: function (o) {
        return `<h2 class="top">${o.FirstName || "Name"} ${
          o.LastName || "Surname"
        }</h2>
        <div class="container">
           <div class = "container-item container-picture">
             <img class="picture" src="${
               o.Photo ||
               "https://lowcars.net/wp-content/uploads/2017/02/userpic.png"
             }" alt="Image" style="width:100%">
             <span class = "status">${o.StatusID || "Status"}</span>
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
      css: "right-det",
      rows: [
        {
          height: 28,
        },
        {
          cols: [
            {
              view: "button",
              value: "Delete",
              icon: "fas fa-trash",
              css: "mybutton",
              inputWidth: 80,
              width: 80,
              inputHeight: 30,
              margin: {
                right: 10,
              },
            },
            {
              view: "button",
              value: "Edit",
              icon: "fas fa-edit",
              css: "mybutton",
              inputWidth: 80,
              width: 80,
              inputHeight: 30,
              margin: {
                right: 10,
              },
            },
          ],
        },
        {},
      ],
    };
    return { cols: [left, right] };
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
