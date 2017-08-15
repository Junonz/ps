describe("PriceCalculator", function() {
  describe("averageDailyCharge", function() {
    it("returns the same value for the flat rate", function() {
      var dailyCharges = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      var averageDailyCharge = Powershop.PriceCalculator.averageDailyCharge(dailyCharges);
      expect(averageDailyCharge).toBeCloseTo(1);
    });

    it("returns weighted average by the number of days in non leap year", function() {
      var dailyCharges = [1, 1.1, 1.2, 1.3, 1.3, 1.2, 1.1, 1.4, 1.2, 1.1, 1.2, 1];
      var averageDailyCharge = Powershop.PriceCalculator.averageDailyCharge(dailyCharges);
      expect(averageDailyCharge).toBeCloseTo(1.175068493150685);
    });
  });

  describe("averageKwhCharge", function() {
    it("takes discounts into account", function() {
      var profiles = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      var prices = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
      var discounts = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
      var averageKwhCharge = Powershop.PriceCalculator.averageKwhCharge(profiles, prices, discounts);
      expect(averageKwhCharge).toBeCloseTo(1.5);
    });

    it("returns weighted discounted charge by profile shape for each month", function() {
      var profiles = [410, 450, 500, 480, 520, 530, 540, 450, 420, 380, 300, 320];
      var prices = [1.687, 1.723, 1.712, 1.5, 1.6, 1.78, 1.85, 1.45, 1.2, 1.1, 1.05, 1.51];
      var discounts = [0.0145, 0.015, 0.02, 0.018, 0.02, 0.05, 0.04, 0.03, 0.02, 0.07, 0.0123, 0.0321];
      var averageKwhCharge = Powershop.PriceCalculator.averageKwhCharge(profiles, prices, discounts);
      expect(averageKwhCharge).toBeCloseTo(1.5165703773584907);
    });
  });
});


describe("GstDecorator", function() {
  describe("decorate", function() {
    it("adds 15% GST rate on top of the charge", function() {
      expect(1.15).toEqual(Powershop.GstDecorator.decorate(1));
    });
  });
});


var createProspectBeforeSelectingNetworkArea = function() {
  var data = {
    "token":"db61bfebe1ceec642996c40cda0fce81",
    "state":"requires_data",
    "account_type":"residential",
    "connection_identifier":null,
    "address":null,
    "primary_place_of_residence":null,
    "network_areas":{
      "3":"Auckland Central & Manukau",
      "4":"Auckland North & West",
      "5":"Wellington",
      "6":"Dunedin",
      "8":"Christchurch",
      "13":"Wairarapa",
      "15":"Manawatu",
      "16":"New Plymouth",
      "17":"Wanganui",
      "18":"South East Waikato, Thames Valley & Coromandel Penninsula",
      "19":"Tauranga",
      "20":"Hamilton",
      "22":"Rangitikei & Hawera",
      "23":"Queenstown",
      "24":"Central Otago",
      "25":"Kapiti and Horowhenua",
      "32":"Franklin & Papakura",
      "33":"Southland",
      "34":"Invercargill Central & Bluff",
      "35":"Hawkes Bay",
      "36":"Taupo",
      "37":"Rotorua",
      "40":"East Otago"
    }
  };
  var prospect = new Powershop.Prospect();
  prospect.update(data);
  return prospect;
};


var createProspectWithSelectedNetworkArea = function() {
  var data = {
    "token":"db61bfebe1ceec642996c40cda0fce81",
    "state":"indicative_powershop_costs",
    "account_type":"residential",
    "connection_identifier":null,
    "address":null,
    "primary_place_of_residence":true,
    "location":[
      "in",
      "New Plymouth"
    ],
    "registers":[
      {
        "name":"Uncontrolled",
        "usage_tariff_id":1
      },
      {
        "name":"Controlled",
        "usage_tariff_id":3
      }
    ],
    "profile":{
      "1":[ 398.6228, 385.1316, 418.2892, 421.104, 471.0636, 535.47, 580.6547999999999, 557.9535, 496.12500000000006, 460.2694, 406.2149999999999, 417.15459999999996 ],
      "3":[ 254.85719999999998, 236.04840000000004, 267.43080000000003, 258.096, 276.6564, 288.33, 299.1252, 300.43649999999997, 291.375, 294.2706, 282.28499999999997, 266.7054 ]
    },
    "powershop_prices":{
      "standard":{
        "daily":[ 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014 ],
        "kwh":{
          "1":[ 0.2, 0.2009, 0.2154, 0.2341, 0.2341, 0.2341, 0.2341, 0.2295, 0.2192, 0.2076, 0.2028, 0.2 ],
          "3":[ 0.2, 0.2009, 0.2154, 0.2341, 0.2341, 0.2341, 0.2341, 0.2295, 0.2192, 0.2076, 0.2028, 0.2 ]
        },
        "kwh_discount":{
          "1":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ],
          "3":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ]
        },
        "ppd":0
      },
      "low_user":{
        "daily":[ 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3 ],
        "kwh":{
          "1":[ 0.218313875, 0.219213875, 0.233713875, 0.252413875, 0.252413875, 0.252413875, 0.252413875, 0.247813875, 0.237513875, 0.225913875, 0.221113875, 0.218313875 ],
          "3":[ 0.218313875, 0.219213875, 0.233713875, 0.252413875, 0.252413875, 0.252413875, 0.252413875, 0.247813875, 0.237513875, 0.225913875, 0.221113875, 0.218313875 ]
        },
        "kwh_discount":{
          "1":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ],
          "3":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ]
        },
        "ppd":0
      }
    },
    "industry_plans":{
      "Contact Energy":{
        "49":"Low User All Day Economy",
        "50":"All Day Economy",
        "51":"Low User Anytime",
        "52":"Anytime",
        "53":"Anytime & Economy",
        "54":"Low User Anytime & Economy",
        "55":"Anytime - Online OnTime ",
        "56":"Low User Anytime - Online OnTime",
        "57":"All Day Economy - Online OnTime",
        "58":"Low User All Day Economy - Online OnTime ",
        "59":"Anytime & Economy - Online OnTime",
        "60":"Low User Anytime & Economy - Online OnTime"
      },
      "Genesis Energy":{
        "67":"Classic Anytime",
        "68":"Classic Anytime with Controlled",
        "69":"Classic Composite",
        "70":"Household Anytime",
        "71":"Household Composite",
        "108":"Household Anytime with Controlled"
      },
      "Meridian Energy":{
        "91":"Low User Anytime (Urban)",
        "103":"Anytime (Urban)",
        "128":"Low User Economy 24 (Urban)",
        "129":"Economy 24 (Urban)",
        "132":"Low User Anytime with Controlled (Urban)",
        "134":"Anytime with Controlled (Urban)"
      }
    },
    "monthly_dollar_totals":[ null, null, null, null, null, null, null, null, null, null, null, null ],
    "monthly_dollar_totals_source":null,
    "available_deals":[

    ]
  };
  var prospect = new Powershop.Prospect();
  prospect.update(data);
  return prospect;
};

var createProspectWithSelectedRetailerPlan = function() {
  var data = {
    "token":"db61bfebe1ceec642996c40cda0fce81",
    "state":"indicative_powershop_and_retailer_costs",
    "account_type":"residential",
    "connection_identifier":null,
    "address":null,
    "primary_place_of_residence":true,
    "location":[
      "in",
      "New Plymouth"
    ],
    "registers":[
      {
        "name":"Inclusive",
        "usage_tariff_id":2
      }
    ],
    "profile":{
      "2":[ 653.48, 621.18, 685.72, 679.2, 747.72, 823.8, 879.78, 858.39, 787.5, 754.54, 688.5, 683.86 ]
    },
    "powershop_prices":{
      "standard":{
        "daily":[ 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014 ],
        "kwh":{
          "2":[ 0.2, 0.2009, 0.2154, 0.2341, 0.2341, 0.2341, 0.2341, 0.2295, 0.2192, 0.2076, 0.2028, 0.2 ]
        },
        "kwh_discount":{
          "2":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ]
        },
        "ppd":0
      },
      "low_user":{
        "daily":[ 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3 ],
        "kwh":{
          "2":[ 0.218313875, 0.219213875, 0.233713875, 0.252413875, 0.252413875, 0.252413875, 0.252413875, 0.247813875, 0.237513875, 0.225913875, 0.221113875, 0.218313875 ]
        },
        "kwh_discount":{
          "2":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ]
        },
        "ppd":0
      }
    },
    "monthly_dollar_totals":[ null, null, null, null, null, null, null, null, null, null, null, null ],
    "monthly_dollar_totals_source":null,
    "retailer":{
      "name":"Genesis Energy"
    },
    "retailer_prices":{
      "standard":{
        "daily":[ 0.912, 0.912, 0.912, 0.912, 0.912, 0.912, 0.912, 0.912, 0.912, 0.912, 0.912, 0.912 ],
        "kwh":{
          "2":[ 0.2397, 0.2397, 0.2397, 0.2397, 0.2397, 0.2397, 0.2397, 0.2397, 0.2397, 0.2397, 0.2397, 0.2397 ]
        },
        "kwh_discount":{

        },
        "ppd":10
      }
    },
    "retailer_prices_as_of":"2015-06-11",
    "savings_guarantee":null,
    "available_deals":[ ]
  };
  var prospect = new Powershop.Prospect();
  prospect.update(data);
  return prospect;
};

var addGst = function(charge) {
  return charge * 1.15;
};

describe("Prospect", function() {
  describe("defaults", function() {
    var prospect = new Powershop.Prospect();

    it("tariff is a standard user", function() {
      expect(prospect.tariff).toBe("standard");
    });

    it("doesn't want to refine selection", function() {
      expect(prospect.refineSelection).toBe(false);
    });

    it("doesn't want to show price breakdown", function() {
      expect(prospect.showPriceBreakdown).toBe(false);
    });
  });

  describe("id", function() {
    it("returns proper prospect id", function() {
      expect(createProspectWithSelectedRetailerPlan().id()).toEqual("db61bfebe1ceec642996c40cda0fce81");
    });
  });

  describe("hasSelectedNetworkArea", function() {
    it("returns false when not selected yet", function() {
      expect(createProspectBeforeSelectingNetworkArea().hasSelectedNetworkArea()).toBe(false);
    });

    it("returns true when selected", function() {
      expect(createProspectWithSelectedNetworkArea().hasSelectedNetworkArea()).toBe(true);
    });
  });

  describe("selectedNetworkAreaName", function() {
    it("should return the selected network area name", function() {
      expect(createProspectWithSelectedNetworkArea().selectedNetworkAreaName()).toBe("New Plymouth");
    });
  });

  describe("canRefineDetails", function() {
    it("returns true if retailer plan wasn't selected yet", function() {

      expect(createProspectWithSelectedNetworkArea().canRefineDetails()).toBe(true);
    });

    it("returns false if retailer plan was selected", function() {
      expect(createProspectWithSelectedRetailerPlan().canRefineDetails()).toBe(false);
    });
  });

  describe("availableNetworkAreas", function() {
    it("matches the available network areas", function() {
      var sortedNetworkAreas = [
        { id: "3", name: "Auckland Central & Manukau" },
        { id: "4", name: "Auckland North & West" },
        { id: "24", name: "Central Otago" },
        { id: "8", name: "Christchurch" },
        { id: "6", name: "Dunedin" },
        { id: "40", name: "East Otago" },
        { id: "32", name: "Franklin & Papakura" },
        { id: "20", name: "Hamilton" },
        { id: "35", name: "Hawkes Bay" },
        { id: "34", name: "Invercargill Central & Bluff" },
        { id: "25", name: "Kapiti and Horowhenua" },
        { id: "15", name: "Manawatu" },
        { id: "16", name: "New Plymouth" },
        { id: "23", name: "Queenstown" },
        { id: "22", name: "Rangitikei & Hawera" },
        { id: "37", name: "Rotorua" },
        { id: "18", name: "South East Waikato, Thames Valley & Coromandel Penninsula" },
        { id: "33", name: "Southland" },
        { id: "36", name: "Taupo" },
        { id: "19", name: "Tauranga" },
        { id: "13", name: "Wairarapa" },
        { id: "17", name: "Wanganui" },
        { id: "5", name: "Wellington" },
      ];

      expect(createProspectBeforeSelectingNetworkArea().availableNetworkAreas()).toEqual(sortedNetworkAreas);
    });
  });

  describe("dailyCharges", function() {
    it("returns standard user daily charges", function() {
      var standardDailyCharges = [0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014].map(addGst);
      expect(createProspectWithSelectedNetworkArea().dailyCharges()).toEqual(standardDailyCharges);
    });

    it("returns low user daily charges when tariff changes", function() {
      var lowDailyCharges = [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3].map(addGst);
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.tariff = "low_user";
      expect(prospect.dailyCharges()).toEqual(lowDailyCharges);
    });
  });

  describe("averageDailyCharge", function() {
    it("returns standard user average daily charge", function() {
      expect(createProspectWithSelectedNetworkArea().averageDailyCharge()).toEqual(addGst(0.7014));
    });

    it("returns low user average daily charge when tariff changes", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.tariff = "low_user";
      expect(prospect.averageDailyCharge()).toBeCloseTo(addGst(0.3));
    });
  });

  describe("registers", function() {
    it("matches the registers", function() {
      var registers = [ { "name":"Uncontrolled", "usage_tariff_id":1 }, { "name":"Controlled", "usage_tariff_id":3 } ];
      expect(createProspectWithSelectedNetworkArea().registers()).toEqual(registers);
    });
  });

  describe("kwhCharges", function() {
    var register = { "name":"Controlled", "usage_tariff_id":3 };

    it("matches standard user charges", function() {
      var kwhCharges = [0.2, 0.2009, 0.2154, 0.2341, 0.2341, 0.2341, 0.2341, 0.2295, 0.2192, 0.2076, 0.2028, 0.2].map(addGst);
      expect(createProspectWithSelectedNetworkArea().kwhCharges(register)).toEqual(kwhCharges);
    });

    it("matches low user charges", function() {
      var kwhCharges = [0.218313875, 0.219213875, 0.233713875, 0.252413875, 0.252413875, 0.252413875, 0.252413875, 0.247813875, 0.237513875, 0.225913875, 0.221113875, 0.218313875].map(addGst);
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.tariff = "low_user";
      expect(prospect.kwhCharges(register)).toEqual(kwhCharges);
    });
  });

  describe("kwhDiscounts", function() {
    var register = { "name":"Controlled", "usage_tariff_id":3 };

    it("matches standard user discounts", function() {
      var discounts = [0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772].map(addGst);
      expect(createProspectWithSelectedNetworkArea().kwhDiscounts(register)).toEqual(discounts);
    });

    it("matches low user discounts", function() {
      var discounts = [0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772].map(addGst);
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.tariff = "low_user";
      expect(prospect.kwhDiscounts(register)).toEqual(discounts);
    });
  });

  describe("discountedKwhCharges", function() {
    it("matches discounted charges for the low user", function() {
      var discountedCharges = [0.20359387499999998, 0.204493875, 0.215993875, 0.233193875, 0.23449387500000002, 0.234193875, 0.234193875, 0.229593875, 0.21929387500000003, 0.20769387499999997, 0.20639387499999998, 0.20059387499999998].map(addGst);
      var register = { "name":"Controlled", "usage_tariff_id":3 };
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.tariff = "low_user";

      var result = prospect.discountedKwhCharges(register);
      discountedCharges.forEach(function(expected, index) {
        expect(expected).toBeCloseTo(result[index]);
      });
    });
  });

  describe("averageKwhCharge", function() {
    it("", function() {
      var register = { "name":"Controlled", "usage_tariff_id":3 };
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.tariff = "low_user";
      expect(prospect.averageKwhCharge(register)).toBeCloseTo(addGst(0.21905880187559015));
    });
  });

  describe("availableRetailers", function() {
    it("matches available retailers", function() {
      var availableRetailers = {
        "Contact Energy":{
          "49":"Low User All Day Economy",
          "50":"All Day Economy",
          "51":"Low User Anytime",
          "52":"Anytime",
          "53":"Anytime & Economy",
          "54":"Low User Anytime & Economy",
          "55":"Anytime - Online OnTime ",
          "56":"Low User Anytime - Online OnTime",
          "57":"All Day Economy - Online OnTime",
          "58":"Low User All Day Economy - Online OnTime ",
          "59":"Anytime & Economy - Online OnTime",
          "60":"Low User Anytime & Economy - Online OnTime"
        },
        "Genesis Energy":{
          "67":"Classic Anytime",
          "68":"Classic Anytime with Controlled",
          "69":"Classic Composite",
          "70":"Household Anytime",
          "71":"Household Composite",
          "108":"Household Anytime with Controlled"
        },
        "Meridian Energy":{
          "91":"Low User Anytime (Urban)",
          "103":"Anytime (Urban)",
          "128":"Low User Economy 24 (Urban)",
          "129":"Economy 24 (Urban)",
          "132":"Low User Anytime with Controlled (Urban)",
          "134":"Anytime with Controlled (Urban)"
        }
      };
      expect(createProspectWithSelectedNetworkArea().availableRetailers()).toEqual(availableRetailers);
    });
  });

  describe("retailerPlans", function() {
    it("matches available plans for Meridian", function() {
      var availableRetailerPlans = {
        "91":"Low User Anytime (Urban)",
        "103":"Anytime (Urban)",
        "128":"Low User Economy 24 (Urban)",
        "129":"Economy 24 (Urban)",
        "132":"Low User Anytime with Controlled (Urban)",
        "134":"Anytime with Controlled (Urban)"
      };
      expect(createProspectWithSelectedNetworkArea().retailerPlans("Meridian Energy")).toEqual(availableRetailerPlans);
    });
  });

  describe("prices", function() {
    it("returns standard user prices", function() {
      var prices = {
        "daily":[ 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014, 0.7014 ],
        "kwh":{
          "1":[ 0.2, 0.2009, 0.2154, 0.2341, 0.2341, 0.2341, 0.2341, 0.2295, 0.2192, 0.2076, 0.2028, 0.2 ],
          "3":[ 0.2, 0.2009, 0.2154, 0.2341, 0.2341, 0.2341, 0.2341, 0.2295, 0.2192, 0.2076, 0.2028, 0.2 ]
        },
        "kwh_discount":{
          "1":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ],
          "3":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ]
        },
        "ppd":0
      };
      expect(createProspectWithSelectedNetworkArea().prices()).toEqual(prices);
    });

    it("returns low user prices when low user tariff selected", function() {
      var prices = {
        "daily":[ 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3 ],
        "kwh":{
          "1":[ 0.218313875, 0.219213875, 0.233713875, 0.252413875, 0.252413875, 0.252413875, 0.252413875, 0.247813875, 0.237513875, 0.225913875, 0.221113875, 0.218313875 ],
          "3":[ 0.218313875, 0.219213875, 0.233713875, 0.252413875, 0.252413875, 0.252413875, 0.252413875, 0.247813875, 0.237513875, 0.225913875, 0.221113875, 0.218313875 ]
        },
        "kwh_discount":{
          "1":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ],
          "3":[ 0.01472, 0.01472, 0.01772, 0.01922, 0.01792, 0.01822, 0.01822, 0.01822, 0.01822, 0.01822, 0.01472, 0.01772 ]
        },
        "ppd":0
      };
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.tariff = "low_user";
      expect(prospect.prices()).toEqual(prices);
    });
  });
});


describe("ChargePresenter", function() {
  describe("format", function() {
    it("rounds the number to four decimal places", function() {
      expect(Powershop.ChargePresenter.format(2.22565)).toBe("$2.2257");
    });

    it("adds format to exactly four decimal places", function() {
      expect(Powershop.ChargePresenter.format(1)).toBe("$1.0000");
    });
  });
});


describe("UserTariffPresenter", function() {
  describe("format", function() {
    it("renders standard user tariff", function() {
      expect(Powershop.UserTariffPresenter.format("standard")).toBe("standard user");
    });

    it("renders low user tariff", function() {
      expect(Powershop.UserTariffPresenter.format("low")).toBe("low user");
    });

    it("renders cased standard user tariff", function() {
      expect(Powershop.UserTariffPresenter.format("standard", true)).toBe("Standard User");
    });

    it("renders cased low user tariff", function() {
      expect(Powershop.UserTariffPresenter.format("low_user", true)).toBe("Low User");
    });
  });
});


describe("RegisterConfigurationPresenter", function() {
  describe("format", function() {
    it("renders register", function() {
      var registers = [ { "name":"Uncontrolled", "usage_tariff_id":1 }, { "name":"Controlled", "usage_tariff_id":3 } ];
      expect(Powershop.RegisterConfigurationPresenter.format(registers)).toBe("Uncontrolled/Controlled");
    });
  });
});


describe("NetworkAreaView", function() {
  describe("canRender", function() {
    it("true when not selected network area", function() {
      var prospect = createProspectBeforeSelectingNetworkArea();
      expect(new Powershop.NetworkAreaView(prospect).canRender()).toBe(true);
    });

    it("false when selected network area", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      expect(new Powershop.NetworkAreaView(prospect).canRender()).toBe(false);
    });
  });
});


describe("PriceResultView", function() {
  describe("canRender", function() {
    it("false when not selected network area", function() {
      var prospect = createProspectBeforeSelectingNetworkArea();
      expect(new Powershop.PriceResultView(prospect).canRender()).toBe(false);
    });

    it("true when selected network area", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      expect(new Powershop.PriceResultView(prospect).canRender()).toBe(true);
    });
  });
});


describe("TellUsMoreView", function() {
  describe("canRender", function() {
    it("false when not selected network area", function() {
      var prospect = createProspectBeforeSelectingNetworkArea();
      expect(new Powershop.TellUsMoreView(prospect).canRender()).toBe(false);
    });

    it("false when selected retailer plan", function() {
      var prospect = createProspectWithSelectedRetailerPlan();
      expect(new Powershop.TellUsMoreView(prospect).canRender()).toBe(false);
    });

    it("false when wants to refine selection", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.refineSelection = true;
      expect(new Powershop.TellUsMoreView(prospect).canRender()).toBe(false);
    });

    it("true when doesn't want but can refine selection", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      expect(new Powershop.TellUsMoreView(prospect).canRender()).toBe(true);
    });
  });
});


describe("SeeYourPricesView", function() {
  describe("canRender", function() {
    it("false when not selected network area", function() {
      var prospect = createProspectBeforeSelectingNetworkArea();
      expect(new Powershop.SeeYourPricesView(prospect).canRender()).toBe(false);
    });

    it("true when doesn't want to see price breakdown", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      expect(new Powershop.SeeYourPricesView(prospect).canRender()).toBe(true);
    });

    it("false when doesn't want to see price breakdown", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.showPriceBreakdown = true;
      expect(new Powershop.SeeYourPricesView(prospect).canRender()).toBe(false);
    });
  });
});


describe("RefineDetailsView", function() {
  describe("canRender", function() {
    it("false when not selected network area", function() {
      var prospect = createProspectBeforeSelectingNetworkArea();
      expect(new Powershop.RefineDetailsView(prospect).canRender()).toBe(false);
    });

    it("false when selected retailer plan", function() {
      var prospect = createProspectWithSelectedRetailerPlan();
      expect(new Powershop.RefineDetailsView(prospect).canRender()).toBe(false);
    });

    it("true when wants to refine selection", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.refineSelection = true;
      expect(new Powershop.RefineDetailsView(prospect).canRender()).toBe(true);
    });

    it("false when doesn't want but can refine selection", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      expect(new Powershop.RefineDetailsView(prospect).canRender()).toBe(false);
    });
  });
});


describe("PriceBreakdownView", function() {
  describe("canRender", function() {
    it("false when not selected network area", function() {
      var prospect = createProspectBeforeSelectingNetworkArea();
      expect(new Powershop.PriceBreakdownView(prospect).canRender()).toBe(false);
    });

    it("false when doesn't want to see price breakdown", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      expect(new Powershop.PriceBreakdownView(prospect).canRender()).toBe(false);
    });

    it("true when wants to see price breakdown", function() {
      var prospect = createProspectWithSelectedNetworkArea();
      prospect.showPriceBreakdown = true;
      expect(new Powershop.PriceBreakdownView(prospect).canRender()).toBe(true);
    });
  });
});


describe("PriceBreakdownTableViewModel", function() {
  it("doesn't shift values on January", function() {
    var prospect = createProspectWithSelectedNetworkArea();
    var date = new Date(2015, 0, 15);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var vm = Powershop.PriceBreakdownTableViewModel(date, prospect);
    expect(vm.months).toEqual(months);
    expect(vm.registers[0].charges[0]).toBeCloseTo(addGst(0.2 - 0.01472));
  });

  it("shifts the data in June", function() {
    var prospect = createProspectWithSelectedNetworkArea();
    var date = new Date(2015, 5, 15);

    var vm = Powershop.PriceBreakdownTableViewModel(date, prospect);
    expect(vm.months[0]).toEqual("Jun");
    expect(vm.months[11]).toEqual("May");
    expect(vm.registers[0].charges[0]).toBeCloseTo(addGst(0.2341 - 0.01792));
  });
});
