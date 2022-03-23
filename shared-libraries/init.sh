echo "Initializing shared libraries, will install npm package and build the typescript bundles for each folder..."
cd http-client && npm i && tsc && cd ..
echo "http-client done..."
cd redis-client && npm i && tsc && cd ..
echo "redis-client done..."
cd logging && npm i && tsc index.d.ts && cd ..
echo "logging done..."
echo "Installed npm libraries and built all packages..."
