MONGO_LOCATION="$HOME/mongodb-3.6.0-rc3"

mlaunch --replicaset --nodes 3 --binarypath $MONGO_LOCATION/bin --dir data --name rs
