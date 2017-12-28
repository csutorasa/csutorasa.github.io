cd $(git rev-parse --show-toplevel) && \
npm install && \
git checkout master && \
git add . && \
git commit -m "Release from develop" && \
git push && \
git checkout develop &
