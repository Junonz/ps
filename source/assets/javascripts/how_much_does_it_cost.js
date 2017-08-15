window.Powershop = window.Powershop || {};

Powershop.Controller = function() {
  var self = this;

  var API_URL = "/prospects/";

  var model = new Powershop.Prospect();
  var views = new Powershop.ViewEngine(model, self);

  var fail = function(jqxhr, status, error) {
    views.renderError();
    console.error(status);
  };

  var done = function(data) {
    model.update(data);
    views.render();
    views.loaded();
  };

  var update = function(options) {
    views.loading();
    $.ajax({
      url: API_URL + model.id(),
      method: "PUT",
      data: { prospect:  options }
    }).done(done).fail(fail);
  };

  self.createProspect = function() {
    var requestCsrf = $.ajax({ url: API_URL });
    var requestProspect = requestCsrf.then(function(data) {
      return $.ajax({
        url: API_URL,
        method: "POST",
        headers: { "X-CSRF-Token" : data.csrf_token }
      });
    });

    requestProspect.done(done).fail(fail);
  };

  self.refineSelection = function() {
    model.refineSelection = true;
    views.render();
  };

  self.showPriceBreakdown = function() {
    model.showPriceBreakdown = true;
    views.render();
    views.scrollToPriceBreakdown();
  };

  self.updateDetails = function(tariff, planId) {
    views.scrollToPriceCharge();
    model.tariff = tariff;

    if (planId === null) {
      views.render();
    } else {
      update({ industry_plan_id: planId });
    }
  };

  self.selectNetworkArea = function(networkAreaId) {
    update({
      selected_network_area_id: networkAreaId,
      primary_place_of_residence: true // without primary place of residence, there is no low user tariff
    });
  };
};

Powershop.PriceCalculator = {
  averageDailyCharge: function(dailyCharges) {
    var NON_LEAP_YEAR_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    weightedDailyCharges = dailyCharges.reduce(function(accumulator, dailyCharge, index) {
      return accumulator + (dailyCharge * NON_LEAP_YEAR_MONTH_DAYS[index]);
    }, 0);

    return weightedDailyCharges / 365;
  },

  averageKwhCharge: function(usageProfiles, prices, discounts) {
    weightedPrices = prices.reduce(function(accumulator, price, index) {
      return accumulator + ((price - discounts[index]) * usageProfiles[index]);
    }, 0);
    yearlyUsage = usageProfiles.reduce(function(accumulator, usageProfile) {
      return accumulator + usageProfile;
    }, 0);

    return weightedPrices / yearlyUsage;
  }
};

Powershop.GstDecorator = {
  decorate: function(charge) {
    var GST_RATE = 1.15;
    return charge * GST_RATE;
  }
};

Powershop.Prospect = function() {
  var self = this;
  var data = {};

  self.tariff = "standard";
  self.refineSelection = false;
  self.showPriceBreakdown = false;

  self.update = function(newData) {
    data = newData;
  };

  self.id = function() {
    return data.token;
  };

  self.hasSelectedNetworkArea = function() {
    return data.network_areas === undefined || data.network_areas.size === 0;
  };

  self.selectedNetworkAreaName = function() {
    var NETWORK_AREA_NAME_INDEX = 1;
    return data.location[NETWORK_AREA_NAME_INDEX];
  };

  self.canRefineDetails = function() {
    return data.industry_plans !== undefined;
  };

  self.availableNetworkAreas = function() {
    var result = [];
    for (var id in data.network_areas) {
      result.push({ id: id, name: data.network_areas[id] });
    }
    return result.sort(function(a, b) { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0; } );
  };

  self.dailyCharges = function() {
    return self.prices().daily.map(Powershop.GstDecorator.decorate);
  };

  self.averageDailyCharge = function() {
    return Powershop.PriceCalculator.averageDailyCharge(self.dailyCharges());
  };

  self.registers = function() {
    return data.registers;
  };

  self.kwhCharges = function(register) {
    return self.prices().kwh[register.usage_tariff_id].map(Powershop.GstDecorator.decorate);
  };

  self.kwhDiscounts = function(register) {
    return self.prices().kwh_discount[register.usage_tariff_id].map(Powershop.GstDecorator.decorate);
  };

  self.discountedKwhCharges = function(register) {
    return self.kwhCharges(register).map(function(charge, index) {
      return charge - self.kwhDiscounts(register)[index];
    });
  };

  self.averageKwhCharge = function(register) {
    var profiles = data.profile[register.usage_tariff_id];
    return Powershop.PriceCalculator.averageKwhCharge(profiles, self.kwhCharges(register), self.kwhDiscounts(register));
  };

  self.availableRetailers = function() {
    return data.industry_plans;
  };

  self.retailerPlans = function(selectedRetailer) {
    return data.industry_plans[selectedRetailer];
  };

  self.prices = function() {
    if (!!data.powershop_prices) {
      return data.powershop_prices[self.tariff];
    }

    return null;
  };

  self.callForPriceMessage = function() {
    return data.call_for_price_message;
  };
};

Powershop.ChargePresenter = {
  format: function(charge) {
    var DECIMAL_PLACES = 4;
    var ROUNDING_COEFICIENT = Math.pow(10, DECIMAL_PLACES);
    return "$"+ (Math.round(charge * ROUNDING_COEFICIENT) / ROUNDING_COEFICIENT).toFixed(4);
  }
};

Powershop.UserTariffPresenter = {
  format: function(type, titleCased) {
    if (type === "standard") {
      return titleCased ? "Standard User" : "standard user";
    } else {
      return titleCased ? "Low User" : "low user";
    }
  }
};

Powershop.RegisterConfigurationPresenter = {
  format: function(registers) {
    return registers.map(function(register) { return register.name; }).join("/");
  }
};

Powershop.ViewEngine = function(model, controller) {
  var self = this;

  var views = [new Powershop.NetworkAreaView(model, controller),
               new Powershop.PriceResultView(model, controller),
               new Powershop.PriceResultCallForPricesView(model, controller),
               new Powershop.TellUsMoreView(model, controller),
               new Powershop.SeeYourPricesView(model, controller),
               new Powershop.RefineDetailsView(model, controller),
               new Powershop.PriceBreakdownView(model, controller)];

  var errorView = $("#error-view");

  self.render = function() {
    errorView.hide();
    views.forEach(function(view) {
      view.html.container.hide();
      for (var element in view.html) { view.html[element].off(); }

      if (view.canRender()) {
        view.render();
      }
    });
  };

  self.loading = function() {
    $("#calculator").addClass("loading on");
    $("#winky-loading").fadeIn();
  };

  self.loaded = function() {
    $(".loading").addClass("finished");
    $("#winky-loading").fadeOut();
    setTimeout(function() { $("#calculator").removeClass("loading on finished"); }, 200);
  };

  self.scrollToPriceCharge = function() {
    $("html, body").animate({ scrollTop: $("#price-result").offset().top }, 1000);
  };

  self.scrollToPriceBreakdown = function() {
    $("html, body").animate({ scrollTop: $("#price-breakdown").offset().top }, 1000);
  };

  self.renderError = function() {
    views.forEach(function(view) { view.html.container.hide(); });
    self.loaded();
    errorView.show();
  };
};

Powershop.NetworkAreaView = function(prospect, controller) {
  var self = this;

  self.html = {
    container: $("#network-area"),
    availableNetworkAreas: $("#available-network-areas"),
    form: $("#available-network-areas-form")
  };

  self.canRender = function() {
    return !prospect.hasSelectedNetworkArea();
  };

  self.render = function() {
    self.html.container.show();
    self.renderAvailableNetworkAreas();

    self.html.form.on("submit", function(e) {
      e.preventDefault();
      controller.selectNetworkArea(self.html.availableNetworkAreas.val());
    });
  };

  self.renderAvailableNetworkAreas = function() {
    self.html.availableNetworkAreas.empty();
    prospect.availableNetworkAreas().forEach(function(area) {
      self.html.availableNetworkAreas.append($('<option>', { value: area.id, text: area.name }));
    });
  };
};

Powershop.PriceResultCallForPricesView = function(prospect, controller) {
  var self = this;

  self.html = {
    container: $("#no-price-result"),
    networkArea: $("#no-price-result-network-area"),
    registerConfiguration: $("#price-result-register-configuration"),
    contactForPricing: $("#contact-for-pricing-message")
  };

  self.canRender = function() {
    return prospect.hasSelectedNetworkArea() && !!prospect.callForPriceMessage();
  };

  self.render = function() {
    self.html.container.show();
    self.html.networkArea.text(prospect.selectedNetworkAreaName());
    self.html.registerConfiguration.text(Powershop.RegisterConfigurationPresenter.format(prospect.registers()));
    self.html.contactForPricing.text(prospect.callForPriceMessage());
  };
};

Powershop.PriceResultView = function(prospect, controller) {
  var self = this;

  self.html = {
    container: $("#price-result"),
    dailyCharge: $("#daily-charge"),
    kwhCharge: $("#kwh-charge"),
    networkArea: $("#price-result-network-area"),
    userTariff: $("#price-result-user-tariff"),
    showPriceBreakdown: $("#over-year-info"),
    registerConfiguration: $("#price-result-register-configuration")
  };

  self.canRender = function() {
    return prospect.hasSelectedNetworkArea() && !prospect.callForPriceMessage();
  };

  self.render = function() {
    self.html.container.show();
    self.renderDailyCharge();
    self.renderKwhCharge();
    self.html.networkArea.text(prospect.selectedNetworkAreaName());
    self.html.userTariff.text(Powershop.UserTariffPresenter.format(prospect.tariff));
    self.html.registerConfiguration.text(Powershop.RegisterConfigurationPresenter.format(prospect.registers()));
    self.html.showPriceBreakdown.on("click", function(e) {
      e.preventDefault();
      controller.showPriceBreakdown();
    });
  };

  self.renderDailyCharge = function() {
    self.html.dailyCharge.text(Powershop.ChargePresenter.format(prospect.averageDailyCharge()));
  };

  self.renderKwhCharge = function() {
    self.html.kwhCharge.empty();
    prospect.registers().forEach(function(register) {
      var row = $("<tr>");
      row.append($("<th>", { text: (register.name + " ($/kWh)") }));
      row.append($("<td>", { text: (Powershop.ChargePresenter.format(prospect.averageKwhCharge(register))) }));
      self.html.kwhCharge.append(row);
    });
  };
};

Powershop.TellUsMoreView = function(prospect, controller) {
  var self = this;

  self.html = {
    container: $("#tell-us-more"),
    refineSelection: $("#show-refine-selection"),
  };

  self.canRender = function() {
    return prospect.hasSelectedNetworkArea() && prospect.canRefineDetails() && !prospect.refineSelection && !prospect.callForPriceMessage();
  };

  self.render = function() {
    self.html.container.show();
    self.html.refineSelection.on("click", function(e) {
      e.preventDefault();
      controller.refineSelection();
    });
  };
};

Powershop.SeeYourPricesView = function(prospect, controller) {
  var self = this;

  self.html = {
    container: $("#see-your-prices"),
    showPriceBreakdown: $("#show-price-breakdown"),
  };

  self.canRender = function() {
    return prospect.hasSelectedNetworkArea() && !prospect.showPriceBreakdown && !prospect.callForPriceMessage();
  };

  self.render = function() {
    self.html.container.show();
    self.html.showPriceBreakdown.on("click", function(e) {
      e.preventDefault();
      controller.showPriceBreakdown();
    });
  };
};

Powershop.RefineDetailsView = function(prospect, controller) {
  var self = this;

  self.html = {
    container: $("#refine-details"),
    form: $("#refine-details-form"),
    availableRetailers: $("#available-retailers"),
    availableRetailerPlans: $("#available-retailer-plans"),
  };

  self.canRender = function() {
    return prospect.hasSelectedNetworkArea() && prospect.canRefineDetails() && prospect.refineSelection;
  };

  self.render = function() {
    self.html.container.fadeIn();
    self.renderAvailableRetailers();
    self.renderAvailableRetailerPlans();

    self.html.availableRetailers.on("change", function() { self.renderAvailableRetailerPlans(); });
    self.html.form.on("submit", function(e) {
      e.preventDefault();
      $(".not-you").hide();
      controller.updateDetails($("input[name=user-type]:checked").val(), self.html.availableRetailerPlans.val());
    });
  };

  self.renderAvailableRetailers = function() {
    self.html.availableRetailers.empty();
    self.html.availableRetailers.append($("<option>", { value: '', selected: true }));
    for (var retailer in prospect.availableRetailers()) {
      self.html.availableRetailers.append($('<option>', { value: retailer, text: retailer }));
    }
  };

  self.renderAvailableRetailerPlans = function() {
    self.html.availableRetailerPlans.empty();
    var selectedRetailer = self.html.availableRetailers.val();
    if (selectedRetailer) {
      var selectedRetailerPlans = prospect.retailerPlans(selectedRetailer);
      for (var plan in selectedRetailerPlans) {
        self.html.availableRetailerPlans.append($('<option>', { value: plan, text: selectedRetailerPlans[plan] }));
      }
    }
  };
};

Powershop.PriceBreakdownView = function(prospect, controller) {
  var self = this;

  self.html = {
    container: $("#price-breakdown"),
    table: $("#price-breakdown-body"),
    tableHead: $("#price-breakdown-head"),
    tariff: $("#breakdown-user-tariff"),
    networkArea: $("#breakdown-network-area"),
    registerConfiguration: $("#breakdown-configuration"),
  };

  self.canRender = function() {
    return prospect.hasSelectedNetworkArea() && prospect.showPriceBreakdown;
  };

  self.render = function() {
    self.html.container.fadeIn();
    self.html.table.empty();
    self.html.tableHead.empty();

    var vm = Powershop.PriceBreakdownTableViewModel(new Date(), prospect);
    self.renderMonths(vm.months);
    self.renderDailyCharges(vm.dailyCharges);
    self.renderKwhCharges(vm.registers);

    self.html.networkArea.text(prospect.selectedNetworkAreaName());
    self.html.tariff.text(Powershop.UserTariffPresenter.format(prospect.tariff, true));
    self.html.registerConfiguration.text(Powershop.RegisterConfigurationPresenter.format(prospect.registers()));
  };

  self.renderMonths = function(months) {
    var row = $("<tr class='months white-type'>");
    row.append($("<th>"));
    row.append($("<th>"));
    months.forEach(function(month) { row.append($("<th>", { text: month })); });
    row.append($("<th>", { text: "Annual Average" }));
    self.html.tableHead.append(row);
  };

  self.renderDailyCharges = function(dailyCharges) {
      self.renderRow("Daily", dailyCharges, prospect.averageDailyCharge(), "$/day");
  };

  self.renderKwhCharges = function(registers) {
    registers.forEach(function(register) {
      self.renderRow(register.name, register.charges, register.averageCharge, "$/kWh");
    });
  };

  self.renderRow = function(name, charges, averageCharge, unit) {
    var row = $("<tr>");
    row.append($("<th>", { text: name }));
    row.append($("<td>", { text: "(" + unit + ")" }));
    charges.forEach(function(charge) {
      row.append($("<td>", { text: Powershop.ChargePresenter.format(charge) }));
    });
    row.append($("<td>", { text: Powershop.ChargePresenter.format(averageCharge) }));
    self.html.table.append(row);
  };

  Powershop.PriceBreakdownTableViewModel = function(date, prospect) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var daily = prospect.dailyCharges();
    var registers = prospect.registers().map(function(register) {
      return {
        name: register.name,
        charges: prospect.discountedKwhCharges(register),
        averageCharge: prospect.averageKwhCharge(register)
      };
    });

    for (var i = 0; i < date.getMonth(); i++) {
      months.push(months.shift());
      daily.push(daily.shift());
      registers.forEach(function(register) {
        register.charges.push(register.charges.shift());
      });
    }

    return {
      months: months,
      dailyCharges: daily,
      registers: registers
    };
  };
};
