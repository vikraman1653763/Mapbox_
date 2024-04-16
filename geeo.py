from geoserver.catalog import Catalog

# Assuming geoserver_url, username, and password are defined
geoserver_url = "http://localhost:8080/geoserver/rest/"
username = "admin"
password = "geoserver"

# Create a Catalog object
cat = Catalog(geoserver_url, username=username, password=password)

# Get all layers from GeoServer
layers = cat.get_layers()

# Now you can use the layers list to get information about each layer
for layer in layers:
    print(layer.name)
