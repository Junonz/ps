require 'csv'

class PricePresenter < Middleman::Extension
  option :pricing_csv, 'data/prices.csv', 'Location of the Pricing CSV file'
  option :base_path, '/', 'Base path for any path helpers'

  def initialize(app, options_hash={}, &block)
    super

    @data = {}

    csv = CSV.read(options.pricing_csv, headers: true)
    parse(csv)
  end

  expose_to_config :network_areas
  expose_to_template :network_areas
  def network_areas
    @network_areas ||= data.keys
  end

  expose_to_config :network_area_path
  expose_to_template :network_area_path
  def network_area_path(network_area)
    options.base_path + dashify(network_area)
  end

  expose_to_template :consumption_bands
  def consumption_bands(network_area)
    data[network_area].consumption_bands
  end

  expose_to_template :dashify
  def dashify(string)
    string.downcase.gsub(/\W+/, '-').gsub(/(^-|-$)/, '')
  end

  expose_to_template :format_with_gst
  def format_with_gst(value)
    '$%0.4f' % (value.to_f * 1.15)
  end

  expose_to_template :month_names
  def month_names
    Date::ABBR_MONTHNAMES[1..-1] # The constant is 1 indexed, with 0 being nil
  end

  expose_to_template :months_with_current_first
  def months_with_current_first
    current_month = Date.today.month
    (month_names[current_month..-1] + month_names[0...current_month])
  end

private

  attr_reader :data

  def parse(csv)
    csv.each do |row|
      parse_network_area(row)
    end
  end

  def parse_network_area(row)
    network_area_name = row[NetworkArea::NAME_FIELD]
    return if network_area_name.blank?

    network_area = (data[network_area_name] ||= NetworkArea.new(network_area_name, []))

    parse_consumption_band(row, network_area)
  end

  def parse_consumption_band(row, network_area)
    consumption_band_name = row[ConsumptionBand::NAME_FIELD]
    consumption_band = network_area.consumption_bands.detect { |cb| cb.name == consumption_band_name }

    if consumption_band.nil?
      lower_limit = row[ConsumptionBand::LOWER_LIMIT_FIELD]
      upper_limit = row[ConsumptionBand::UPPER_LIMIT_FIELD]
      consumption_band = ConsumptionBand.new(consumption_band_name, network_area, lower_limit, upper_limit, [])
      network_area.consumption_bands << consumption_band
    end

    parse_rate(row, consumption_band)
  end

  def parse_rate(row, consumption_band)
    tariff_code = row[Rate::TARIFF_CODE_FIELD]
    rate = consumption_band.rates.detect { |r| r.code == tariff_code }

    if rate.nil?
      description = row[Rate::DESCRIPTION_FIELD]
      use_for_default = row[Rate::DEFAULT_FIELD] == 'Yes'
      unit_of_measure = row[Rate::UNIT_OF_MEASURE_FIELD]
      average = row[Rate::ANNUAL_AVERAGE_FIELD]
      months = row.fields(*month_names)

      rate = Rate.new(tariff_code, description, unit_of_measure, use_for_default, average, months)
      consumption_band.rates << rate
    else
      raise "Duplicate rate #{tariff_code} within #{consumption_band.network_area.name} #{consumption_band.name} consumption band"
    end
  end

  class NetworkArea < Struct.new(:name, :consumption_bands)
    NAME_FIELD = "Public Site Region Name"
  end

  class ConsumptionBand < Struct.new(:name, :network_area, :lower_limit, :upper_limit, :rates)
    NAME_FIELD = "Consumption Band Name"
    LOWER_LIMIT_FIELD = "Lower kWh p.a. Limit"
    UPPER_LIMIT_FIELD = "Upper kWh p.a. Limit"

    def label
      name.gsub(/(special|rates)/i, '').strip
    end

    def fixed_rates
      rates.select(&:fixed?)
    end

    def variable_rates
      rates.reject(&:fixed?)
    end
  end

  class Rate < Struct.new(:code, :description, :unit_of_measure, :default, :average, :months)
    TARIFF_CODE_FIELD = "Tariff Code"
    DESCRIPTION_FIELD = "Description"
    DEFAULT_FIELD = "Use for default"
    UNIT_OF_MEASURE_FIELD = "Unit of Measure"
    ANNUAL_AVERAGE_FIELD = "Annual Average"

    def fixed?
      code.match(/^Fixed/)
    end
  end
end

::Middleman::Extensions.register(:price_presenter, PricePresenter)
