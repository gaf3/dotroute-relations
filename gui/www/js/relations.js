window.DRApp = new DoTRoute.Application();

DRApp.load = function (name) {
    return $.ajax({url: name + ".html", async: false}).responseText;
}

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {});

DRApp.rest = function(type, url, data) {
    var response = $.ajax({
        type: type,
        url: url,
        data: data ? JSON.stringify(data) : (type != 'GET' ? '{}' : null),
        contentType: type != 'GET' ? "application/json" : null,
        dataType: "json",
        async: false
    });
    if ((response.status != 200) && (response.status != 201) && (response.status != 202)) {
        alert(type + ": " + url + " failed\n" + JSON.stringify(response.responseJSON, null, 2));
        throw (type + ": " + url + " failed");
    }
    return response.responseJSON;
};

DRApp.controller("Base", null, {
    home: function() {
        DRApp.render(this.it);
    }
});

DRApp.controller("Model", "Base", {
    model: null,
    url: function(params) {
        if (params && Object.keys(params).length) {
            return "api/" + this.model.singular + "?" + $.param(params);
        } else {
            return "api/" + this.model.singular;
        }
    },
    id_url: function() {
        return this.url() + "/" + DRApp.current.path.id;
    },
    route: function(action, id) {
        if (id) {
            DRApp.go(this.model.singular + "_" + action, id);
        } else {
            DRApp.go(this.model.singular + "_" + action);
        }
    },
    list: function() {
        this.it = DRApp.rest("GET",this.url());
        DRApp.render(this.it);
    },
    fields_input: function() {
        var input = {};
        input[this.model.singular] = {}
        for (var index = 0; index < this.it.fields.length; index++) {
            var field = this.it.fields[index];
            var value;
            if (field.readonly) {
                continue
            } else if (field.options && field.style != "select") {
                value = $('input[name=' + field.name + ']:checked').val();
            } else {
                value = $('#' + field.name).val();
            }
            if (value && value.length) {
                if (field.options) {
                    for (var option = 0; option < field.options.length; option++) {
                        if (value == field.options[option]) {
                            value = field.options[option];
                        }
                    }
                } else if (field.kind == "list" || field.kind == "dict") {
                    value = JSON.parse(value);
                } else if (field.kind == "int") {
                    value = Math.round(value);
                }
                input[this.model.singular][field.name] = value;
            } else if (field.kind == "list") {
                input[this.model.singular][field.name] = [];
            } else if (field.kind == "dict") {
                input[this.model.singular][field.name] = {};
            }
        }
        return input;
    },
    create: function() {
        this.it = DRApp.rest("OPTIONS", this.url());
        DRApp.render(this.it);
    },
    create_change: function() {
        this.it = DRApp.rest("OPTIONS", this.url(), this.fields_input());
        DRApp.render(this.it);
    },
    create_save: function() {
        var input = this.fields_input();
        this.it = DRApp.rest("OPTIONS", this.url(), input);
        if (this.it.errors.length) {
            DRApp.render(this.it);
        } else if (this.model.id) {
            this.route("retrieve", DRApp.rest("POST", this.url(), input)[this.model.singular].id);
        } else {
            this.route("list");
        }
    },
    retrieve: function() {
        this.it = DRApp.rest("OPTIONS", this.id_url());
        DRApp.render(this.it);
    },
    update: function() {
        this.it = DRApp.rest("OPTIONS", this.id_url());
        DRApp.render(this.it);
    },
    update_change: function() {
        this.it = DRApp.rest("OPTIONS", this.id_url(), this.fields_input());
        DRApp.render(this.it);
    },
    update_save: function() {
        var input = this.fields_input();
        this.it = DRApp.rest("OPTIONS", this.id_url(), input);
        if (this.it.errors.length) {
            DRApp.render(this.it);
        } else {
            DRApp.rest("PATCH", this.id_url(), input);
            this.route("retrieve", DRApp.current.path.id);
        }
    },
    delete: function() {
        if (confirm("Are you sure?")) {
            DRApp.rest("DELETE", this.id_url());
            this.route("list");
        }
    }
});

DRApp.partial("Header", DRApp.load("header"));
DRApp.partial("Form", DRApp.load("form"));
DRApp.partial("Footer", DRApp.load("footer"));

DRApp.template("Home", DRApp.load("home"), null, DRApp.partials);
DRApp.template("Fields", DRApp.load("fields"), null, DRApp.partials);
DRApp.template("List", DRApp.load("list"), null, DRApp.partials);
DRApp.template("Create", DRApp.load("create"), null, DRApp.partials);
DRApp.template("Retrieve", DRApp.load("retrieve"), null, DRApp.partials);
DRApp.template("Update", DRApp.load("update"), null, DRApp.partials);

DRApp.model = function(model) {

    DRApp.controller(model.title, "Model", {
        model: model
    });

    DRApp.route(model.singular + "_list", "/" + model.singular, "List", model.title, "list");
    DRApp.route(model.singular + "_create", "/" + model.singular + "/create", "Create", model.title, "create");

    if (model.id) {
        DRApp.route(model.singular + "_retrieve", "/" + model.singular + "/{id:^\\d+$}", "Retrieve", model.title, "retrieve");
        DRApp.route(model.singular + "_update", "/" + model.singular + "/{id:^\\d+$}/update", "Update", model.title, "update");
    }

};

DRApp.attach = function() {

    for (var model = 0; model < DRApp.models.length; model++) {
        if (!DRApp.controllers[DRApp.models[model].name]) {
            DRApp.model(DRApp.models[model]);
        }
    }

};
