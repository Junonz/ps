(function() {
  var AddressHierarchy, KeepMePosted, SupplyChecker,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AddressHierarchy = (function() {
    function AddressHierarchy() {
      this.populateSuburbs = __bind(this.populateSuburbs, this);
      this.populateDistricts = __bind(this.populateDistricts, this);
      this.populateRegions = __bind(this.populateRegions, this);
      this.areas = window.jsonstring;
      this.populate();
    }

    AddressHierarchy.prototype.populate = function() {
      this.populateRegions();
      this.form.find("select[name='address[region]']").change(this.populateDistricts);
      return this.form.find("select[name='address[district]']").change(this.populateSuburbs);
    };

    AddressHierarchy.prototype.populateRegions = function() {
      var area, select, _i, _len, _ref;
      select = this.form.find("select[name='address[region]']").empty();
      $("<option>Select a Region</option>").appendTo(select);
      _ref = this.areas.regions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        area = _ref[_i];
        $("<option />").html(area).appendTo(select);
      }
      return this.populateDistricts();
    };

    AddressHierarchy.prototype.populateDistricts = function() {
      var area, region, select, _i, _len, _ref;
      region = this.form.find("select[name='address[region]']").val();
      select = this.form.find("select[name='address[district]']").empty();
      $("<option>Select a District</option>").appendTo(select);
      if (this.areas.districts[region]) {
        select.removeAttr('disabled');
        _ref = this.areas.districts[region];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          area = _ref[_i];
          $("<option />").html(area).appendTo(select);
        }
      } else {
        select.attr('disabled', true);
      }
      return this.populateSuburbs();
    };

    AddressHierarchy.prototype.populateSuburbs = function() {
      var area, district, region, select, _i, _len, _ref, _results;
      region = this.form.find("select[name='address[region]']").val();
      district = this.form.find("select[name='address[district]']").val();
      select = this.form.find("select[name='address[suburb]']").empty();
      $("<option>Select a Suburb</option>").appendTo(select);
      if (this.areas.suburbs[region] && this.areas.suburbs[region][district]) {
        select.removeAttr('disabled');
        _ref = this.areas.suburbs[region][district];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          area = _ref[_i];
          _results.push($("<option />").html(area).appendTo(select));
        }
        return _results;
      } else {
        return select.attr('disabled', true);
      }
    };

    return AddressHierarchy;

  })();

  KeepMePosted = (function(_super) {
    __extends(KeepMePosted, _super);

    function KeepMePosted() {
      this.onSubmit = __bind(this.onSubmit, this);
      var key, value, _i, _len, _ref;
      this.form = $('#keep-me-posted-content').submit(this.onSubmit);
      KeepMePosted.__super__.constructor.call(this);
      if (typeof localStorage !== "undefined" && localStorage !== null) {
        if (value = localStorage['cached-address-address[region]']) {
          this.form.find("select[name='address[region]']").val(value).removeAttr('disabled');
          this.populateDistricts();
        }
        if (value = localStorage['cached-address-address[district]']) {
          this.form.find("select[name='address[district]']").val(value).removeAttr('disabled');
          this.populateSuburbs();
        }
        _ref = "region district suburb address1 address2 address3".split(/\s/);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (value = localStorage["cached-address-address[" + key + "]"]) {
            this.form.find("*[name='address[" + key + "]']").val(value).removeAttr('disabled');
            delete localStorage["cached-address-address[" + key + "]"];
          }
        }
      }
    }

    KeepMePosted.prototype.submit = function() {
      return this.form.submit();
    };

    KeepMePosted.prototype.onSubmit = function(e) {
      var _this = this;
      $.ajax({
        url: '/supply_check_v2/keep_me_posted',
        type: 'POST',
        dataType: 'text',
        data: this.form.serialize() + '&referrer=' + escape(window.location),
        statusCode: {
          422: function(response) {
            var error, error_li, _i, _len, _ref;
            $('#keep-posted-error div').html('');
            _ref = $.parseJSON(response.responseText).errors;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              error = _ref[_i];
              error_li = $("<span>Oops! " + error + "</span>");
              $('#keep-posted-error div').append(error_li);
            }
            return $('#keep-posted-error').show();
          }
        },
        success: function(response) {
          var Element;
          Element = {
            update: function(id, html) {
              return $("#" + id).html(html).show();
            }
          };
          if (response.match(/keep-posted-error/)) {
            return eval(response);
          } else {
            $("#keep_me_posted_enter_details").hide();
            return $("#keep_me_posted_success").show();
          }
        }
      });
      return e.preventDefault();
    };

    return KeepMePosted;

  })(AddressHierarchy);

  SupplyChecker = (function(_super) {
    __extends(SupplyChecker, _super);

    function SupplyChecker() {
      this.onSupplyCheck = __bind(this.onSupplyCheck, this);
      this.submit = __bind(this.submit, this);
      this.onSubmit = __bind(this.onSubmit, this);
      this.form = $("#supply_check_address_region").parents('form').submit(this.onSubmit);
      SupplyChecker.__super__.constructor.call(this);
    }

    SupplyChecker.prototype.onSubmit = function(e) {
      this.submit();
      return e.preventDefault();
    };

    SupplyChecker.prototype.showForm = function() {
      $("#enter_details").show();
      $("#supply_check_responses > div").hide();
      return false;
    };

    SupplyChecker.prototype.submit = function() {
      var attributes, input, _i, _len, _ref;
      $("#supply_check_responses > div").hide();
      if (typeof localStorage !== "undefined" && localStorage !== null) {
        _ref = this.form.find('input,select');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          input = _ref[_i];
          localStorage["cached-address-" + $(input).attr('name')] = $(input).val();
        }
      }
      attributes = this.form.serialize();
      attributes += "&address%5Baddress3%5D=Dummy+street";
      attributes += "&address%5Baddress2%5D=123";
      $.ajax({
        url: '/supply_check_v2/supply_check',
        data: attributes,
        type: 'POST',
        success: this.onSupplyCheck
      });
      return false;
    };

    SupplyChecker.prototype.onSupplyCheck = function(response) {
      var k, div, v, _ref,
        _this = this;
      div = $("#supply_check_errors div").empty().hide();
      _ref = response.errors;
      for (k in _ref) {
        v = _ref[k];
        $("<span>" + v + "</span>").appendTo(div);
        div.show();
      }
      if (response.status !== null) {
        $("#enter_details").hide();
      }
      $("#supply_check_responses > div").hide().filter("#" + response.status).show();
      if (response.status === "waiting_for_icp_details") {
        return setTimeout(function() {
          return $.ajax({
            url: '/supply_check_v2/waiting_for_icp_details',
            type: 'POST',
            success: _this.onSupplyCheck,
            data: {
              id: response.supply_check_request_id,
              count: response.count + 1
            }
          });
        }, 3000);
      }
    };

    return SupplyChecker;

  })(AddressHierarchy);

  $(document).ready(function() {
    window.keepMePosted = new KeepMePosted;
    return window.supplyChecker = new SupplyChecker;
  });

}).call(this);
