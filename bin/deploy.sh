cd $(git rev-parse --show-toplevel) \
&& npm install \
&& mkdir -p "move" \
&& cp -f dist/* move \
&& (git checkout master \
&& cp -f move/* dist \
&& git add . \
&& git commit -m "Release from develop" \
&& git push \
&& git checkout develop \
&)