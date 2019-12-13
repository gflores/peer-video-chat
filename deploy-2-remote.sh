git checkout master
git pull

projectName="peer-video-chat"

cd ~/$projectName/server
rm -rf dist
npm install
npm run build

now=$(pm2 pid $projectName"_server")
if [ -z $now ]; 
then
pm2 start dist/server.js --name $projectName"_server"
else
pm2 restart $projectName"_server"
fi

cd ~/$projectName/client
npm install --production
now=$(pm2 pid $projectName"_client")
if [ -z $now ]; 
then
pm2 start server.js --name $projectName"_client"
else
pm2 restart $projectName"_client"
fi