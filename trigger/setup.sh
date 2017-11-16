MONGO_LOCATION="$HOME/mongodb-3.6.0-rc3"

mlaunch --replicaset --nodes 3 --binarypath $MONGO_LOCATION/bin --dir data --name rs

#mlaunch --sharded 2 --replicaset --nodes 2 --arbiter --config 3 --mongos 2 --binarypath $MONGO_LOCATION/bin
