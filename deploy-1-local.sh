cd ./client

git checkout master
npm run build
git add dist/

git commit -am "[Automated] Generating Production Files"
git push