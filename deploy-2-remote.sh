git pull

cd ~/b_ank_app/server
npm install
npm run build
pm2 restart b_ank_server

cd ~/b_ank_app/client
pm2 restart b_ank_client