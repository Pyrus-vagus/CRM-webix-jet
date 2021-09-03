import { JetView } from "webix-jet";
import { activities } from "../../models/activities";
import { activityType } from "../../models/activitytype";
import { contacts } from "../../models/contacts";
import "../../styles/view.css";

export default class EditForm extends JetView {
  constructor(app, name, param) {
    super(app);
    this._param = param;
    this._name = name;
  }
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
            template: `${this._name} activity`,
            type: "header",
          },
          { view: "text", name: "Details", label: "Details" },
          {
            view: "richselect",
            name: "TypeID",
            label: "Type",
            options: {
              body: {
                template: (o) => activityType.getItem(o.id).Value,
                data: activityType,
              },
            },
            invalidMessage: "Can't be empty",
          },
          {
            view: "richselect",
            name: "ContactID",
            label: "Contact",
            options: {
              body: {
                template: (o) => contacts.getItem(o.id).FullName,
                data: contacts,
              },
            },
            invalidMessage: "Can't be empty",
          },
          {
            cols: [
              {
                view: "datepicker",
                name: "DueDate",
                label: "Date",
              },
              {
                view: "datepicker",
                type: "time",
                name: "Time",
                label: "Time",
              },
            ],
          },
          {
            view: "checkbox",
            name: "State",
            checkValue: "Open",
            uncheckValue: "Close",
            labelRight: "Completed",
          },
          {
            margin: 10,
            cols: [
              {
                view: "button",
                localId: "saveButton",
                value: `${this._name === "Edit" ? "Save" : "Add"}`,
                css: "icon-btn",
              },
              {
                view: "button",
                localId: "cancelButton",
                value: "Cancel",
                css: "icon-btn",
              },
            ],
          },
        ],
        rules: {
          ContactID: this.webix.rules.isNotEmpty,
          TypeID: this.webix.rules.isNotEmpty,
        },
      },
    };
    return form;
  }

  showWindow(id) {
    if (id && activities.exists(id)) {
      this.$$("form").setValues(activities.getItem(id));
    }
    this.getRoot().show();
  }
  close() {
    const form = this.$$("form");
    form.clear();
    form.clearValidation();
    this.getRoot().hide();
  }
  init() {
    this.$$("saveButton").attachEvent("onItemClick", () => {
      const form = this.$$("form");
      if (!form.validate()) return false;
      const values = form.getValues();
      activities.waitSave(() => {
        if (this._name === "Add") {
          activities.add(values);
        } else if (form.isDirty()) activities.updateItem(values.id, values);
        this.close();
      });
    });
    this.$$("cancelButton").attachEvent("onItemClick", () => this.close());
  }
}
