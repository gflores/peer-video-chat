cd ./client

git checkout master
rm -rf dist
npm run build
git add dist/

git commit -am "[Automated] Generating Production Files"
git push origin master