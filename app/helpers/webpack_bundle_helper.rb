module WebpackBundleHelper
  class BundleNotFound < StandardError; end

  def javascript_bundle_tag(entry, **options)
    path = asset_bundle_path "#{entry}.js"

    options = {
      src: path,
      defer: true,
    }.merge(options)

    if options[:async]
      options.delete :defer
    end

    javascript_include_tag '', **options
  end

  def stylesheet_bundle_tag(entry, **options)
    path = asset_bundle_path "#{entry}.css"

    options = {
      href: path
    }.merge(options)

    stylesheet_link_tag '', **options
  end

  def image_bundle_tag(entry, **options)
    raise ArgumentError, "Extname is missing with #{entry}" unless File.extname(entry).present?
    image_tag asset_bundle_path(entry), **options
  end

  private
  MANIFEST_PATH = 'public/packs/manifest.json'.freeze
  MANIFEST_TEST_PATH = 'public/packs-test/manifest.json'.freeze

  def asset_host
    Rails.application.config.asset_host || ''
  end

  def dev_server_host
    "http://#{Rails.application.config.dev_server_host}"
  end

  def dev_manifest
    OpenURI.open_uri "#{dev_server_host}/packs/manifest.json"
  end

  def test_manifest
    File.read MANIFEST_TEST_PATH
  end

  def pro_manifest
    File.read MANIFEST_PATH
  end

  def manifest
    return @manifest ||= JSON.parse(dev_manifest) if Rails.env.development?
    return @manifest ||= JSON.parse(test_manifest) if Rails.env.test?
    return @manifest ||= JSON.parse(pro_manifest)
  end

  def manifest
    @manifest ||= JSON.parse(File.read(MANIFEST_PATH))
  end

  def valid_entry?(entry)
    return true if manifest.key? entry
    raise BundleNotFound, "Could not find bundle with name #{entry}"
  end

  def asset_bundle_path(entry, **options)
    valid_entry? entry
    asset_path(asset_host + manifest.fetch(entry), **options)
  end
end
