git checkout master
git pull

projectName="peer-video-chat"


cd ~/$projectName/api
rm -rf dist
npm install
npm run build
now=$(pm2 pid $projectName"_api")
if [ -z $now ]; 
then
pm2 start dist/server.js --name $projectName"_api"
else
pm2 restart $projectName"_api"
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


cd ~/$projectName/app
npm install --production
now=$(pm2 pid $projectName"_app")
if [ -z $now ]; 
then
pm2 start server.js --name $projectName"_app"
else
pm2 restart $projectName"_app"
fi